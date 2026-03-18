import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIDA NYC",
  description: "Premium haircare and beauty — DIDA NYC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
