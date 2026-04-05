import React from 'react';

function FrontPageContent() {
  return (
    <main className="frontpage-content">
      <section className="welcome-section" aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Tervetuloa!</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
        <img
          src="/images/etusivukuva.jpg"
          alt="Moottoripyörä"
          className="hero-image"
        />
      </section>
    </main>
  );
}

export default FrontPageContent;
