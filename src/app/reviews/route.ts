import { standaloneDirectory } from "@/lib/standalone-directory";
export const runtime = "nodejs";
export const dynamic = "force-static";
export function GET() { return standaloneDirectory("reviews"); }
