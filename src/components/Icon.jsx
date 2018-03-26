import React from 'react';

const svgIcons = {};
svgIcons.cassette = require('../img/cassette.svg');
svgIcons.rockon = require('../img/rockon.svg');
svgIcons.vinyl = require('../img/vinyl.svg');
svgIcons.musicNote = require('../img/music_note.svg');
svgIcons.funk = require('../img/funk.svg');
svgIcons.queue = require('../img/queue.svg');
svgIcons.playlist = require('../img/playlist.svg');
svgIcons.play = require('../img/play.svg');
svgIcons.pause = require('../img/pause.svg');
svgIcons.skip = require('../img/next.svg');
svgIcons.previous = require('../img/previous.svg');

const Icon = ({ name, ...rest }) => (
  <div className="svg-icon" {...rest} dangerouslySetInnerHTML={{ __html: svgIcons[name] }} />
);

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default Icon;
