import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { albumTracks as fetchAlbumTracks } from '../actions/fetch';
import { play } from '../actions/nowPlaying';
import { getAlbumTracks } from '../selectors/nowPlaying';


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

  renderLoading = () => (<h2>Loading{'.'.repeat(this.state.loadingTick)}</h2>)

  renderTrack = (track, i) => {
    return (
      <li key={track.uuid} onClick={() => this.props.handlePlay(track.uuid)}>
        {track.track}. {track.title}
      </li>);
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
    album: state.albums[match.params.uuid],
    tracks: getAlbumTracks(state, { match }),
  }),
  (dispatch, { match }) => bindActionCreators({
    onLoad: () => fetchAlbumTracks(match.params.uuid),
    handlePlay: play,
  }, dispatch),
)(AlbumView);
