import React, { useState } from 'react';
import { z } from 'zod';
import FormResponse from '../components/FormResponse';

const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Nimen täytyy sisältää vähintään 2 merkkiä.'),
  email: z
    .string()
    .trim()
    .email('Anna toimiva sähköpostiosoite.'),
  quantity: z.coerce
    .number({
      invalid_type_error: 'Anna kappalemäärä numerona.',
    })
    .int('Kappalemäärän pitää olla kokonaisluku.')
    .min(1, 'Tilaa vähintään 1 kappale.')
    .max(500, 'Suurin sallittu määrä on 500.'),
});

const initialValues = {
  fullName: '',
  email: '',
  quantity: '',
  subscribe: false,
};

function FormPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
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
        fullName: fieldErrors.fullName?.[0] ?? '',
        email: fieldErrors.email?.[0] ?? '',
        quantity: fieldErrors.quantity?.[0] ?? '',
      });
      setStatus({
        type: 'error',
        message: 'Korjaa lomakkeen virheet ennen lähettämistä.',
      });
      return;
    }

    setErrors({});
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const payload = {
        ...parsedValues.data,
        subscribe: values.subscribe,
      };

      const result = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error(`Palvelin vastasi virhekoodilla ${result.status}.`);
      }

      const body = await result.json();

      setResponse({
        status: result.status,
        url: body.url,
        body,
      });
      setStatus({
        type: 'success',
        message: 'Lomake lähetettiin onnistuneesti.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Lomakkeen lähettäminen epäonnistui.',
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
            Täytä yhteystietosi ja arvioitu kappalemäärä. Lomake tarkistetaan ennen
            lähetystä, jotta pyynnön lähettäminen onnistuu sujuvasti.
          </p>
        </div>

        <div className="form-page-grid">
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
              {errors.fullName ? <p className="error-message">{errors.fullName}</p> : null}
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
              <p className="helper-text">Käytämme osoitetta tilausvahvistukseen.</p>
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
              <p className="helper-text">Anna arvioitu varaosien määrä välillä 1-500.</p>
              {errors.quantity ? <p className="error-message">{errors.quantity}</p> : null}
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
              {isSubmitting ? 'Lähetetään...' : 'Lähetä pyyntö'}
            </button>
          </form>

          <FormResponse response={response} />
        </div>
      </section>
    </main>
  );
}

export default FormPage;
