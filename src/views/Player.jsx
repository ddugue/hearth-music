import React from 'react';

export default class Player extends React.Component {
  render() {
    return (
      <div className="music-player">
        <div className="line" />
        <div className="cassette">
          <h2>Title of the long song</h2>
          <div className="inner">
            <div className="wheel" style={{borderWidth: 50}} />
            <div className="wheel" style={{borderWidth: 10}}/>
          </div>
        </div>
      </div>
    );
  }
}
