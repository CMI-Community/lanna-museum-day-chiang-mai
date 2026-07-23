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

  const { data, error } = await supabase
    .from("pattern_submissions")
    .select(
      "id, archive_number, museum, source_title, source_location, observation, verified_information, open_question, carrier_tags, position_tags, structure_tags, material_tags, detail_image_urls, context_image_urls, label_image_urls, collector_name, created_at, published_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("archive_number", { ascending: false })
    .limit(120);

  if (error) {
    throw error;
  }

  return data ?? [];
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
    created_at: now.toISOString(),
    preview: true,
    localPreview: true,
  };
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
