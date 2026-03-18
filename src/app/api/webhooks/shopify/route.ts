import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

const HANDLED_TOPICS = new Set([
  "products/update",
  "products/create",
  "products/delete",
  "inventory_levels/update",
]);

function verifyHmac(body: string, hmacHeader: string): boolean {
  const digest = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(hmacHeader)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");

  if (!hmacHeader || !verifyHmac(rawBody, hmacHeader)) {
    console.warn("[shopify-webhook] Invalid HMAC signature", { topic });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[shopify-webhook] Received", { topic });

  if (!topic || !HANDLED_TOPICS.has(topic)) {
    console.log("[shopify-webhook] Unhandled topic, skipping", { topic });
    return NextResponse.json({ received: true });
  }

  const payload = JSON.parse(rawBody);

  // Revalidate product page if we have a handle
  if (topic.startsWith("products/") && payload.handle) {
    console.log("[shopify-webhook] Revalidating product", {
      handle: payload.handle,
    });
    revalidatePath(`/products/${payload.handle}`);
  }

  // Always revalidate listing pages — product/inventory changes
  // can affect any listing page
  revalidatePath("/collections", "layout");
  revalidatePath("/products", "layout");
  revalidatePath("/", "layout");

  console.log("[shopify-webhook] Revalidation triggered", { topic });

  return NextResponse.json({ revalidated: true });
}
