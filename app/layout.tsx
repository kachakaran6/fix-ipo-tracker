import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPO Tracker",
  description: "Manage and track your Fixed IPO applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0A84FF" />
        <link
          rel="icon"
          type="image/png"
          href="https://img.icons8.com/?size=100&id=2BJx5ZZ27N9y&format=png&color=000000"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
