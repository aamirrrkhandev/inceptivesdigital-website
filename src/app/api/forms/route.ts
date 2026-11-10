import routes from "../../../../content/routes.json";
import { loadFormContract, sendElementorForm } from "@/lib/wordpress-forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const paths = new Set(routes.map((route) => route.path));
const reply = (message: string, status: number) =>
  Response.json(
    { success: false, data: { message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host)
    return reply("Request not permitted.", 403);
  if (Number(request.headers.get("content-length") || 0) > 100_000)
    return reply("Message is too large.", 413);
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply("Invalid form submission.", 400);
  }
  if (
    [...data.values()].some(
      (value) => typeof value !== "string" || value.length > 10000,
    )
  )
    return reply("Invalid form submission.", 400);
  const path = String(data.get("source_path") || "");
  const formId = String(data.get("form_id") || "");
  const token = String(data.get("cf-turnstile-response") || "");
  if (!paths.has(path) || !/^[a-zA-Z0-9_-]{1,64}$/.test(formId))
    return reply("Unknown form.", 400);
  if (!token || token.length > 2048)
    return reply("Please complete the security verification.", 400);
  try {
    const contract = await loadFormContract(path, formId);
    if (!contract)
      return reply(
        "This form is unavailable. Please refresh and try again.",
        400,
      );
    const payload = new URLSearchParams();
    for (const field of contract.fields) {
      // IDs and other hidden settings always come from the current source, never the caller.
      const values =
        field.type === "hidden"
          ? [field.value]
          : data.getAll(field.name).map(String);
      if (field.required && !values.some((value) => value.trim()))
        return reply("Please complete all required fields.", 400);
      if (
        field.type === "email" &&
        values.some(
          (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        )
      )
        return reply("Please enter a valid email address.", 400);
      for (const value of values) payload.append(field.name, value);
    }
    payload.set("cf-turnstile-response", token);
    payload.set("action", "elementor_pro_forms_send_form");
    payload.set("referrer", "https://inceptivesdigital.com" + path);
    const result = await sendElementorForm(payload);
    if (typeof result?.success !== "boolean")
      throw new Error("Invalid form response");
    return Response.json(result, {
      status: result.success ? 200 : 422,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return reply(
      "Your message could not be sent. Please retry or call (469) 788-8527.",
      502,
    );
  }
}
