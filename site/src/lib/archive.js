import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export async function fetchPublishedPatterns() {
  if (!supabase) {
    return [];
  }

  const result = await supabase
    .from("pattern_submissions")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("archive_number", { ascending: false })
    .limit(120);

  if (result.error) {
    throw result.error;
  }

  return result.data ?? [];
}

export async function submitPattern(formData) {
  if (!isSupabaseConfigured) {
    throw new Error("采集服务尚未连接");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/submit-pattern`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
    },
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "提交失败，请稍后重试");
  }

  return payload;
}

export function createLocalPreviewPattern(
  values,
  detailFiles,
  contextFiles,
  labelFiles = [],
) {
  const now = new Date();
  const localNumber = `PREVIEW-${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  return {
    id: `local-${now.getTime()}`,
    archive_number: localNumber,
    museum: values.museum,
    museumLabel:
      values.museum === "fam"
        ? "FAM Fahlanna Art Museum"
        : values.museum === "lanna_folklife"
          ? "兰纳民俗博物馆"
          : "其他来源",
    source_title: values.sourceTitle || "未命名纹样采集",
    source_location: values.sourceLocation || "来源待补充",
    observation: values.observation,
    verified_information: values.verifiedInformation || "来源信息待补充",
    open_question: values.openQuestion || "暂未填写",
    carrier_tags: values.carrier ? [values.carrier] : [],
    position_tags: values.position ? [values.position] : [],
    structure_tags: values.structure ? [values.structure] : [],
    material_tags: values.material ? [values.material] : [],
    collector_name: values.collectorName || "匿名采集者",
    detail_image_urls: detailFiles.map((file) => URL.createObjectURL(file)),
    context_image_urls: contextFiles.map((file) => URL.createObjectURL(file)),
    label_image_urls: labelFiles.map((file) => URL.createObjectURL(file)),
    captured_at: now.toISOString(),
    created_at: now.toISOString(),
    preview: true,
    localPreview: true,
  };
}

export function formatPatternCapturedAt(
  pattern,
  options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
  fallbackToCreated = false,
) {
  const value =
    pattern?.captured_at || (fallbackToCreated ? pattern?.created_at : "");
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Bangkok",
    ...options,
  }).format(date);
}

