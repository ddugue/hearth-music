import React from 'react';

export default class Player extends React.Component {

  static propTypes = {
    onNext: React.PropTypes.func.isRequired,
    onPrevious: React.PropTypes.func.isRequired,
    getTrack: React.PropTypes.func.isRequired,
    track: React.PropTypes.bool.isRequired,
    nextTrack: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      playingTrack: null, // Currently playing song
      paused: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track !== this.state.playingTrack) {
      this.play(nextProps.track);
    }
  }

  pause = () => {
    this.setState({ paused: true });
    if (this.audio) {
      this.audio.pause();
    }
  }

  resume = () => {
    this.setState({ paused: false });
    if (this.audio) {
      this.audio.play();
    }
  }

  play = (track) => {
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();
    }
    this.audio = new Audio();
    this.audio.src = track;
    this.audio.hidden = 'hidden';
    this.audio.autoplay = 'true';
    document.body.appendChild(this.audio);
    this.setState({ playingTrack: track, paused: false });
  }

  render() {
    const toggle = this.state.paused ? this.resume : this.pause;
    return (
      <div className="music-player">
        <button onClick={this.props.onPrevious}>Previous</button>
        <button onClick={toggle}>{this.state.paused ? 'Play' : 'Pause'}</button>
        <button onClick={this.props.onNext}>Next</button>

        <div className="cassette">
          <h2>Title of the long song</h2>
          <div className="inner">
          </div>
        </div>
      </div>
    );
  }
}
