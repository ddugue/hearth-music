import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { nextTrack, previousTrack } from '../actions/nowPlaying';
import { getCurrentTrack, getNextTrack, getHasNext, getHasPrevious } from '../selectors/nowPlaying';

import Audio from '../components/Audio';

class Player extends React.Component {
  static propTypes = {
    onNext: React.PropTypes.func.isRequired,
    onPrevious: React.PropTypes.func.isRequired,
    hasPrevious: React.PropTypes.bool.isRequired,
    hasNext: React.PropTypes.bool.isRequired,
    /* getTrack: React.PropTypes.func.isRequired, */
    track: React.PropTypes.string.isRequired,
    nextTrack: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      paused: false,
      trackPosition: 0,
      position: 0,
      volume: 1.0,
      audio: 0, // Currently playing audio
      index: 0,
    };
  }

  pause = () => {
    this.setState({ paused: true });
  }

  resume = () => {
    this.setState({ paused: false });
  }

  seek = (event) => {
    this.setState({
      position: event.target.value,
      trackPosition: event.target.value,
    });
  }

  render() {
    const toggle = this.state.paused ? this.resume : this.pause;
    const fading = this.state.duration - this.state.time <= 15;
    return (
      <div className="music-player">

        <button disabled={!this.props.hasPrevious} onClick={this.props.onPrevious}>Previous</button>
        <button onClick={toggle}>{this.state.paused ? 'Play' : 'Pause'}</button>
        <button disabled={!this.props.hasNext} onClick={this.props.onNext}>Next</button>
        <div className="line" />
        <div className="cassette">
          <h2>{this.props.track}</h2>
          <div className="inner">
            <div className="wheel" style={{ borderWidth: 50 }} />
            <div className="wheel" style={{ borderWidth: 10 }} />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          disabled={!this.state.position}
          value={this.state.position}
          onChange={this.seek}
          className="seek-bar"
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={this.state.volume}
          onChange={event => this.setState({ volume: parseFloat(event.target.value) })}
        />

        <Audio
          key={this.state.index}
          fade={15}
          onPlaying={(position, time, duration) => this.setState({ position, time, duration })}
          onEnded={() => {
            if (!this.props.hasNext) return;
            this.props.onNext(); // Order is VERY important, call setState after onNext
            this.setState({
              index: this.state.index + 1,
              time: 0,
              position: 0,
              trackPosition: 0,
            });
          }}
          src={this.props.track}
          playing={!this.state.paused}
          position={parseInt(this.state.trackPosition, 10)}
          volume={this.state.volume}
        />
        <Audio
          src={this.props.nextTrack}
          key={this.state.index + 1}
          playing={!this.state.paused && fading}
          volume={this.state.volume}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    track: getCurrentTrack(state),
    nextTrack: getNextTrack(state),
    hasPrevious: getHasPrevious(state),
    hasNext: getHasNext(state),
  }),
  (dispatch, props) => bindActionCreators({
    onNext: nextTrack,
    onPrevious: previousTrack,
  }, dispatch),
)(Player);
