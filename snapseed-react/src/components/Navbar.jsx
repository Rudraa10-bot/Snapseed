function Navbar() {
  return (
    <header className="navbar" id="home">
      <nav className="container">
        <a href="#home" className="navbar-brand">SnapSeed</a>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#expenses">Expenses</a></li>
          <li><a href="#budget">Budget</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#add-expense" className="btn btn-primary">Add Expense</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
