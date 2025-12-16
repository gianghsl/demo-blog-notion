import Link from "next/link";

export default function NotFound() {
    return (
        <main className="main-container">
            <div className="not-found">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-message">
                    Oops! The post you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link href="/" className="not-found-link">
                    ← Back to Home
                </Link>
            </div>
        </main>
    );
}
