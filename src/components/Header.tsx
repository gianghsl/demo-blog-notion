import Link from "next/link";

export function Header() {
    return (
        <header className="header">
            <nav className="nav-container">
                <Link href="/" className="logo">
                    <span className="logo-icon">📝</span>
                    <span className="logo-text">Notion Blog</span>
                </Link>
                <div className="nav-links">
                    <Link href="/" className="nav-link">
                        Home
                    </Link>
                    <Link href="/#about" className="nav-link">
                        About
                    </Link>
                </div>
            </nav>
        </header>
    );
}
