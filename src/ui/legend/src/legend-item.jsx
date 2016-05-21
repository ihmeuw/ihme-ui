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
  const { item, labelKey, itemHeight, symbolColorKey, symbolTypeKey } = props;
  const color = propResolver(item, symbolColorKey);
  const type = propResolver(item, symbolTypeKey);

  return (
    <li
      key={propResolver(item, labelKey)}
      style={{ height: itemHeight }}
      className={styles.wrapper}
    >
      <svg height="16px" width="100%" className={styles.svg}>
        <g transform="translate(8,8)">
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
