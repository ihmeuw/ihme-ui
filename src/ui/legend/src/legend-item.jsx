import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
} from '../../../utils';

import styles from './legend-item.css';
import { Shape } from '../../shape';

export default class LegendItem extends React.Component {
  constructor(props) {
    super(props);

    this.combineItemStyles = memoizeByLastCall(combineStyles);

    bindAll(this, [
      'onClear',
      'onClick',
    ]);
  }

  onClear(event) {
    const {
      item,
      onClear,
    } = this.props;

    onClear(event, item, this);
  }

  onClick(event) {
    const {
      item,
      onClick,
    } = this.props;

    // want to check below if item is clickable, so should not provide noop default
    if (!onClick) return;
    onClick(event, item, this);
  }

  renderLabel() {
    const {
      item,
      LabelComponent,
      labelKey
    } = this.props;

    // if a custom label component is passed in, render it
    if (LabelComponent) return <LabelComponent item={item} />;

    // if labelKey is a function, call it with the current item
    // otherwise, object access
    return propResolver(item, labelKey);
  }

  render() {
    const {
      className,
      item,
      onClick,
      renderClear,
      shapeColorKey,
      shapeTypeKey,
      style,
    } = this.props;

    const fill = propResolver(item, shapeColorKey);
    const type = propResolver(item, shapeTypeKey);

    return (
      <li
        className={classNames(styles.li, className)}
        style={this.combineItemStyles(style, item)}
      >
        {renderClear ? (
          <svg
            viewBox="-8 -8 16 16"
            width="1em" height="1em"
            className={classNames(styles.clickable, styles.svg)}
            onClick={this.onClear}
          >
            <path d="M-3,-3L3,3 M-3,3L3,-3" stroke="black" strokeWidth="1.5" />
          </svg>
        ) : null}
        <div
          className={classNames(styles['label-shape-wrapper'], {
            [styles.clickable]: typeof onClick === 'function',
          })}
          onClick={this.onClick}
        >
          <svg
            viewBox="-8 -8 16 16" // bounds of <Shape /> with default size of 64 (8x8)
            width="1em" height="1em"
            className={styles.svg}
          >
            <Shape shapeType={type} fill={fill} />
          </svg>
          <span className={styles.label}>
            {this.renderLabel()}
          </span>
        </div>
      </li>
    );
  }
}

LegendItem.propTypes = {
  /**
   * classname(s) to apply to li
   */
  className: CommonPropTypes.className,

  /**
   * legend item to render
   */
  item: PropTypes.object.isRequired,

  /**
   * custom component to render for each label, passed current item
   */
  LabelComponent: PropTypes.func,

  /**
   * either the path of label in the item objects
   * or a function to resolve the label, passed the current item
   */
  labelKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * callback when 'clear' icon is clicked; see props.renderClear
   */
  onClear: PropTypes.func,

  /**
   * callback when legend item is clicked
   */
  onClick: PropTypes.func,

  /**
   * whether to render a 'clear' icon ('x') inline with each legend item
   */
  renderClear: PropTypes.bool,

  /**
   * either the path of shape color in the item objects
   * or a function to resolve the shape color, passed the current item
   */
  shapeColorKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * either the path of shape type in the item objects
   * or a function to resolve the shape type, passed the current item
   */
  shapeTypeKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * inline-styles to be applied to individual legend item <li>
   * if a function, passed items as argument. Signature: (items): {} => { ... }.
   */
  style: CommonPropTypes.style,
};

LegendItem.defaultProps = {
  onClear: CommonDefaultProps.noop,
};
