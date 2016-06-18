import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './legend-title.css';

const propTypes = {
  /* title for the legend */
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default function LegendTitle(props) {
  const { title, className, style } = props;
  return (
    <h3 className={classNames(styles.title, className)} style={style}>
      {title}
    </h3>
  );
}

LegendTitle.propTypes = propTypes;
