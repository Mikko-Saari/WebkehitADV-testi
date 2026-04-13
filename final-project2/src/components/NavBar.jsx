import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Etusivu', to: '/' },
  { label: 'Autot', href: '#' },
  { label: 'Moottoripyörät', href: '#' },
  { label: 'Renkaat', href: '#' },
  { label: 'Yhteystiedot', href: '#' },
  { label: 'Lomake', to: '/form' },
];

const dropdownItems = [
  { label: 'Hintavertailu', href: '#' },
  { label: 'Varaosahaku', href: '#' },
  { label: 'Ota yhteyttä', href: '#' },
];

function NavBar() {
  return (
    <nav className="site-nav" aria-label="Päänavigaatio">
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li key={item.label} className="nav-item">
            {item.to ? (
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ) : (
              <a href={item.href} className="nav-link">
                {item.label}
              </a>
            )}
          </li>
        ))}
        <li className="nav-item dropdown">
          <a href="#" className="nav-link">Muut ▾</a>
          <ul className="dropdown-menu">
            {dropdownItems.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
