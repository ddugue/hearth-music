import React from 'react';
import { connect } from 'react-redux';

class AlbumsView extends React.Component {
  static propTypes = {
    albums: React.PropTypes.object,
  }

  renderAlbum = ({ name, artist, cover }) => (
    <figure>
      <img src={cover} alt={name} />
      <figcaption>
        <h3>{name}</h3>
        <span>{artist.name}</span>
      </figcaption>
    </figure>
  )

  renderAlbums = ({ albums }) => {
    return Object.keys(albums).map(k => this.renderAlbum(albums[k]));
  }

  render() {
    return (
      <div className="view">
        <h1>Albums</h1>
        <section id="albums">
          {this.renderAlbums(this.props)}
        </section>
      </div>
    );
  }
}

export default connect(
  state => ({
    albums: state.albums,
  }),
)(AlbumsView);
