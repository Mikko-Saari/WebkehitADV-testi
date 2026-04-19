import React from 'react';

function FormResponse({ response }) {
  if (!response) {
    return null;
  }

  return (
    <section className="response-panel" aria-live="polite">
      <h3>Lähetyksen tiedot</h3>
      <p className="helper-text">
        Pyyntö tallennettiin onnistuneesti. Tarvittaessa voit avata tekniset tiedot alta.
      </p>
      <details className="response-details">
        <summary>Näytä tekniset tiedot</summary>
        <div className="response-meta">
          <div className="response-card">
            <strong>Status</strong>
            <span>{response.status}</span>
          </div>
          <div className="response-card">
            <strong>URL</strong>
            <span>{response.url}</span>
          </div>
        </div>
        <pre className="response-pre">{JSON.stringify(response.body, null, 2)}</pre>
      </details>
    </section>
  );
}

export default FormResponse;
