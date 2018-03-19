import React from 'react';
import NavButton from '../components/NavButton';
import Icon from '../components/Icon';

const Navbar = (props) => {
  return (
    <nav>
      <NavButton text="Hearth" className="brown" to="/" icon={<Icon name="cassette" />} />
      <div className="gap" />
      <NavButton text="Albums" className="red" to="/albums" icon={<Icon name="cassette" />} />
      <NavButton text="Artists" className="red" to="/artists" icon={<Icon name="cassette" />} />
      <NavButton text="Songs" className="red" to="/songs" icon={<Icon name="cassette" />} />
      <div className="fill" />
      <NavButton text="Search" className="brown" to="/search" icon={<Icon name="cassette" />} />
    </nav>
  )
}

export default Navbar;
