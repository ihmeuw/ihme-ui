import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './legend-title.css';

const propTypes = {
  /* title for the legend */
  title: PropTypes.string,

  style: PropTypes.object,
};

export default function LegendTitle(props) {
  return (
    <h3 className={classNames(styles.title)} style={props.style}>
      {props.title}
    </h3>
  );
}

LegendTitle.propTypes = propTypes;
