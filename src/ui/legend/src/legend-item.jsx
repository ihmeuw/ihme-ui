import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './legend-item.css';
import { Symbol } from '../../shape';

const propTypes = {
  item: PropTypes.object,
  itemHeight: PropTypes.number,
  labelRenderer: PropTypes.func,
  labelKey: PropTypes.oneOfType([
    /* either the path of label in the item objects */
    PropTypes.string,

    /* or a function to resolve the label, passed the current item */
    PropTypes.func
  ]),

  /* callback when 'clear' icon is clicked; see props.renderClear */
  onClear: PropTypes.func,

  /* callback when legend item is clicked */
  onClick: PropTypes.func,

  /* whether to render a 'clear' icon ('x') inline with each legend item */
  renderClear: PropTypes.bool,

  symbolColorKey: PropTypes.oneOfType([
    /* either the path of symbol color in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol color, passed the current item */
    PropTypes.func
  ]),

  symbolTypeKey: PropTypes.oneOfType([
    /* either the path of symbol type in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol type, passed the current item */
    PropTypes.func
  ])
};

const defaultProps = {
  item: {},
  itemHeight: 23,
  labelRenderer: null,
  labelKey: '',
  symbolColorKey: '',
  symbolTypeKey: ''
};

function propResolver(item, property) {
  return typeof property === 'function' ? property(item) : item[property];
}

/**
 * label renderer
 */
function renderLabel(props) {
  const {
    item,
    labelRenderer,
    labelKey
  } = props;

  // if a custom label component is passed in, render it
  if (labelRenderer) return labelRenderer({ item });

  // if labelKey is a function, call it with the current item
  // otherwise, object access
  return propResolver(item, labelKey);
}

export default function LegendItem(props) {
  /* eslint-disable max-len */
  const {
    item,
    itemHeight,
    labelKey,
    onClear,
    onClick,
    renderClear,
    symbolColorKey,
    symbolTypeKey
  } = props;
  const color = propResolver(item, symbolColorKey);
  const type = propResolver(item, symbolTypeKey);

  function wrappedOnClick(event) {
    event.preventDefault();
    event.stopPropagation();

    return onClick(event, item);
  }

  function wrappedOnClear(event) {
    event.preventDefault();
    event.stopPropagation();

    return onClear(event, item);
  }

  return (
    <li
      key={propResolver(item, labelKey)}
      style={{ height: itemHeight }}
      className={styles.wrapper}
    >
      {renderClear ? (
        <svg
          viewBox="-8 -8 16 16"
          width="1em" height="1em"
          className={styles.clear}
          onClick={onClear ? wrappedOnClear : null}
        >
          <path d="M-3,-3L3,3 M-3,3L3,-3" stroke="black" strokeWidth="1.5" />
        </svg>
      ) : null}
      <div className={classNames(styles.wrapper, { [styles.clickable]: typeof onClick === 'function' })}>
        <svg
          viewBox="-8 -8 16 16" // bounds of <Symbol /> with default size of 64
          width="1em" height="1em"
          className={styles.svg}
          onClick={onClick ? wrappedOnClick : null}
        >
          <Symbol type={type} color={color} />
        </svg>
        <span>
          {renderLabel(props)}
        </span>
      </div>
    </li>
  );
}

LegendItem.propTypes = propTypes;
LegendItem.defaultProps = defaultProps;
