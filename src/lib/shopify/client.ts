const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const clientId = process.env.SHOPIFY_API_KEY!;
const clientSecret = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!; // This is actually the client secret (shpss_)
const apiVersion = "2024-10";

// ── Token cache ──────────────────────────────────────────────────────────────
// Client credentials tokens expire in 24h. Cache in memory and refresh
// when expired or within 5 min of expiry.

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // unix ms

async function getStorefrontToken(): Promise<string> {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // refresh 5 min early

  if (cachedToken && tokenExpiresAt > now + bufferMs) {
    return cachedToken;
  }

  const res = await fetch(
    `https://${domain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Shopify token exchange failed: ${res.status} ${text.slice(0, 200)}`
    );
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // expires_in is in seconds (86399 = ~24h)
  tokenExpiresAt = now + (data.expires_in ?? 86399) * 1000;

  return cachedToken!;
}

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const url = `https://${domain}/api/${apiVersion}/graphql.json`;
  const token = await getStorefrontToken();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e: { message: string }) => e.message).join(", ")}`
    );
  }

  return json.data as T;
}
