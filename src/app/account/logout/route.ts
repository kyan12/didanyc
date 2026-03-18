import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function GET() {
  await destroySession();
  return NextResponse.redirect(
    new URL("/account", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
}
