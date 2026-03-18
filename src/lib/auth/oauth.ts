import { cookies } from "next/headers";

const shopId = process.env.SHOPIFY_SHOP_ID!;
const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!;

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/account/authorize`;
}

function base64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return base64url(digest);
}

function generateCodeVerifier(): string {
  const buffer = crypto.getRandomValues(new Uint8Array(32));
  return base64url(buffer);
}

function generateState(): string {
  const buffer = crypto.getRandomValues(new Uint8Array(16));
  return base64url(buffer);
}

function generateNonce(): string {
  const buffer = crypto.getRandomValues(new Uint8Array(16));
  return base64url(buffer);
}

export async function buildAuthorizeUrl(): Promise<string> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();
  const nonce = generateNonce();

  const cookieStore = await cookies();
  cookieStore.set("oauth_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    scope: "openid email customer-account-api:full",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `https://shopify.com/authentication/${shopId}/oauth/authorize?${params}`;
}

export async function exchangeCodeForTokens(
  code: string,
  state: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
}> {
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const storedVerifier = cookieStore.get("oauth_verifier")?.value;

  if (!storedState || storedState !== state) {
    throw new Error("Invalid OAuth state");
  }

  if (!storedVerifier) {
    throw new Error("Missing code verifier");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: storedVerifier,
  });

  const response = await fetch(
    `https://shopify.com/authentication/${shopId}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${text}`);
  }

  // Clean up OAuth cookies
  cookieStore.delete("oauth_verifier");
  cookieStore.delete("oauth_state");

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(
    `https://shopify.com/authentication/${shopId}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  return response.json();
}

export function buildLogoutUrl(): string {
  const postLogoutRedirect = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams({
    id_token_hint: "",
    post_logout_redirect_uri: postLogoutRedirect,
  });
  return `https://shopify.com/authentication/${shopId}/logout?${params}`;
}
