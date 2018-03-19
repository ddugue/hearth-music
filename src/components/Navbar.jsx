import React from 'react';
import NavButton from '../components/NavButton';
import Icon from '../components/Icon';

const Navbar = (props) => {
  return (
    <nav>
      <NavButton text="Hearth" className="dark-red" to="/" icon={<Icon name="cassette" />} />
      <div className="gap" />
      <NavButton text="Albums" className="brown" to="/albums" icon={<Icon name="vinyl" />} />
      <NavButton text="Artists" className="brown" to="/artists" icon={<Icon name="funk" />} />
      <NavButton text="Songs" className="brown" to="/songs" icon={<Icon name="musicNote" />} />
      <div className="gap" />
      <NavButton text="Genres" className="red" to="/genre" icon={<Icon name="rockon" />} />
      <NavButton text="Mixes" className="red" to="/mixes" icon={<Icon name="playlist" />} />
      <NavButton text="Queue" className="red" to="/queue" icon={<Icon name="queue" />} />
      {/* <div className="gap" />
          <NavButton text="Output" className="salmon" to="/output" icon={<Icon name="cassette" />} />
          <NavButton text="Account" className="salmon" to="/account" icon={<Icon name="cassette" />} />
          <div className="gap" />
          <NavButton text="Help" className="orange" to="/help" icon={<Icon name="cassette" />} />
          <NavButton text="Info" className="orange" to="/info" icon={<Icon name="cassette" />} /> */}
      <div className="fill" />
      <NavButton text="Search" className="grey" to="/search" icon={<Icon name="cassette" />} />
    </nav>
  )
}

export default Navbar;
