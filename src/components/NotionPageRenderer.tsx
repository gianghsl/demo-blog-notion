"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { ExtendedRecordMap } from "notion-types";

// Dynamically import NotionRenderer to avoid SSR issues
const NotionRenderer = dynamic(
    () => import("react-notion-x").then((mod) => mod.NotionRenderer),
    { ssr: false }
);

// Code block component with syntax highlighting
const Code = dynamic(
    () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
    { ssr: false }
);

// Equation support
const Equation = dynamic(
    () =>
        import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
    { ssr: false }
);

// Collection (database) support
const Collection = dynamic(
    () =>
        import("react-notion-x/build/third-party/collection").then(
            (m) => m.Collection
        ),
    { ssr: false }
);

interface NotionPageRendererProps {
    recordMap: ExtendedRecordMap;
    rootPageId?: string;
}

export function NotionPageRenderer({
    recordMap,
    rootPageId,
}: NotionPageRendererProps) {
    return (
        <div className="notion-page-wrapper">
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={true}
                rootPageId={rootPageId}
                disableHeader={true}
                components={{
                    Code,
                    Equation,
                    Collection,
                    nextImage: Image,
                    nextLink: Link,
                }}
                mapPageUrl={(pageId) => `/blog/${pageId}`}
            />
        </div>
    );
}

// Fallback component when no recordMap is available (mock data)
export function MockContentRenderer() {
    return (
        <div className="mock-content">
            <div className="mock-notice">
                <h3>📝 Demo Content</h3>
                <p>
                    This is mock content displayed because Notion credentials are not
                    configured or there was an error fetching the page.
                </p>
                <p>
                    To see real Notion content, configure your <code>.env.local</code>{" "}
                    file with valid <code>NOTION_TOKEN</code> and{" "}
                    <code>NOTION_DATABASE_ID</code>.
                </p>
            </div>
            <div className="mock-article">
                <h2>Welcome to Notion Blog</h2>
                <p>
                    This blog is powered by Notion as a CMS and Next.js for static site
                    generation. Once you connect your Notion database, your blog posts
                    will appear here with full Notion styling including:
                </p>
                <ul>
                    <li>✅ Toggle blocks</li>
                    <li>✅ Callout blocks</li>
                    <li>✅ Code blocks with syntax highlighting</li>
                    <li>✅ Database views</li>
                    <li>✅ Equations</li>
                    <li>✅ And much more!</li>
                </ul>
            </div>
        </div>
    );
}
