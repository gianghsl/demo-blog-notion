import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import type { BlogPost, BlogPostWithContent } from "./types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ExtendedRecordMap } from "notion-types";

// Official Notion client for database queries
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

// Unofficial notion-client for fetching page content (used by react-notion-x)
const notionAPI = new NotionAPI();

const databaseId = process.env.NOTION_DATABASE_ID!;

// Check if we have valid Notion credentials
const hasNotionCredentials = () => {
    return (
        process.env.NOTION_TOKEN &&
        process.env.NOTION_TOKEN !== "your_notion_integration_token_here" &&
        process.env.NOTION_DATABASE_ID &&
        process.env.NOTION_DATABASE_ID !== "your_notion_database_id_here"
    );
};

// Mock data for development when Notion is not configured
const mockPosts: BlogPost[] = [
    {
        id: "1",
        title: "Getting Started with Next.js and Notion",
        slug: "getting-started-nextjs-notion",
        description:
            "Learn how to build a beautiful blog using Next.js and Notion as your CMS.",
        date: "2024-12-15",
        tags: ["Next.js", "Notion", "Tutorial"],
        cover:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
        published: true,
    },
    {
        id: "2",
        title: "Best Practices for Static Site Generation",
        slug: "best-practices-ssg",
        description:
            "Discover the best practices for building fast, SEO-friendly static websites.",
        date: "2024-12-10",
        tags: ["SSG", "Performance", "SEO"],
        cover:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        published: true,
    },
    {
        id: "3",
        title: "Modern CSS Techniques for Beautiful UIs",
        slug: "modern-css-techniques",
        description:
            "Explore modern CSS techniques including CSS Grid, Flexbox, and CSS Variables.",
        date: "2024-12-05",
        tags: ["CSS", "Design", "Frontend"],
        cover:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        published: true,
    },
];

// Helper function to extract page properties safely
function extractPageProperties(page: PageObjectResponse): BlogPost | null {
    try {
        const properties = page.properties;

        // Extract title
        const titleProp = properties.Title || properties.title || properties.Name;
        const title =
            titleProp?.type === "title" && titleProp.title[0]?.plain_text
                ? titleProp.title[0].plain_text
                : "";

        // Extract slug
        const slugProp = properties.Slug || properties.slug;
        const slug =
            slugProp?.type === "rich_text" && slugProp.rich_text[0]?.plain_text
                ? slugProp.rich_text[0].plain_text
                : "";

        // Extract description
        const descProp = properties.Description || properties.description;
        const description =
            descProp?.type === "rich_text" && descProp.rich_text[0]?.plain_text
                ? descProp.rich_text[0].plain_text
                : "";

        // Extract date
        const dateProp = properties.Date || properties.date;
        const date =
            dateProp?.type === "date" && dateProp.date?.start
                ? dateProp.date.start
                : new Date().toISOString().split("T")[0];

        // Extract tags
        const tagsProp = properties.Tags || properties.tags;
        const tags =
            tagsProp?.type === "multi_select"
                ? tagsProp.multi_select.map((tag) => tag.name)
                : [];

        // Extract published status
        const publishedProp = properties.Published || properties.published;
        const published =
            publishedProp?.type === "checkbox" ? publishedProp.checkbox : true;

        // Extract cover image
        let cover: string | null = null;
        if (page.cover) {
            if (page.cover.type === "external") {
                cover = page.cover.external.url;
            } else if (page.cover.type === "file") {
                cover = page.cover.file.url;
            }
        }

        return {
            id: page.id,
            title,
            slug,
            description,
            date,
            tags,
            cover,
            published,
        };
    } catch {
        return null;
    }
}

// Get all published posts
export async function getAllPosts(): Promise<BlogPost[]> {
    if (!hasNotionCredentials()) {
        console.log("Using mock data - Notion credentials not configured");
        return mockPosts;
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "Published",
                checkbox: {
                    equals: true,
                },
            },
            sorts: [
                {
                    property: "Date",
                    direction: "descending",
                },
            ],
        });

        const posts = response.results
            .filter(
                (page): page is PageObjectResponse =>
                    "properties" in page && page.object === "page"
            )
            .map((page: PageObjectResponse) => extractPageProperties(page))
            .filter((post): post is BlogPost => post !== null && post.slug !== "");

        return posts;
    } catch (error) {
        console.error("Error fetching posts from Notion:", error);
        return mockPosts;
    }
}

// Get a single post by slug (returns metadata only)
export async function getPostBySlug(
    slug: string
): Promise<BlogPostWithContent | null> {
    if (!hasNotionCredentials()) {
        console.log("Using mock data - Notion credentials not configured");
        const post = mockPosts.find((p) => p.slug === slug);
        if (!post) return null;
        return {
            ...post,
            recordMap: null,
        };
    }

    try {
        // First, query the database to get post metadata
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: "Slug",
                        rich_text: {
                            equals: slug,
                        },
                    },
                    {
                        property: "Published",
                        checkbox: {
                            equals: true,
                        },
                    },
                ],
            },
        });

        if (response.results.length === 0) {
            // No post found with this slug
            return null;
        }

        const page = response.results[0];
        if (!("properties" in page)) {
            return null;
        }

        const post = extractPageProperties(page as PageObjectResponse);
        if (!post) {
            return null;
        }

        // Try to fetch page content using notion-client (for react-notion-x)
        // If this fails (e.g., page not public), we still return the post with null recordMap
        let recordMap: ExtendedRecordMap | null = null;
        try {
            recordMap = await notionAPI.getPage(page.id);
        } catch (contentError) {
            console.error("Error fetching page content (page may not be public):", contentError);
            // Continue with null recordMap - we'll show mock content
        }

        return {
            ...post,
            recordMap,
        };
    } catch (error) {
        console.error("Error fetching post from Notion:", error);
        // Fallback to mock data if database query fails
        const post = mockPosts.find((p) => p.slug === slug);
        if (!post) return null;
        return {
            ...post,
            recordMap: null,
        };
    }
}

// Export types for use in components
export type { ExtendedRecordMap };
