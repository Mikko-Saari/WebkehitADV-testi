import { useEffect, useState } from "react";
import { z } from "zod";
import FormResponse from "../components/FormResponse";

const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nimen täytyy sisältää vähintään 2 merkkiä."),
  email: z.string().trim().email("Anna toimiva sähköpostiosoite."),
  quantity: z.coerce
    .number({
      invalid_type_error: "Anna kappalemäärä numerona.",
    })
    .int("Kappalemäärän pitää olla kokonaisluku.")
    .min(1, "Tilaa vähintään 1 kappale.")
    .max(500, "Suurin sallittu määrä on 500."),
});

const initialValues = {
  fullName: "",
  email: "",
  quantity: "",
  subscribe: false,
};

function FormPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [response, setResponse] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      const result = await fetch("/api/requests");

      if (!result.ok) {
        throw new Error("Tallennettujen pyyntöjen haku epäonnistui.");
      }

      const data = await result.json();
      setRequests(data);
    } catch (error) {
      setStatus((current) =>
        current.type === "error"
          ? current
          : {
              type: "error",
              message: error.message,
            }
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedValues = formSchema.safeParse({
      fullName: values.fullName,
      email: values.email,
      quantity: values.quantity,
    });

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setErrors({
        fullName: fieldErrors.fullName?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        quantity: fieldErrors.quantity?.[0] ?? "",
      });
      setStatus({
        type: "error",
        message: "Korjaa lomakkeen virheet ennen lähettämistä.",
      });
      return;
    }

    setErrors({});
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const payload = {
        ...parsedValues.data,
        subscribe: values.subscribe,
      };

      const result = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await result.json();

      if (!result.ok) {
        throw new Error(body.error || `Palvelin vastasi virhekoodilla ${result.status}.`);
      }

      setResponse(body);
      setStatus({
        type: "success",
        message: "Lomake lähetettiin ja tiedot tallennettiin tietokantaan.",
      });
      setValues(initialValues);
      await loadRequests();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Lomakkeen lähettäminen epäonnistui.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="frontpage-content">
      <section className="form-page-section">
        <div className="form-page-copy">
          <h2>Varaosapyyntö</h2>
          <p>
            Täytä yhteystietosi ja arvioitu kappalemäärä. Tallennamme pyynnön
            järjestelmään ja palaamme asiaan mahdollisimman pian.
          </p>
        </div>

        <div className="form-page-grid">
          <div>
            <form className="request-form" onSubmit={handleSubmit} noValidate>
              <h3>Lomake</h3>

              {status.message ? (
                <div className={`status-banner ${status.type}`}>{status.message}</div>
              ) : null}

              <div className="field-group">
                <label htmlFor="fullName">Nimi</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Esim. Mikko Mallikas"
                  value={values.fullName}
                  onChange={handleChange}
                  required
                  minLength={2}
                />
                <p className="helper-text">Kirjoita vähintään kaksi merkkiä.</p>
                {errors.fullName ? (
                  <p className="error-message">{errors.fullName}</p>
                ) : null}
              </div>

              <div className="field-group">
                <label htmlFor="email">Sähköposti</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nimi@example.com"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
                <p className="helper-text">Käytämme osoitetta vastaamiseen.</p>
                {errors.email ? <p className="error-message">{errors.email}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="quantity">Kappalemäärä</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="10"
                  value={values.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  max="500"
                />
                <p className="helper-text">Anna arvioitu määrä väliltä 1-500.</p>
                {errors.quantity ? (
                  <p className="error-message">{errors.quantity}</p>
                ) : null}
              </div>

              <fieldset className="checkbox-group">
                <legend>Lisävalinta</legend>
                <label className="checkbox-row" htmlFor="subscribe">
                  <input
                    id="subscribe"
                    name="subscribe"
                    type="checkbox"
                    checked={values.subscribe}
                    onChange={handleChange}
                  />
                  Haluan saada tarjouksia sähköpostilla
                </label>
              </fieldset>

              <button className="submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Lähetetään..." : "Lähetä pyyntö"}
              </button>
            </form>

            <section className="request-list" aria-live="polite">
              <h3>Viimeisimmät tietokantaan tallennetut pyynnöt</h3>
              <p className="helper-text">
                Tästä näet viimeisimmät tallennetut pyynnöt.
              </p>

              {isLoadingRequests ? (
                <p className="empty-state">Haetaan tallennettuja pyyntöjä...</p>
              ) : requests.length === 0 ? (
                <p className="empty-state">Tallennettuja pyyntöjä ei löytynyt vielä.</p>
              ) : (
                <ul>
                  {requests.map((request) => (
                    <li key={request.id}>
                      <strong>{request.full_name}</strong>
                      <span>{request.email}</span>
                      <span>Määrä: {request.quantity}</span>
                      <span>
                        Tarjousviestit: {request.subscribe ? "Kyllä" : "Ei"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <FormResponse response={response} />
        </div>
      </section>
    </main>
  );
}

export default FormPage;
