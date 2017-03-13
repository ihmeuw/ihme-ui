import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { propResolver, eventHandleWrapper } from '../../../utils';

import styles from './legend-item.css';
import { Shape } from '../../shape';

/**
 * label renderer
 */
function renderLabel(props) {
  /* eslint-disable react/prop-types */
  const {
    item,
    LabelComponent,
    labelKey
  } = props;

  // if a custom label component is passed in, render it
  if (LabelComponent) return <LabelComponent item={item} />;

  // if labelKey is a function, call it with the current item
  // otherwise, object access
  return propResolver(item, labelKey);
}

export default function LegendItem(props) {
  /* eslint-disable max-len */
  const {
    item,
    itemClassName,
    itemStyles,
    onClear,
    onClick,
    renderClear,
    shapeColorKey,
    shapeTypeKey
  } = props;
  const fill = propResolver(item, shapeColorKey);
  const type = propResolver(item, shapeTypeKey);

  const inlineStyles = typeof itemStyles === 'function' ? itemStyles(item) : itemStyles;

  return (
    <li
      style={inlineStyles}
      className={classNames(styles.li, itemClassName)}
    >
      {renderClear ? (
        <svg
          viewBox="-8 -8 16 16"
          width="1em" height="1em"
          className={classNames(styles.clickable, styles.svg)}
          onClick={onClear ? eventHandleWrapper(onClear, item) : null}
        >
          <path d="M-3,-3L3,3 M-3,3L3,-3" stroke="black" strokeWidth="1.5" />
        </svg>
      ) : null}
      <div
        className={classNames(styles['label-shape-wrapper'], {
          [styles.clickable]: typeof onClick === 'function',
        })}
        onClick={onClick ? eventHandleWrapper(onClick, item) : null}
      >
        <svg
          viewBox="-8 -8 16 16" // bounds of <Shape /> with default size of 64 (8x8)
          width="1em" height="1em"
          className={styles.svg}
        >
          <Shape shapeType={type} fill={fill} />
        </svg>
        <span className={styles.label}>
          {renderLabel(props)}
        </span>
      </div>
    </li>
  );
}

LegendItem.propTypes = {
  /* legend item to render */
  item: PropTypes.object.isRequired,

  /* classname(s) to apply to li */
  itemClassName: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),

  /* inline-styles to be applied to individual legend item <li> */
  itemStyles: PropTypes.oneOfType([
    // if passed an object, will be applied directly inline to the li
    PropTypes.object,

    // if passed a function, will be called with the current item
    PropTypes.func,
  ]),

  /* custom component to render for each label, passed current item */
  LabelComponent: PropTypes.func,

  labelKey: PropTypes.oneOfType([
    /* either the path of label in the item objects */
    PropTypes.string,

    /* or a function to resolve the label, passed the current item */
    PropTypes.func
  ]).isRequired,

  /* callback when 'clear' icon is clicked; see props.renderClear */
  onClear: PropTypes.func,

  /* callback when legend item is clicked */
  onClick: PropTypes.func,

  /* whether to render a 'clear' icon ('x') inline with each legend item */
  renderClear: PropTypes.bool,

  shapeColorKey: PropTypes.oneOfType([
    /* either the path of shape color in the item objects */
    PropTypes.string,

    /* or a function to resolve the shape color, passed the current item */
    PropTypes.func
  ]).isRequired,

  shapeTypeKey: PropTypes.oneOfType([
    /* either the path of shape type in the item objects */
    PropTypes.string,

    /* or a function to resolve the shape type, passed the current item */
    PropTypes.func
  ]).isRequired
};
