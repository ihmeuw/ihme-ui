import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  map,
  pick,
} from 'lodash';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
} from '../../../utils';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';

/**
 * `import { Legend } from 'ihme-ui'`
 *
 */
export default class Legend extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineWrapperStyles = memoizeByLastCall(combineStyles);
    this.combineListStyles = memoizeByLastCall(combineStyles);
  }

  renderTitle() {
    const {
      items,
      title,
      TitleComponent,
      titleClassName,
      titleStyles,
    } = this.props;

    return (
      <TitleComponent
        className={titleClassName}
        items={items}
        style={titleStyles}
        title={title}
      />
    );
  }

  renderItemList() {
    const {
      itemClassName,
      items,
      ItemComponent,
      itemStyle,
      labelKey,
    } = this.props;

    const itemProps = pick(this.props, [
      'labelKey',
      'LabelComponent',
      'onClear',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'shapeColorKey',
      'shapeTypeKey'
    ]);

    return map(items, item =>
      <ItemComponent
        className={itemClassName}
        key={propResolver(item, labelKey)}
        item={item}
        style={itemStyle}
        {...itemProps}
      />
    );
  }

  render() {
    const {
      className,
      listClassName,
      listStyle,
      items,
      style,
    } = this.props;

    return (
      <div
        className={classNames(styles.container, className)}
        style={this.combineWrapperStyles(style, items)}
      >
        {this.renderTitle()}
        <ul
          className={classNames(styles.list, listClassName)}
          style={this.combineListStyles(listStyle, items)}
        >
          {this.renderItemList()}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {

  /**
   * className applied to outermost, wrapping `<div>`
   */
  className: CommonPropTypes.className,

  /**
   * legend items
   */
  items: PropTypes.arrayOf(PropTypes.object),

  /**
   * component (must be passable to React.createElement) to render for each item;
   * passed props `className`, `item`, `labelKey`, `LabelComponent`, `onClear`, `onClick`,
   * `onMouseLeave`, `onMouseMove`, `onMouseOver`, `shapeColorKey`, `shapeTypeKey`, `style`
   * defaults to [LegendItem](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-item.jsx)
   */
  ItemComponent: PropTypes.func,

  /**
   * classname applied to `ItemComponent`
   */
  itemClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `ItemComponent`
   * if passed an object, will be applied directly inline to the `<li>`
   * if passed a function, will be called with the current item obj
   */
  itemStyle: CommonPropTypes.style,

  /**
   * custom component to render for each label, passed current item;
   * must be passable to React.createElement
   */
  LabelComponent: PropTypes.func,

  /**
   * path to label in item objects (e.g., 'name', 'properties.label')
   * or a function to resolve the label
   * signature: function (item) {...}
   */
  labelKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * className applied to `<ul>`, which wraps legend items
   */
  listClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<ul>`, which wraps legend items
   * if a function, passed items as argument. Signature: (items): {} => { ... }.
   */
  listStyle: CommonPropTypes.style,

  /**
   * callback when 'clear' icon is clicked;
   * signature: (SyntheticEvent, item, instance) => {}
   */
  onClear: PropTypes.func,

  /**
   * callback when legend item is clicked;
   * signature: (SyntheticEvent, item, instance) => {}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback registered on each item.
   * signature: (SyntheticEvent, item, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback registered on each item.
   * signature: (SyntheticEvent, item, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback registered on each item.
   * signature: (SyntheticEvent, item, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * path to shape color in item objects (e.g., 'color', 'properties.color')
   * or a function to resolve the color
   * signature: (item) => {...}
   */
  shapeColorKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * path to shape type in item objects (e.g., 'type', 'properties.type')
   * or a function to resolve the type
   * if a function: signature: (item) => {...}
   * must be one of [supported shape types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/shape.js#L23)
   */
  shapeTypeKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * inline styles applied to outermost, wrapper `<div>`
   * if a function, passed items as argument. Signature: (items): {} => { ... }.
   */
  style: CommonPropTypes.style,

  /**
   * title for the legend
   */
  title: PropTypes.string,

  /**
   * component (must be passable to React.createElement) to render for the title;
   * passed props `className`, `items`, `style`, `title`
   * defaults to [LegendTitle](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-title.jsx)
   */
  TitleComponent: PropTypes.func,

  /**
   * className applied to title component
   */
  titleClassName: CommonPropTypes.className,

  /**
   * inline styles applied to title component
   * if a function, passed items as argument.
   * Signature: (items): {} => { ... }.
   */
  titleStyles: CommonPropTypes.style,
};

Legend.defaultProps = {
  items: [],
  ItemComponent: LegendItem,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  TitleComponent: LegendTitle,
};
