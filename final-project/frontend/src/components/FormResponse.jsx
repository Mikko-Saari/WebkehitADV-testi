function FormResponse({ response }) {
  if (!response) {
    return (
      <aside className="response-panel" aria-live="polite">
        <h3>Tallennuksen tila</h3>
        <p className="helper-text">
          Kun lähetät lomakkeen, tämän paneelin kautta näkyy palvelimen vastaus
          ja tallennetun rivin tiedot.
        </p>
      </aside>
    );
  }

  return (
    <aside className="response-panel" aria-live="polite">
      <h3>Tallennus onnistui</h3>
      <p className="helper-text">
        Pyyntö tallennettiin tietokantaan ja palvelin palautti luodun rivin.
      </p>

      <div className="response-meta">
        <div className="response-card">
          <strong>Status</strong>
          <span>{response.status}</span>
        </div>
        <div className="response-card">
          <strong>Tallennettu ID</strong>
          <span>{response.savedRequest.id}</span>
        </div>
      </div>

      <details className="response-details">
        <summary>Näytä palvelimen vastaus</summary>
        <pre className="response-pre">{JSON.stringify(response, null, 2)}</pre>
      </details>
    </aside>
  );
}

export default FormResponse;
