import React from 'react';

const context = new AudioContext();
export default class Audio extends React.Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired,
    playing: React.PropTypes.bool,
    position: React.PropTypes.number,
    volume: React.PropTypes.number,
    fade: React.PropTypes.number,
    onPlaying: React.PropTypes.func,
  }

  static defaultProps = {
    playing: true,
    position: 0,
    fade: 0,
    volume: 1.0,
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
    this.setVolume(this.props.volume);
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

    if (nextProps.src && nextProps.src !== this.props.src) {

    }
    if (nextProps.volume !== this.props.volume) {
      this.setVolume(nextProps.volume);
    }
  }

  handleOnPlaying = () => {
    if (this.props.playing && this.props.onPlaying && this.audio && this.audio.duration) {
      const percent = ((this.audio.currentTime / this.audio.duration) * 100);

      if (this.previousPercent !== percent) {
        this.props.onPlaying(percent);
      }

      this.previousPercent = this.percent;
      const delta = this.audio.duration - this.audio.currentTime;
      console.log(delta);
      if (delta < this.props.fading) {
        this.crossfade(1 - (delta / this.props.fading));
      }
    }
  }

  handleOnLoadedMetadata = () => {
    clearInterval(this.interval);
    this.interval = setInterval(this.handleOnPlaying, 100);
  }

  handleOnCanPlay = () => {
    if (this.props.playing) {
      this.resume();
    }
  }

  crossfade = (percent) => {
    if (this.gain) {
      const gain = Math.cos(percent * 0.5 * Math.PI);
      this.gain.value = gain;
    }
  }

  setVolume = (volume) => {
    if (this.audio) {
      this.audio.volume = volume;
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
    /* this.audio.crossOrigin = "anonymous";*/
    this.audio.onloadedmetadata = this.handleOnLoadedMetadata;
    this.audio.oncanplay = this.handleOnCanPlay;
    /* this.source = context.createMediaElementSource(audio);
     * this.gain = context.createGain();
     * this.source.connect(this.gain);
     * this.gain.connect(context.destination);*/
  }

  render() {
    return (
      <audio hidden="hidden" src={this.props.src} ref={this.bindAudio} />
    );
  }
}
