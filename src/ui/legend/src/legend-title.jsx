import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  combineStyles,
  CommonPropTypes,
  memoizeByLastCall,
} from '../../../utils';

import styles from './legend-title.css';

const resolveTitleStyles = memoizeByLastCall(combineStyles);

/**
 * import { LegendTitle } from 'ihme-ui';
 *
 * Default TitleComponent used by `<Legend />`.
 */
export default function LegendTitle(props) {
  const {
    className,
    items,
    style,
    title,
  } = props;

  if (!title) return null;

  return (
    <h3
      className={classNames(styles.title, className)}
      style={resolveTitleStyles(style, items)}
    >
      {title}
    </h3>
  );
}

LegendTitle.propTypes = {
  /**
   * classname applied to `<h3>`
   */
  className: CommonPropTypes.className,

  /**
   * legend items
   */
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * inline styles applied to title component
   * if a function, passed items as argument.
   * Signature: (items): {} => { ... }.
   */
  style: CommonPropTypes.style,

  /**
   * title for the legend
   */
  title: PropTypes.string,
};
