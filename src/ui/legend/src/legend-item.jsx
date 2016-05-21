import React, { PropTypes } from 'react';

import styles from './legend-item.css';
import { Symbol } from '../../shape';

const propTypes = {
  item: PropTypes.object,
  itemHeight: PropTypes.number,
  labelComponent: PropTypes.element,
  labelKey: PropTypes.oneOfType([
    /* either the path of label in the item objects */
    PropTypes.string,

    /* or a function to resolve the label, passed the current item */
    PropTypes.function
  ]),
  symbolColorKey: PropTypes.oneOfType([
    /* either the path of symbol color in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol color, passed the current item */
    PropTypes.function
  ]),

  symbolTypeKey: PropTypes.oneOfType([
    /* either the path of symbol type in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol type, passed the current item */
    PropTypes.function
  ])
};

export default class LegendItem extends React.Component {
  static propResolver(item, property) {
    return typeof property === 'function' ? property(item) : item[property];
  }

  renderLabel() {
    const {
      item,
      labelComponent,
      labelKey
    } = this.props;

    // if a custom label component is passed in, render it
    if (labelComponent) return <labelComponent item={item} />;

    // if labelKey is a function, call it with the current item
    // otherwise, object access
    return LegendItem.propResolver(item, labelKey);
  }

  renderSymbol() {
    const {
      item,
      symbolColorKey,
      symbolTypeKey
    } = this.props;

    const color = LegendItem.propResolver(item, symbolColorKey);
    const type = LegendItem.propResolver(item, symbolTypeKey);

    return <Symbol type={type} color={color} />;
  }

  render() {
    return (
      <li style={{ height: this.props.itemHeight }} className={styles.wrapper}>
        <svg height="16px" width="100%" className={styles.svg}>
          <g transform="translate(8,8)">
            {this.renderSymbol()}
            <text transform="translate(12,4)">
              {this.renderLabel()}
            </text>
          </g>
        </svg>
      </li>
    );
  }
}

LegendItem.propTypes = propTypes;
