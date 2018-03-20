import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { nextTrack, previousTrack } from '../actions/nowPlaying';
import { getCurrentTrack, getHasNext, getHasPrevious } from '../selectors/nowPlaying';

class Player extends React.Component {

  static propTypes = {
    onNext: React.PropTypes.func.isRequired,
    onPrevious: React.PropTypes.func.isRequired,
    hasPrevious: React.PropTypes.bool.isRequired,
    hasNext: React.PropTypes.bool.isRequired,
    /* getTrack: React.PropTypes.func.isRequired,*/
    track: React.PropTypes.string.isRequired,
    /* nextTrack: React.PropTypes.string,*/
  }

  constructor(props) {
    super(props);
    this.state = {
      playingTrack: null, // Currently playing song
      paused: false,
    };
  }

  componentDidMount() {
    if (this.props.track) {
      this.play(this.props.track);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track && nextProps.track !== this.state.playingTrack) {
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

  seek = () => {
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
        <button disabled={!this.props.hasPrevious} onClick={this.props.onPrevious}>Previous</button>
        <button onClick={toggle}>{this.state.paused ? 'Play' : 'Pause'}</button>
        <button disabled={!this.props.hasNext} onClick={this.props.onNext}>Next</button>

        <div className="cassette">
          <h2>Title of the long song</h2>
          <div className="inner">
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      track: getCurrentTrack(state),
      hasPrevious: getHasPrevious(state),
      hasNext: getHasNext(state),
    };
  },
  (dispatch, props) => {
    return bindActionCreators({
      onNext: nextTrack,
      onPrevious: previousTrack,
    }, dispatch);
  },
)(Player);
