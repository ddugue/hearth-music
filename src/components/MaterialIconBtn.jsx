import React from 'react';

const MaterialIconBtn = ({ name, onClick, disabled }) => (
  <a onClick={disabled ? null : onClick}>
    <i className={`material-icons ${disabled ? 'disabled' : ''}`}>{name}</i>
  </a>
)

MaterialIconBtn.propTypes = {
  name: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool,
};

MaterialIconBtn.defaultProps = {
  disabled: false,
};

export default MaterialIconBtn;
