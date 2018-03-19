import React from 'react';
import { Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group'

const INX = {
  '/': 0,
  '/albums': 1,
  '/artists': 2,
  '/songs': 3,
  '/search': 4,
}

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.prevRoute = '/';
    this.fromRight = null;
  }

  render() {
    const Component = this.props.component;
    const render = ({ match, location }) => {
      console.log('Prev', this.prevRoute, 'Now', location.pathname);
      if (location.pathname !== this.prevRoute) {
        this.fromRight = INX[location.pathname] > INX[this.prevRoute];
      }
      this.prevRoute = location.pathname;
      return (
        <div className="view-container">
        <CSSTransition
          mountOnEnter
          unmountOnExit
          classNames={this.fromRight ? 'fromRight' : 'fromLeft'}
          in={!!match}
          timeout={1000}
        >
        <Component />
        </CSSTransition>
        </div>
      );
    };
    return (
      <Route exact={this.props.exact} path={this.props.path} children={render} />
    );
  }
}
