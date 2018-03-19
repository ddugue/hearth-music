import React from 'react';
import NavButton from '../components/NavButton';
import Icon from '../components/Icon';

const Navbar = (props) => {
  return (
    <nav>
      <NavButton text="Hearth" className="red" to="/" icon={<Icon name="cassette" />} />
      <div className="gap" />
      <NavButton text="Albums" className="brown" to="/albums" icon={<Icon name="vinyl" />} />
      <NavButton text="Artists" className="brown" to="/artists" icon={<Icon name="rockon" />} />
      <NavButton text="Songs" className="brown" to="/songs" icon={<Icon name="musicNote" />} />
      <div className="gap" />
      <NavButton text="Genres" className="brown" to="/genre" icon={<Icon name="cassette" />} />
      <NavButton text="Mixes" className="brown" to="/mixes" icon={<Icon name="cassette" />} />
      <NavButton text="Queue" className="brown" to="/queue" icon={<Icon name="cassette" />} />
      <div className="gap" />
      <NavButton text="Output" className="brown" to="/output" icon={<Icon name="cassette" />} />
      <NavButton text="Account" className="brown" to="/account" icon={<Icon name="cassette" />} />
      <div className="gap" />
      <NavButton text="Help" className="brown" to="/help" icon={<Icon name="cassette" />} />
      <NavButton text="Info" className="brown" to="/info" icon={<Icon name="cassette" />} />
      <div className="fill" />
      <NavButton text="Search" className="red" to="/search" icon={<Icon name="cassette" />} />
    </nav>
  )
}

export default Navbar;
