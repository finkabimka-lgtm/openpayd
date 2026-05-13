import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPayd Portal",
  description: "A simple full-stack banking portal base project",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
