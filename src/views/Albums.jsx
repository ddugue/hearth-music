import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Link } from 'react-router-dom'

import { ROOT_URL } from '../constants';

import { albums as fetchAlbums } from '../actions/fetch';
class AlbumsView extends React.Component {

  static propTypes = {
    albums: React.PropTypes.object,
    loading: React.PropTypes.bool,
    onLoad: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      loadingTick: 1,
    };
  }

  handleInterval = () => {
    if (this.props.loading) {
      const tick = ((this.state.loadingTick + 1) % 3) + 1;
      this.setState({ loadingTick: tick });
    }
  }

  componentDidMount = () => {
    this.props.onLoad();
    this.interval = setInterval(this.handleInterval, 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  renderAlbum = ({ uuid, name, artist, cover }) => (
    <Link key={uuid} to={`/album/${uuid}`}>
      <figure>
        <img src={ROOT_URL + cover} alt={name} />
        <figcaption>
          <h3>{name}</h3>
          <span>{artist.name}</span>
        </figcaption>
      </figure>
    </Link>
  )

  renderAlbums = ({ albums, loading }) => {
    if (loading && albums.length === 0) return null;
    return Object.keys(albums).map(k => this.renderAlbum(albums[k]));
  }

  renderLoading = ({ albums, loading }) => {
    if (!loading || albums.length > 0) return null;
    return (<h2>Loading{'.'.repeat(this.state.loadingTick)}</h2>);
  }

  render() {
    return (
      <div className="view">
        <h1>Albums</h1>
        <section id="albums">
          {this.renderAlbums(this.props)}
          {this.renderLoading(this.props)}
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({
    albums: state.albums,
    loading: state.loading.albums,
  }),
  (dispatch, props) => bindActionCreators({
    onLoad: fetchAlbums,
  }, dispatch),
)(AlbumsView);
