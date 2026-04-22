import { NavLink } from "react-router-dom";

const primaryItems = [
  { label: "Etusivu", to: "/" },
  { label: "Autot", href: "/#autot" },
  { label: "Moottoripyorat", href: "/#moottoripyorat" },
  { label: "Renkaat", href: "/#renkaat" },
  { label: "Yhteystiedot", href: "/#yhteystiedot" },
  { label: "Info", href: "/#info" },
  { label: "Varaosapyynto", to: "/form" },
];

const secondaryItems = [
  { label: "Hintavertailu", href: "/#hintavertailu" },
  { label: "Varaosahaku", href: "/#varaosahaku" },
  { label: "Ota yhteytta", to: "/form" },
];

function NavBar() {
  return (
    <nav className="site-nav" aria-label="Paanavigaatio">
      <ul className="nav-list">
        {primaryItems.map((item) => (
          <li key={item.label} className="nav-item">
            {"to" in item ? (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link is-active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a className="nav-link" href={item.href}>
                {item.label}
              </a>
            )}
          </li>
        ))}

        <li className="nav-item dropdown">
          <span className="nav-link dropdown-trigger" tabIndex={0}>
            Muut
          </span>

          <ul className="dropdown-menu" aria-label="Lisaoptiot">
            {secondaryItems.map((item) => (
              <li key={item.label}>
                {"to" in item ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "dropdown-link is-active" : "dropdown-link"
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a className="dropdown-link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
