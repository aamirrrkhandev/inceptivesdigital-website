import { evaluateIOSAssessment } from "@/lib/ios-assessment-rules";
import { stagingFormsEnabled, verifyStagingTurnstile } from "@/lib/staging-turnstile";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const fail = (message: string, status: number) =>
  Response.json(
    { success: false, data: { message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host)
    return fail("Request not permitted.", 403);
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return fail("Submission is too large.", 413);
  let input: FormData;
  try {
    input = await request.formData();
  } catch {
    return fail("Invalid submission.", 400);
  }
  const fields = new URLSearchParams();
  for (const name of [
    "platform",
    "hardware",
    "performance",
    "timeline",
    "full_name",
    "email",
    "company",
  ]) {
    const value = input.get(name);
    if (
      typeof value !== "string" ||
      value.length > 500 ||
      (name !== "company" && !value.trim())
    )
      return fail("Please complete all required fields.", 400);
    fields.set(name, value.trim());
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.get("email")!))
    return fail("Please enter a valid email address.", 400);
  try {
    if (!stagingFormsEnabled()) return fail("Form delivery is not configured for this environment.", 503);
    if (!(await verifyStagingTurnstile(request, String(input.get("cf-turnstile-response") || ""))))
      return fail("Security verification failed. Please retry.", 400);
    const result = evaluateIOSAssessment(fields);
    if (typeof result?.success !== "boolean")
      throw new Error("Invalid response");
    return Response.json(result, {
      status: result.success ? 200 : 422,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return fail(
      "Your assessment could not be submitted. Please retry or call (469) 788-8527.",
      502,
    );
  }
}
