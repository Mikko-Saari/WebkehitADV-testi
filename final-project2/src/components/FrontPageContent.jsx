import React from 'react';

function FrontPageContent() {
  return (
    <main className="frontpage-content">
      <section className="welcome-section" aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Tervetuloa!</h2>
        <p>
          Löydä sopivat varaosat autoihin, moottoripyöriin ja muihin ajoneuvoihin yhdestä
          paikasta. Uusi lomakesivu auttaa lähettämään tarjouspyynnön nopeasti ja näyttää
          samalla palvelimen palauttaman vastauksen selkeästi.
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
