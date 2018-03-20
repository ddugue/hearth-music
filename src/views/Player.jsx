import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { nextTrack, previousTrack } from '../actions/nowPlaying';
import { getCurrentTrack, getHasNext, getHasPrevious } from '../selectors/nowPlaying';

import Audio from '../components/Audio';

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
      /* playingTrack: null, // Currently playing song*/
      paused: false,
      /* duration: null,
       * currentTime: 0,*/
      trackPosition: 0,
      position: 0,
    };
  }

  componentDidMount() {
    /* if (this.props.track) {
     *   this.play(this.props.track);
     * }*/
  }

  componentWillReceiveProps(nextProps) {
    /* if (nextProps.track && nextProps.track !== this.state.playingTrack) {
     *   this.play(nextProps.track);
     * }*/
  }

  pause = () => {
    this.setState({ paused: true });
    /* if (this.audio) {
     *   this.audio.pause();
     * }*/
  }

  resume = () => {
    this.setState({ paused: false });
    /* if (this.audio) {
     *   this.audio.play();
     * }*/
  }

  seek = (event) => {
    this.setState({
      position: event.target.value,
      trackPosition: event.target.value,
    });
    /* if (this.audio) {
     *   this.audio.currentTime = (position.target.value / 100) * this.audio.duration;
     * }*/
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
    this.setState({ playingTrack: track, paused: false, duration: null });

    this.audio.onloadedmetadata = () => {
      this.setState({ duration: this.audio.duration });
    };

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.audio.currentTime);
      this.setState({ currentTime: this.audio.currentTime });
    }, 1000);

    this.audio.onloadedmetadata = () => {
      this.setState({ duration: this.audio.duration });
    };
  }

  render() {
    const toggle = this.state.paused ? this.resume : this.pause;
    return (
      <div className="music-player">
        <button disabled={!this.props.hasPrevious} onClick={this.props.onPrevious}>Previous</button>
        <button onClick={toggle}>{this.state.paused ? 'Play' : 'Pause'}</button>
        <button disabled={!this.props.hasNext} onClick={this.props.onNext}>Next</button>
        <input type="range" min="0" max="100" disabled={!this.state.position}
               value={this.state.position} onChange={this.seek} className="seek-bar"
        />
        {this.props.track && <Audio onPlaying={(position) => this.setState({ position })} src={this.props.track} playing={!this.state.paused} position={parseInt(this.state.trackPosition, 10)} />}

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
