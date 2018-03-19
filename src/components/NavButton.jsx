import React from 'react';

import { NavLink } from 'react-router-dom'

const NavButton = ({ to, className, icon, text, ...rest }) => {
  return (
    <NavLink exact to={to} className={`btn ${className}`} {...rest}>
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}

export default NavButton;
