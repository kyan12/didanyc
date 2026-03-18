import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account — DIDA NYC",
  description: "Manage your DIDA NYC account",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
