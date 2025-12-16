import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header, Footer } from "@/components";
import "./globals.css";
// react-notion-x styles
import "react-notion-x/src/styles.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Notion Blog - Powered by Next.js",
    template: "%s | Notion Blog",
  },
  description:
    "A beautiful blog powered by Notion as CMS and Next.js for static site generation. Fast, SEO-friendly, and easy to manage.",
  keywords: ["blog", "notion", "nextjs", "static site", "cms"],
  authors: [{ name: "Notion Blog" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Notion Blog",
    title: "Notion Blog - Powered by Next.js",
    description:
      "A beautiful blog powered by Notion as CMS and Next.js for static site generation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion Blog - Powered by Next.js",
    description:
      "A beautiful blog powered by Notion as CMS and Next.js for static site generation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
