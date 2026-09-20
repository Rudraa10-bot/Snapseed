function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Welcome to SnapSeed</h1>
        <p>Track your expenses and manage your monthly budget easily.</p>
        <div className="hero-buttons">
          <a href="#add-expense" className="btn btn-primary">Add New Expense</a>
          <a href="#upload" className="btn btn-outline">Upload Receipt</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
