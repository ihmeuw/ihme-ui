import React, { PropTypes } from 'react';
import classNames from 'classnames';
import {
  map,
  pick,
} from 'lodash';
import { CommonPropTypes, propResolver } from '../../../utils';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';


/**
 * `import { Legend } from 'ihme-ui'`
 *
 */
export default class Legend extends React.Component {

  renderTitle() {
    const { title, TitleComponent, titleClassName, titleStyles } = this.props;
    if (!title) return null;
    return (
      <TitleComponent
        title={title}
        className={classNames(titleClassName)}
        style={titleStyles}
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
      'renderClear',
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
      style,
    } = this.props;

    return (
      <div className={classNames(styles.container, className)} style={style}>
        {this.renderTitle()}
        <ul className={classNames(styles.list, listClassName)} style={listStyle}>
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * component (must be passable to React.createElement) to render for each item;
   * passed props `item`, `className`, `style`, `labelKey`, `LabelComponent`, `onClear`, `onClick`, `renderClear`, `shapeColorKey`, `shapeTypeKey`
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
   * or a function to resolve the label (signature: function (item) {...})
   */
  labelKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * className applied to `<ul>`, which wraps legend items
   */
  listClassName: CommonPropTypes.className,

  /**
   * inline styles applied to `<ul>`, which wraps legend items
   */
  listStyle: PropTypes.object,

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
   * whether to render a 'clear' icon ('x') inline with each legend item
   */
  renderClear: PropTypes.bool,

  /**
   * path to shape color in item objects (e.g., 'color', 'properties.color')
   * or a function to resolve the color
   * signature: (item) => {...}
   */
  shapeColorKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * path to shape type in item objects (e.g., 'type', 'properties.type')
   * or a function to resolve the type
   * if a function: signature: (item) => {...}
   * must be one of [supported shape types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/shape.js#L23)
   */
  shapeTypeKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * inline styles applied to outermost, wrapper `<div>`
   */
  style: PropTypes.object,

  /**
   * title for the legend
   */
  title: PropTypes.string,

  /**
   * component (must be passable to React.createElement) to render for the title;
   * passed props `title`, `className`, `style`
   * defaults to [LegendTitle](https://github.com/ihmeuw/ihme-ui/blob/master/src/ui/legend/src/legend-title.jsx)
   */
  TitleComponent: PropTypes.func,

  /**
   * className applied to title component
   */
  titleClassName: CommonPropTypes.className,

  /**
   * inline styles applied to title component
   */
  titleStyles: PropTypes.object,
};

Legend.defaultProps = {
  items: [],
  ItemComponent: LegendItem,
  TitleComponent: LegendTitle,
};
