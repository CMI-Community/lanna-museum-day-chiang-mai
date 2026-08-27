import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(
  await readFile(new URL("../../vercel.json", import.meta.url), "utf8"),
);

const PROJECT = "https://cmi.community/project/waytoagi/26-lanna-museum";
const ENGLISH = "https://cmi.community/en/project/waytoagi/26-lanna-museum";
const THAI = "https://cmi.community/th/project/waytoagi/26-lanna-museum";

function redirectFor(source, language) {
  return config.redirects.find((redirect) => {
    if (redirect.source !== source) return false;
    const query = redirect.has?.find(
      (condition) => condition.type === "query" && condition.key === "lang",
    );
    return language ? query?.value === language : query === undefined;
  });
}

test("cutover redirects map every supported legacy route to CMI", () => {
  assert.equal(redirectFor("/", "en")?.destination, ENGLISH);
  assert.equal(redirectFor("/", "th")?.destination, THAI);
  assert.equal(redirectFor("/")?.destination, PROJECT);

  for (const source of ["/recap", "/recap/"]) {
    assert.equal(redirectFor(source, "en")?.destination, `${ENGLISH}/recap`);
    assert.equal(redirectFor(source, "th")?.destination, `${THAI}/recap`);
    assert.equal(redirectFor(source)?.destination, `${PROJECT}/recap`);
  }
});

test("cutover redirects are ordered, permanent, and do not swallow assets", () => {
  assert.equal(config.redirects.length, 9);
  assert.ok(config.redirects.every((redirect) => redirect.permanent === true));
  assert.ok(config.redirects.every((redirect) => !redirect.source.includes("*")));

  for (const source of ["/", "/recap", "/recap/"]) {
    const matches = config.redirects.filter((redirect) => redirect.source === source);
    assert.equal(matches.at(-1)?.has, undefined);
  }
});
