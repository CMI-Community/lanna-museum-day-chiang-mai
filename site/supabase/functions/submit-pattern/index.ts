import { createClient } from "npm:@supabase/supabase-js@2.110.8";

const BUCKET = "pattern-submissions";
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_MUSEUMS = new Set(["lanna_folklife", "fam", "other"]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") ?? "";
  const configuredOrigins = (Deno.env.get("ALLOWED_ORIGIN") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const allowOrigin =
    configuredOrigins.length === 0
      ? "*"
      : configuredOrigins.includes(origin)
        ? origin
        : configuredOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function response(
  request: Request,
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function originIsAllowed(request: Request) {
  const origin = request.headers.get("Origin");
  const configuredOrigins = (Deno.env.get("ALLOWED_ORIGIN") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    configuredOrigins.length === 0 ||
    !origin ||
    configuredOrigins.includes(origin)
  );
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let difference = a.length ^ b.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }

  return difference === 0;
}

function text(value: unknown, maximum: number, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().slice(0, maximum) || fallback;
}

function normalizeAccessCode(value: unknown) {
  return text(value, 100).replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

function defaultKeyFromJson(environmentName: string) {
  const value = Deno.env.get(environmentName);
  if (!value) {
    return "";
  }

  try {
    const keys = JSON.parse(value);
    return typeof keys?.default === "string" ? keys.default : "";
  } catch {
    return "";
  }
}

function tags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, 30))
    .filter(Boolean)
    .slice(0, 6);
}

function files(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File);
}

function validateFiles(
  entries: File[],
  name: string,
  minimum: number,
  maximum: number,
) {
  if (entries.length < minimum || entries.length > maximum) {
    throw new Error(`${name}需上传 ${minimum}–${maximum} 张`);
  }

  for (const file of entries) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error(`${name}仅支持 JPG、PNG 或 WebP`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${name}单张图片不能超过 1.5MB`);
    }
  }
}

function extension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return originIsAllowed(request)
      ? new Response("ok", { headers: corsHeaders(request) })
      : response(request, { error: "不允许的来源" }, 403);
  }

  if (request.method !== "POST") {
    return response(request, { error: "仅支持 POST 请求" }, 405);
  }

  if (!originIsAllowed(request)) {
    return response(request, { error: "不允许的来源" }, 403);
  }

  const expectedCode = normalizeAccessCode(
    Deno.env.get("PATTERN_SUBMISSION_CODE") ?? "",
  );
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey =
    defaultKeyFromJson("SUPABASE_SECRET_KEYS") ||
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    "";

  if (!expectedCode || !supabaseUrl || !serviceKey) {
    return response(request, { error: "采集服务尚未完成配置" }, 503);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return response(request, { error: "提交格式无效" }, 400);
  }

  let metadata: Record<string, unknown>;
  try {
    const parsed = JSON.parse(String(formData.get("metadata") ?? "{}"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("metadata must be an object");
    }
    metadata = parsed;
  } catch {
    return response(request, { error: "采集信息格式无效" }, 400);
  }

  if (!constantTimeEqual(normalizeAccessCode(metadata.accessCode), expectedCode)) {
    return response(request, { error: "活动采集口令不正确" }, 401);
  }

  const detailImages = files(formData, "detailImages");
  const contextImages = files(formData, "contextImages");
  const labelImages = files(formData, "labelImages");

  try {
    validateFiles(detailImages, "纹样局部图", 1, 6);
    validateFiles(contextImages, "完整载体图", 1, 6);
    validateFiles(labelImages, "展签或来源图", 0, 3);
  } catch (error) {
    return response(
      request,
      { error: error instanceof Error ? error.message : "图片不符合要求" },
      400,
    );
  }

  const museum = text(metadata.museum, 40, "other");
  const observation = text(metadata.observation, 1200);
  if (!ALLOWED_MUSEUMS.has(museum) || !observation) {
    return response(request, { error: "请补全博物馆与现场观察" }, 400);
  }

  const submissionId = crypto.randomUUID();
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const uploadedPaths: string[] = [];

  async function uploadGroup(group: string, entries: File[]) {
    const urls: string[] = [];

    for (const file of entries) {
      const path = `${submissionId}/${group}/${crypto.randomUUID()}.${extension(file)}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

      if (error) {
        throw error;
      }

      uploadedPaths.push(path);
      urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    }

    return urls;
  }

  try {
    const detailImageUrls = await uploadGroup("detail", detailImages);
    const contextImageUrls = await uploadGroup("context", contextImages);
    const labelImageUrls = await uploadGroup("label", labelImages);

    const { data, error } = await supabase
      .from("pattern_submissions")
      .insert({
        id: submissionId,
        museum,
        source_title: text(metadata.sourceTitle, 160, "未命名纹样采集"),
        source_location: text(metadata.sourceLocation, 160, "来源待补充"),
        observation,
        verified_information: text(metadata.verifiedInformation, 1200),
        open_question: text(metadata.openQuestion, 1200),
        carrier_tags: tags(metadata.carrierTags),
        position_tags: tags(metadata.positionTags),
        structure_tags: tags(metadata.structureTags),
        material_tags: tags(metadata.materialTags),
        detail_image_urls: detailImageUrls,
        context_image_urls: contextImageUrls,
        label_image_urls: labelImageUrls,
        collector_name: text(metadata.collectorName, 80, "匿名采集者"),
        status: "published",
      })
      .select(
        "id, archive_number, museum, source_title, source_location, observation, verified_information, open_question, carrier_tags, position_tags, structure_tags, material_tags, detail_image_urls, context_image_urls, label_image_urls, collector_name, created_at, published_at",
      )
      .single();

    if (error) {
      throw error;
    }

    return response(request, data);
  } catch {
    if (uploadedPaths.length) {
      await supabase.storage.from(BUCKET).remove(uploadedPaths);
    }
    return response(request, { error: "上传未完成，请稍后重试" }, 500);
  }
});
