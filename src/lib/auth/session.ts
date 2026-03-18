import { cookies } from "next/headers";

const SESSION_COOKIE = "dida_session";
const SESSION_SECRET = process.env.SESSION_SECRET!;

interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  customerId: string;
}

async function getKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: encoder.encode("dida-session"), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function createSession(data: Session): Promise<void> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const payload = Buffer.from(
    JSON.stringify({
      iv: Buffer.from(iv).toString("base64"),
      data: Buffer.from(encrypted).toString("base64"),
    })
  ).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;

  try {
    const key = await getKey();
    const { iv, data } = JSON.parse(
      Buffer.from(cookie.value, "base64").toString()
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Buffer.from(iv, "base64") },
      key,
      Buffer.from(data, "base64")
    );

    const session: Session = JSON.parse(new TextDecoder().decode(decrypted));

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
