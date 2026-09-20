function scrollToSection(e, id) {
  e.preventDefault();

  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-brand">SnapSeed</p>
        <p className="footer-tagline">Track your expenses. Manage your budget.</p>
        <nav className="footer-links">
          <a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a>
          <a href="#about" onClick={(e) => scrollToSection(e, "about")}>About</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
