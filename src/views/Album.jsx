import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { albumTracks as fetchAlbumTracks } from '../actions/fetch';
import { play } from '../actions/nowPlaying';

import { ROOT_URL } from '../constants';

class AlbumView extends React.Component {
  static propTypes = {
    album: React.PropTypes.object,
    tracks: React.PropTypes.array,
    onLoad: React.PropTypes.func,
    handlePlay: React.PropTypes.func,
  }

  componentDidMount = () => {
    this.props.onLoad();
  }

  renderLoading = () => {
    return (<h2>Loading{'.'.repeat(this.state.loadingTick)}</h2>)
  }

  renderTrack = (track, i) => {
    const song = ROOT_URL + track.music;
    return (
      <li key={track.id}
          onClick={() => this.props.handlePlay(song)}>{i}. {track.title}</li>)
  }
  renderTracks = ({ tracks }) => {
    if (!tracks) return null;
    return (
      <ul>
        {tracks.map(this.renderTrack)}
      </ul>
    );
  }
  render() {
    return (
      <div className="view">
        <h1>{this.props.album.name}</h1>
        <section id="album">
          {this.renderTracks(this.props)}
        </section>
      </div>
    );
  }
}

export default connect(
  (state, { match }) => ({
    album: state.albums[match.params.id],
    tracks: state.albums[match.params.id].tracks,
  }),
  (dispatch, { match }) => bindActionCreators({
    onLoad: () => fetchAlbumTracks(match.params.id),
    handlePlay: play,
  }, dispatch),
)(AlbumView);
