import React, { PropTypes } from 'react';

const propTypes = {

};

const defaultProps = {

};

export default class Choropleth extends React.Component {
  render() {
    return (
      <svg width="100%" height="100%" overflow="hidden" style={{ pointEvents: 'all' }}>

      </svg>
    );
  }
}

Choropleth.propTypes = propTypes;
Choropleth.defaultProps = defaultProps;
