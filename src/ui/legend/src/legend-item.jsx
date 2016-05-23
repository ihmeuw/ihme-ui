import React, { PropTypes } from 'react';

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
      onClick={onClick ? wrappedOnClick : null}
    >
      <svg height="16px" width="100%" className={styles.svg}>
        <defs>
          <symbol id="icon-cross" viewBox="0 0 32 32">
            <title>cross</title>
            <path d="M22.957 23.758c-0.75 0.75-1.966 0.75-2.715 0l-4.242-4.848-4.242 4.846c-0.75 0.75-1.966 0.75-2.715 0-0.75-0.75-0.75-1.966 0-2.715l4.413-5.040-4.414-5.043c-0.75-0.75-0.75-1.965 0-2.715s1.965-0.75 2.715 0l4.243 4.85 4.242-4.85c0.75-0.75 1.965-0.75 2.715 0s0.75 1.966 0 2.715l-4.413 5.043 4.413 5.040c0.75 0.75 0.75 1.966 0 2.717z"></path>
          </symbol>
        </defs>
        <g transform="translate(8,8)">
          {renderClear ? <use onClick={onClear ? wrappedOnClear : null} xlinkHref="#icon-cross" /> : null}
          <Symbol type={type} color={color} />
          <text transform="translate(12,4)">
            {renderLabel(props)}
          </text>
        </g>
      </svg>
    </li>
  );
}

LegendItem.propTypes = propTypes;
LegendItem.defaultProps = defaultProps;
