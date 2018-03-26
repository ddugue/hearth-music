import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from '../components/Icon';
import Wheel from '../components/Wheel';
import IconBtn from '../components/MaterialIconBtn';
import Volume from '../components/Volume';
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

  handleEnd = () => {
    // On Audio end
    if (!this.props.hasNext) return;
    this.props.onNext(); // Order is VERY important, call setState after onNext
    this.setState({
      index: this.state.index + 1,
      time: 0,
      position: 0,
      trackPosition: 0,
    });
  }

  renderControls = ({ paused }, { onPrevious, hasPrevious, onNext, hasNext }) => {
    const toggle = paused ? this.resume : this.pause;
    return (
      <div className="row" id="controls">
        <IconBtn name="skip_previous" onClick={onPrevious} disabled={!hasPrevious} />
        <IconBtn name={paused ? 'play_arrow' : 'pause'} onClick={toggle} />
        <IconBtn name="skip_next" onClick={onNext} />
      </div>
    );
  }

  render() {
    const fading = this.state.duration - this.state.time <= 15;
    const rightProgress = this.state.position * 33 / 100;
    const leftProgress = 33 - rightProgress;

    return (
      <div className="music-player">
        <div id="left">
          {this.renderControls(this.state, this.props)}
          <Volume level={this.state.volume} onChange={volume => this.setState({ volume })} />
        </div>
      <div id="right">
        <input
            type="range"
            min="0"
            max="100"
            disabled={!this.state.position}
            value={this.state.position}
            onChange={this.seek}
            className="seek-bar"
        />
        <h3>Stevie Wonder</h3>
      </div>
      {/* <div className="line" /> */}
      <div id="cassette">
          <h2>Superstitious</h2>
          <div className="inner">
            <Wheel playing={!this.state.paused} width={leftProgress} top={10} />
            <Wheel playing={!this.state.paused} width={rightProgress} top={10} alignRight />
          </div>
        </div>

        <Audio
            key={this.state.index}
            fade={15}
            onPlaying={(position, time, duration) => this.setState({ position, time, duration })}
            onEnded={this.handleEnd}
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
