function FrontPageContent() {
  return (
    <main className="frontpage-content">
      <section className="welcome-section" aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Tervetuloa!</h2>
        <p>
          Loyda sopivat varaosat autoihin, moottoripyoriin ja muihin ajoneuvoihin
          yhdesta paikasta. Selaa valikoimaa ja laheta varaosapyynto helposti
          lomakesivun kautta.
        </p>

        <img
          src="/images/etusivukuva.jpg"
          alt="Moottoripyoran kuva"
          className="hero-image"
        />
      </section>

      <section className="info-grid" aria-label="Varaosakaupan osiot">
        <article id="autot" className="info-card">
          <h3>Autot</h3>
          <p>
            Yleisimmat varaosat henkiloautoihin, kuten jarrut, suodattimet,
            valot ja alustanosat.
          </p>
        </article>

        <article id="moottoripyorat" className="info-card">
          <h3>Moottoripyorat</h3>
          <p>
            Ketjut, rattaat, katteet ja huolto-osat moottoripyoriin eri
            valmistajilta.
          </p>
        </article>

        <article id="renkaat" className="info-card">
          <h3>Renkaat</h3>
          <p>
            Kesa-, talvi- ja erikoisrenkaat seka apua oikean koon ja mallin
            valintaan.
          </p>
        </article>

        <article id="hintavertailu" className="info-card">
          <h3>Hintavertailu</h3>
          <p>
            Vertaile eri vaihtoehtoja nopeasti ja pyyda tarjous juuri niista
            osista, joita tarvitset.
          </p>
        </article>

        <article id="varaosahaku" className="info-card">
          <h3>Varaosahaku</h3>
          <p>
            Etsi sopivaa osaa rekisterinumeron, tuotteen nimen tai ajoneuvon
            mallin perusteella.
          </p>
        </article>

        <article id="info" className="info-card">
          <h3>Info</h3>
          <p>
            Toimitamme varaosia koko Suomeen ja vastaamme pyyntoihin
            mahdollisimman nopeasti arkipaivisin.
          </p>
        </article>
      </section>

      <section
        id="yhteystiedot"
        className="contact-section"
        aria-labelledby="contact-heading"
      >
        <h3 id="contact-heading">Yhteystiedot</h3>
        <p>Sahkoposti: varaosat@varaosakauppa.fi</p>
        <p>Puhelin: 040 123 4567</p>
        <p>Varaosapyynto onnistuu myos lomakesivulla.</p>
      </section>
    </main>
  );
}

export default FrontPageContent;
