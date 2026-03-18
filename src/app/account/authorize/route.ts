import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/auth/oauth";
import { createSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    const url = new URL("/account", request.url);
    url.searchParams.set("error", error);
    return NextResponse.redirect(url);
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, state);

    // Decode the ID token to get customer ID
    const payload = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64").toString()
    );

    await createSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      customerId: payload.sub,
    });

    return NextResponse.redirect(new URL("/account/orders", request.url));
  } catch (err) {
    console.error("OAuth callback error:", err);
    const url = new URL("/account", request.url);
    url.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(url);
  }
}
