import React from 'react';

const svgIcons = {};
svgIcons.cassette = require('../img/cassette.svg');
svgIcons.rockon = require('../img/rockon.svg');
svgIcons.vinyl = require('../img/vinyl.svg');
svgIcons.musicNote = require('../img/music_note.svg');

const Icon = ({ name, ...rest }) => (
  <div className="svg-icon" {...rest} dangerouslySetInnerHTML={{ __html: svgIcons[name] }} />
);

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default Icon;
