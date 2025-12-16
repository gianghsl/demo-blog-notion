import { getAllPosts } from "@/lib/notion";
import { BlogCard } from "@/components";

// Revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <main className="main-container">
      <section className="hero">
        <h1 className="hero-title">
          Welcome to Notion Blog
        </h1>
        <p className="hero-description">
          Discover insightful articles and tutorials. Powered by Notion CMS and
          Next.js for blazing fast performance.
        </p>
      </section>

      {posts.length > 0 ? (
        <section className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h2 className="empty-state-title">No posts yet</h2>
          <p className="empty-state-description">
            Create your first post in Notion to get started!
          </p>
        </div>
      )}
    </main>
  );
}
