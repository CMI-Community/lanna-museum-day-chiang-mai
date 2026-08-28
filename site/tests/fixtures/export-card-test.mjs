import { renderPatternCardPng } from "../../src/lib/archive.js";

async function assetAsUploadedFile(url, name) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`fixture asset failed: ${url}`);
  }
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
}

function regionVariance(context, x, y, width, height) {
  const { data } = context.getImageData(x, y, width, height);
  const channels = [[], [], []];

  for (let index = 0; index < data.length; index += 4) {
    channels[0].push(data[index]);
    channels[1].push(data[index + 1]);
    channels[2].push(data[index + 2]);
  }

  return channels.reduce((total, channel) => {
    const mean = channel.reduce((sum, value) => sum + value, 0) / channel.length;
    const variance =
      channel.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      channel.length;
    return total + variance;
  }, 0);
}

async function run() {
  const status = document.querySelector("#status");
  const result = document.querySelector("#result");
  const detailFile = await assetAsUploadedFile(
    "/assets/patterns/red-gold-textile.jpg",
    "uploaded-detail.jpg",
  );
  const contextFile = await assetAsUploadedFile(
    "/assets/museums/lanna-folklife-centre.jpg",
    "uploaded-context.jpg",
  );
  const detailUrl = URL.createObjectURL(detailFile);
  const contextUrl = URL.createObjectURL(contextFile);

  try {
    const blob = await renderPatternCardPng({
      archive_number: "TEST-0001",
      museum: "lanna_folklife",
      museumLabel: "兰纳民俗博物馆",
      collector_name: "大夏湖",
      source_title: "上传图片合成验证",
      observation: "这张测试卡必须同时包含上传的纹样局部图和完整作品图。",
      carrier_tags: ["织物"],
      structure_tags: ["重复"],
      material_tags: ["织物"],
      detail_image_urls: [detailUrl],
      context_image_urls: [contextUrl],
    });
    const exportedUrl = URL.createObjectURL(blob);
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const detailVariance = regionVariance(context, 120, 240, 120, 120);
    const contextVariance = regionVariance(context, 790, 660, 100, 80);
    const passed =
      canvas.width === 1080 &&
      canvas.height === 1350 &&
      blob.size > 100_000 &&
      detailVariance > 500 &&
      contextVariance > 500;

    result.src = exportedUrl;
    status.textContent = JSON.stringify(
      {
        status: passed ? "PASSED" : "FAILED",
        width: canvas.width,
        height: canvas.height,
        bytes: blob.size,
        detailVariance: Math.round(detailVariance),
        contextVariance: Math.round(contextVariance),
        collector: "大夏湖",
      },
      null,
      2,
    );
    document.documentElement.dataset.testStatus = passed ? "passed" : "failed";
  } finally {
    URL.revokeObjectURL(detailUrl);
    URL.revokeObjectURL(contextUrl);
  }
}

run().catch((error) => {
  document.querySelector("#status").textContent = `FAILED\n${error.stack || error}`;
  document.documentElement.dataset.testStatus = "failed";
});
