import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    const formattedDate = format(new Date(post.date), "MMM dd, yyyy");

    return (
        <Link href={`/blog/${post.slug}`} className="blog-card">
            <div className="blog-card-image-wrapper">
                {post.cover ? (
                    <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="blog-card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="blog-card-placeholder">
                        <span>📄</span>
                    </div>
                )}
                <div className="blog-card-overlay" />
            </div>
            <div className="blog-card-content">
                <div className="blog-card-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="blog-card-tag">
                            {tag}
                        </span>
                    ))}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-description">{post.description}</p>
                <div className="blog-card-meta">
                    <time className="blog-card-date">{formattedDate}</time>
                    <span className="blog-card-read-more">Read more →</span>
                </div>
            </div>
        </Link>
    );
}
