import React from 'react';

const menuItems = [
  { label: 'Autot', href: '#', active: false },
  { label: 'Moottoripyörät', href: '#', active: false },
  { label: 'Renkaat', href: '#', active: false },
  { label: 'Yhteystiedot', href: '#', active: false },
  { label: 'Info', href: '#', active: false },
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
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
        <li className="nav-item dropdown">
          <a href="#">Muut ▾</a>
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
