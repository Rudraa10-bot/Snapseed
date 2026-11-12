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

function Navbar({ onLogout }) {
  return (
    <header className="navbar" id="home">
      <nav className="container">
        <a href="#home" className="navbar-brand" onClick={(e) => scrollToSection(e, "home")}>
          SnapSeed
        </a>
        <ul className="navbar-links">
          <li><a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a></li>
          <li><a href="#expenses" onClick={(e) => scrollToSection(e, "expenses")}>Expenses</a></li>
          <li><a href="#budget" onClick={(e) => scrollToSection(e, "budget")}>Budget</a></li>
          <li><a href="#about" onClick={(e) => scrollToSection(e, "about")}>About</a></li>
          <li>
            <a
              href="#add-expense"
              className="btn btn-primary"
              onClick={(e) => scrollToSection(e, "add-expense")}
            >
              Add Expense
            </a>
          </li>
          {onLogout && (
            <li>
              <button className="btn btn-outline" onClick={onLogout} type="button">
                Sign out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;