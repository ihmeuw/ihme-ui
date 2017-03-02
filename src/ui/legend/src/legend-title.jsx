import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes } from '../../../utils';

import styles from './legend-title.css';

export default function LegendTitle(props) {
  const { className, style, title } = props;
  return (
    <h3 className={classNames(styles.title, className)} style={style}>
      {title}
    </h3>
  );
}

LegendTitle.propTypes = {
  className: CommonPropTypes.className,
  style: PropTypes.object,
  title: PropTypes.string,
};
