import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteDirectory = path.resolve(scriptDirectory, "..");
const buildDirectory = path.join(siteDirectory, "dist", "client");
const outputDirectory = path.resolve(
  siteDirectory,
  "..",
  "tmp",
  "vercel-text-preview",
);
const temporaryImageDirectory = await mkdtemp(
  path.join(os.tmpdir(), "lanna-vercel-preview-"),
);
const runFile = promisify(execFile);

const html = await readFile(path.join(buildDirectory, "index.html"), "utf8");
const scriptMatch = html.match(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
);
const stylesheetMatch = html.match(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/,
);

if (!scriptMatch || !stylesheetMatch) {
  throw new Error("Unable to locate the built JavaScript or stylesheet.");
}

const resolveBuildAsset = (publicPath) =>
  path.join(buildDirectory, publicPath.replace(/^\/+/, ""));

let javascript = await readFile(resolveBuildAsset(scriptMatch[1]), "utf8");
let stylesheet = await readFile(resolveBuildAsset(stylesheetMatch[1]), "utf8");

// The standard build contains many CJK font subsets. The preview keeps the
// typography stack and uses the visitor's system CJK fonts to stay lightweight.
stylesheet = stylesheet.replace(/@font-face\{[^}]*\}/g, "");

const dynamicImports = new Set(
  [...javascript.matchAll(/import\("(\.\/[^"]+\.js)"\)/g)].map(
    ([, assetPath]) => assetPath,
  ),
);

const extraModules = [];
for (const [index, assetPath] of [...dynamicImports].entries()) {
  const moduleName = `preview-module-${index}.js`;
  const moduleContents = await readFile(
    path.join(path.dirname(resolveBuildAsset(scriptMatch[1])), assetPath),
    "utf8",
  );
  javascript = javascript.replaceAll(
    `import("${assetPath}")`,
    `import("./${moduleName}")`,
  );
  extraModules.push([moduleName, moduleContents]);
}

const mimeTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

const referencedAssets = new Set(
  [...javascript.matchAll(/\/assets\/[A-Za-z0-9_./-]+/g)].map(
    ([assetPath]) => assetPath,
  ),
);

const assetEntries = [];
for (const assetPath of referencedAssets) {
  const extension = path.extname(assetPath).toLowerCase();
  const mimeType = mimeTypes.get(extension);
  if (!mimeType) {
    throw new Error(`Unsupported asset type in ${assetPath}`);
  }

  const sourcePath = resolveBuildAsset(assetPath);
  let contents;

  if (extension === ".jpg" || extension === ".jpeg") {
    const isQrCode = assetPath.includes("/registration/");
    const isPattern = assetPath.includes("/patterns/");
    const optimizedPath = path.join(
      temporaryImageDirectory,
      `${assetEntries.length}.jpg`,
    );

    await runFile("/usr/bin/sips", [
      "-Z",
      isQrCode ? "1100" : isPattern ? "760" : "1100",
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      isQrCode ? "82" : "48",
      sourcePath,
      "--out",
      optimizedPath,
    ]);
    contents = await readFile(optimizedPath);
  } else {
    contents = await readFile(sourcePath);
  }

  const dataUrl = `data:${mimeType};base64,${contents.toString("base64")}`;
  assetEntries.push([assetPath, dataUrl]);

  const quotedPath = JSON.stringify(assetPath);
  javascript = javascript.replaceAll(
    quotedPath,
    `globalThis.__LANNA_PREVIEW_ASSETS__[${quotedPath}]`,
  );
}

const maxAssetBundleCharacters = 2_500_000;
const assetBundles = [];
let currentBundle = [];
let currentBundleSize = 0;

for (const entry of assetEntries) {
  const entrySize = JSON.stringify(entry).length + 2;
  if (currentBundle.length && currentBundleSize + entrySize > maxAssetBundleCharacters) {
    assetBundles.push(currentBundle);
    currentBundle = [];
    currentBundleSize = 0;
  }
  currentBundle.push(entry);
  currentBundleSize += entrySize;
}

if (currentBundle.length) {
  assetBundles.push(currentBundle);
}

await rm(temporaryImageDirectory, { recursive: true, force: true });
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const [moduleName, moduleContents] of extraModules) {
  await writePreviewFile(moduleName, moduleContents);
}

const assetBundleNames = [];
for (const [index, entries] of assetBundles.entries()) {
  const bundleName = `preview-assets-${index}.js`;
  const bundleContents =
    "globalThis.__LANNA_PREVIEW_ASSETS__ ??= {};\n" +
    `Object.assign(globalThis.__LANNA_PREVIEW_ASSETS__, ${JSON.stringify(
      Object.fromEntries(entries),
    )});\n`;
  await writePreviewFile(bundleName, bundleContents);
  assetBundleNames.push(bundleName);
}

await writePreviewFile("main.js", javascript);
await writePreviewFile("styles.css", stylesheet);

const assetScripts = assetBundleNames
  .map((name) => `    <script src="/${name}"></script>`)
  .join("\n");

const previewHtml = html
  .replace(
    scriptMatch[0],
    () =>
      `<script>globalThis.__LANNA_PREVIEW_ASSETS__ = {};</script>\n${assetScripts}\n    <script type="module" src="/main.js"></script>`,
  )
  .replace(
    stylesheetMatch[0],
    () => '<link rel="stylesheet" href="/styles.css">',
  );

await writePreviewFile("index.html", previewHtml);

console.log(
  JSON.stringify({
    outputDirectory: path.relative(process.cwd(), outputDirectory),
    files: [
      "index.html",
      "main.js",
      "styles.css",
      ...assetBundleNames,
      ...extraModules.map(([moduleName]) => moduleName),
    ],
  }),
);

async function writePreviewFile(fileName, contents) {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, fileName), contents);
}
