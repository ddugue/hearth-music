import React from 'react';

const Volume = ({ level, onChange }) => {
  // Control to manage volume level
  let volumeIcon;
  if (level > 0.7) {
    volumeIcon = 'volume_up';
  } else if (level > 0.4) {
    volumeIcon = 'volume_down';
  } else if (level > 0) {
    volumeIcon = 'volume_mute';
  } else {
    volumeIcon = 'volume_off';
  }
  return (
    <div className="volume-container">
      <div className="volume-icon">
        <i className="material-icons">{volumeIcon}</i>
      </div>
      <div className="volume">
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={level}
            onChange={event => onChange(parseFloat(event.target.value)) }
        />
      </div>
    </div>
  );
};

Volume.propTypes = {
  level: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default Volume;
