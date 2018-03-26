import React from 'react';

const Wheel = ({ width, playing, top, alignRight }) => {
  const positionLeft = (-1 * width) + 3;
  const positionTop = (-1 * width) - top + 3;
  const style = {
    top: positionTop,
    borderWidth: width,
  }
  if (alignRight) {
    style.right = positionLeft;
  } else {
    style.left = positionLeft;
  }

  return (
    <div className="wheel" style={style}>
      <div className="inner">
        <img className={playing ? 'playing' : ''} src="img/wheel.png" />
      </div>
    </div>
  );
}

Wheel.propTypes = {
  width: React.PropTypes.number.isRequired,
  top: React.PropTypes.number.isRequired,
  playing: React.PropTypes.bool,
  alignRight: React.PropTypes.bool,
};

Wheel.defaultProps = {
  playing: false,
  alignRight: false,
};

export default Wheel;
