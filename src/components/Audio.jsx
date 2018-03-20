import React from 'react';

export default class Audio extends React.Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired,
    playing: React.PropTypes.bool,
    position: React.PropTypes.number,
    volume: React.PropTypes.number,
    onPlaying: React.PropTypes.func,
  }

  static defaultProps = {
    playing: true,
    position: 0,
    onPlaying: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      duration: null,
      currentTime: 0,
    };
  }

  componentDidMount() {
    if (this.props.playing) {
      this.resume();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position && nextProps.position !== this.props.position) {
      this.seek(nextProps.position);
    }

    if (!this.props.playing && nextProps.playing) {
      this.resume();
    }

    if (this.props.playing && !nextProps.playing) {
      this.pause();
    }
  }

  handleOnPlaying = () => {
    if (this.props.playing && this.props.onPlaying && this.audio && this.audio.duration) {
      this.setState({ currentTime: this.audio.currentTime });
      this.props.onPlaying(
        (this.audio.currentTime / this.audio.duration) * 100,
      );
    }
  }

  handleOnLoadedMetadata = () => {
    clearInterval(this.interval);
    this.interval = setInterval(this.handleOnPlaying, 1000);
  }

  handleOnCanPlay = () => {
    if (this.props.playing) {
      this.resume();
    }
  }

  seek = (position) => {
    if (this.audio && this.audio.duration) {
      this.audio.currentTime = (position / 100) * this.audio.duration;
    }
  }

  pause = () => {
    if (this.audio) {
      this.audio.pause();
    }
  }

  resume = () => {
    if (this.audio) {
      this.audio.play();
    }
  }

  bindAudio = (audio) => {
    this.audio = audio;
    this.audio.onloadedmetadata = this.handleOnLoadedMetadata;
    this.audio.oncanplay = this.handleOnCanPlay;
  }

  render() {
    return (
      <audio hidden="hidden" src={this.props.src} ref={this.bindAudio} />
    );
  }
}
