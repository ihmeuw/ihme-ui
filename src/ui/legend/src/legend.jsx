import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { isArray, pick } from 'lodash';
import { CommonPropTypes, propResolver } from '../../../utils';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';


/**
 * `import Legend from 'ihme-ui/ui/legend'`
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
    const { items, ItemComponent, labelKey } = this.props;
    const itemProps = pick(this.props, [
      'itemClassName',
      'itemStyles',
      'labelKey',
      'LabelComponent',
      'onClear',
      'onClick',
      'renderClear',
      'symbolColorKey',
      'symbolTypeKey'
    ]);

    if (!isArray(items) || !items.length) return null;
    return items.map((item) => {
      return <ItemComponent key={propResolver(item, labelKey)} item={item} {...itemProps} />;
    });
  }

  render() {
    const {
      wrapperClassName,
      wrapperStyles,
      ulClassName
    } = this.props;

    return (
      <div className={classNames(styles.container, wrapperClassName)} style={wrapperStyles}>
        {this.renderTitle()}
        <ul className={classNames(styles.list, ulClassName)}>
          {this.renderItemList()}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {
  /**
   * legend items
   */
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * component (must be passable to React.createElement) to render for each item;
   * passed props `item`, `itemClassName`, `itemStyles`, `labelKey`, `LabelComponent`, `onClear`, `onClick`, `renderClear`, `symbolColorKey`, `symbolTypeKey`
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
  itemStyles: CommonPropTypes.style,

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
   * callback when 'clear' icon is clicked; signature: function(SyntheticEvent, item) {}
   */
  onClear: PropTypes.func,

  /**
   * callback when legend item is clicked; signature: function(SyntheticEvent, item) {}
   */
  onClick: PropTypes.func,

  /**
   * whether to render a 'clear' icon ('x') inline with each legend item
   */
  renderClear: PropTypes.bool,

  /**
   * path to symbol color in item objects (e.g., 'color', 'properties.color')
   * or a function to resolve the color (signature: function (item) {...})
   */
  symbolColorKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * path to symbol type in item objects (e.g., 'type', 'properties.type') or a function to resolve the type (signature: function (item) {...});
   * must be one of [supported symbol types](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/symbol.js#L23)
   */
  symbolTypeKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

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

  /**
   * className applied to `<ul>`, which wraps legend items
   */
  ulClassName: CommonPropTypes.className,

  /**
   * className applied to outermost, wrapping `<div>`
   */
  wrapperClassName: CommonPropTypes.className,

  /**
   * inline styles applied to outermost, wrapper `<div>`
   */
  wrapperStyles: PropTypes.object
};

Legend.defaultProps = {
  items: [],
  ItemComponent: LegendItem,
  TitleComponent: LegendTitle,
};