export async function prepareImageFile(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} 不是支持的图片格式`);
  }

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#fbf8f1";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.82);
  });

  if (!blob) {
    throw new Error(`${file.name} 无法处理`);
  }

  if (blob.size > 1.5 * 1024 * 1024) {
    throw new Error(`${file.name} 处理后仍超过 1.5MB，请换一张更小的图片`);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

function loadFallbackImage(blob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      resolve({
        source: image,
        close: () => URL.revokeObjectURL(objectUrl),
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("图片解码失败"));
    };
    image.src = objectUrl;
  });
}

async function loadCanvasImage(url, label) {
  if (!url) {
    throw new Error(`缺少${label}`);
  }

  let response;
  try {
    response = await fetch(url, { mode: "cors", credentials: "omit" });
  } catch {
    throw new Error(`${label}无法读取，请重新上传后再试`);
  }

  if (!response.ok) {
    throw new Error(`${label}无法读取，请重新上传后再试`);
  }

  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error(`${label}不是有效图片`);
  }

  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(blob);
    return {
      source: bitmap,
      close: () => bitmap.close(),
    };
  }

  return loadFallbackImage(blob);
}

function getImageDimensions(image) {
  return {
    width: image.naturalWidth || image.videoWidth || image.width,
    height: image.naturalHeight || image.videoHeight || image.height,
  };
}

function drawImageCover(context, image, x, y, width, height) {
  const source = getImageDimensions(image);
  const scale = Math.max(width / source.width, height / source.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (source.width - sourceWidth) / 2;
  const sourceY = (source.height - sourceHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function fitText(context, text, maxWidth) {
  const value = String(text || "");
  if (context.measureText(value).width <= maxWidth) {
    return value;
  }

  let fitted = value;
  while (fitted.length > 1 && context.measureText(`${fitted}…`).width > maxWidth) {
    fitted = fitted.slice(0, -1);
  }
  return `${fitted}…`;
}

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const characters = Array.from(String(text || ""));
  const lines = [];
  let current = "";

  characters.forEach((character) => {
    const next = `${current}${character}`;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current);
      current = character;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    visibleLines[maxLines - 1] = fitText(
      context,
      `${visibleLines[maxLines - 1]}…`,
      maxWidth,
    );
  }

  visibleLines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function drawBrandMark(context, x, y) {
  const dots = [
    ["#e34f7d", 0, 0],
    ["#ec7623", 14, 0],
    ["#4d9c54", 28, 0],
    ["#5c2683", 7, 13],
    ["#1e9fbd", 21, 13],
  ];

  dots.forEach(([color, offsetX, offsetY]) => {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x + offsetX, y + offsetY, 7, 0, Math.PI * 2);
    context.fill();
  });
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.size < 10_000) {
        reject(new Error("纹样卡图片生成失败"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

export async function renderPatternCardPng(pattern) {
  const detailUrl = pattern.detail_image_urls?.[0];
  const contextUrl = pattern.context_image_urls?.[0];
  const [detailImage, contextImage] = await Promise.all([
    loadCanvasImage(detailUrl, "纹样局部图片"),
    loadCanvasImage(contextUrl, "完整文物或作品图片"),
  ]);

  try {
    await document.fonts?.ready;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("当前浏览器无法生成纹样卡");
    }

    const purple = "#5c2683";
    const purpleDeep = "#351149";
    const paper = "#fbf8f1";
    const muted = "#6c6070";
    const orange = "#ec7623";
    const collectorName = pattern.collector_name?.trim() || "匿名采集者";
    const capturedAt = formatPatternCapturedAt(pattern, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const museumLabel =
      pattern.museumLabel ||
      (pattern.museum === "fam"
        ? "FAM Fahlanna Art Museum"
        : pattern.museum === "lanna_folklife"
          ? "兰纳民俗博物馆"
          : "其他来源");
    const tags = [
      ...(pattern.carrier_tags || []),
      ...(pattern.structure_tags || []),
      ...(pattern.material_tags || []),
    ].slice(0, 5);

    context.fillStyle = paper;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#bca7c4";
    context.lineWidth = 2;
    context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    drawBrandMark(context, 70, 70);
    context.fillStyle = purple;
    context.font = '700 20px "Noto Sans SC", sans-serif';
    context.fillText("CMI · LANNA PATTERN ARCHIVE", 122, 92);
    context.fillStyle = purpleDeep;
    context.font = '700 25px ui-monospace, SFMono-Regular, Menlo, monospace';
    context.textAlign = "right";
    context.fillText(pattern.archive_number, 1010, 92);
    context.textAlign = "left";

    context.save();
    context.beginPath();
    context.rect(70, 135, 940, 690);
    context.clip();
    drawImageCover(context, detailImage.source, 70, 135, 940, 690);
    context.restore();

    context.fillStyle = paper;
    context.fillRect(744, 616, 242, 184);
    context.strokeStyle = purple;
    context.lineWidth = 3;
    context.strokeRect(744, 616, 242, 184);
    context.save();
    context.beginPath();
    context.rect(754, 626, 222, 164);
    context.clip();
    drawImageCover(context, contextImage.source, 754, 626, 222, 164);
    context.restore();

    context.fillStyle = orange;
    context.font = '700 18px "Noto Sans SC", sans-serif';
    context.fillText(museumLabel, 70, 872);

    context.fillStyle = purple;
    context.font = '700 20px "Noto Sans SC", sans-serif';
    context.fillText(`采集者 / COLLECTED BY · ${collectorName}`, 70, 910);
    if (capturedAt) {
      context.textAlign = "right";
      context.font = '600 17px "Noto Sans SC", sans-serif';
      context.fillText(`采集于 · ${capturedAt}`, 1010, 910);
      context.textAlign = "left";
    }

    context.fillStyle = purpleDeep;
    context.font = '700 42px "Noto Serif SC", serif';
    context.fillText(
      fitText(context, pattern.source_title || "未命名纹样采集", 940),
      70,
      967,
    );

    let tagX = 70;
    const tagY = 1000;
    context.font = '600 16px "Noto Sans SC", sans-serif';
    tags.forEach((tag) => {
      const width = context.measureText(tag).width + 26;
      if (tagX + width > 1010) {
        return;
      }
      context.strokeStyle = "#bfa8c6";
      context.lineWidth = 2;
      context.strokeRect(tagX, tagY, width, 32);
      context.fillStyle = purple;
      context.fillText(tag, tagX + 13, tagY + 22);
      tagX += width + 10;
    });

    context.fillStyle = muted;
    context.font = '400 21px "Noto Sans SC", sans-serif';
    wrapText(
      context,
      pattern.observation || "尚未填写现场观察",
      70,
      1080,
      940,
      36,
      4,
    );

    context.strokeStyle = "#cdbdd2";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(70, 1252);
    context.lineTo(1010, 1252);
    context.stroke();

    context.fillStyle = muted;
    context.font = '500 14px "Noto Sans SC", sans-serif';
    context.fillText("现场观察 · 来源信息 · 仍待了解 · 创意再表达", 70, 1292);
    context.textAlign = "right";
    context.fillText("WaytoAGI 发起 · CMI Community 清迈场", 1010, 1292);
    context.textAlign = "left";

    return canvasToPngBlob(canvas);
  } finally {
    detailImage.close();
    contextImage.close();
  }
}
