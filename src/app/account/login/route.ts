import { redirect } from "next/navigation";
import { buildAuthorizeUrl } from "@/lib/auth/oauth";

export async function GET() {
  const url = await buildAuthorizeUrl();
  redirect(url);
}
