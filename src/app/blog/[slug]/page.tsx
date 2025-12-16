import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import { NotionPageRenderer, MockContentRenderer } from "@/components";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static paths for all posts at build time
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata for each post
export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            images: post.cover ? [post.cover] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: post.cover ? [post.cover] : undefined,
        },
    };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    const formattedDate = format(new Date(post.date), "MMMM dd, yyyy");

    return (
        <main className="post-container">
            <Link href="/" className="back-link">
                ← Back to Home
            </Link>

            <article>
                <header className="post-header">
                    <div className="post-tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="post-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <time dateTime={post.date}>📅 {formattedDate}</time>
                    </div>
                </header>

                {post.cover && (
                    <div className="post-cover">
                        <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="post-cover-image"
                            priority
                            sizes="(max-width: 900px) 100vw, 900px"
                        />
                    </div>
                )}

                {/* Render Notion content or mock content */}
                {post.recordMap ? (
                    <NotionPageRenderer recordMap={post.recordMap} rootPageId={post.id} />
                ) : (
                    <MockContentRenderer />
                )}
            </article>
        </main>
    );
}
