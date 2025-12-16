export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo">📝 Notion Blog</span>
                        <p className="footer-description">
                            A beautiful blog powered by Notion and Next.js
                        </p>
                    </div>
                    <div className="footer-links">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-social"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-social"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {currentYear} Notion Blog. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
