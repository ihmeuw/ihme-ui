import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { isArray, pick } from 'lodash';
import { CommonPropTypes, propResolver } from '../../../utils';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';

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
  /* legend items to render */
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* custom component to render for each item, passed current item;
   must be passable to React.createElement
   */
  ItemComponent: PropTypes.func,

  /* classname(s) to apply to li */
  itemClassName: CommonPropTypes.className,

  /*
   inline-styles to be applied to individual legend item <li>
   if passed an object, will be applied directly inline to the li
   if passed a function, will be called with the current item
  */
  itemStyles: CommonPropTypes.style,

  /* custom component to render for each label, passed current item;
   must be passable to React.createElement
   */
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

  symbolColorKey: PropTypes.oneOfType([
    /* either the path of symbol color in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol color, passed the current item */
    PropTypes.func
  ]).isRequired,

  symbolTypeKey: PropTypes.oneOfType([
    /* either the path of symbol type in the item objects */
    PropTypes.string,

    /* or a function to resolve the symbol type, passed the current item */
    PropTypes.func
  ]).isRequired,

  /* title for the legend */
  title: PropTypes.string,

  /* custom component to render for the title;
   passed { className: props.titleClassName, title: props.title, style: props.titleStyles } as props;
   must be passable to React.createElement
   */
  TitleComponent: PropTypes.func,

  /* extra class names to append to the title component */
  titleClassName: CommonPropTypes.className,

  /* inline styles to be applied to title component */
  titleStyles: PropTypes.object,

  /* any additional classes to add to <ul> */
  ulClassName: CommonPropTypes.className,

  /* any additional classes to add to Legend container */
  wrapperClassName: CommonPropTypes.className,

  /* inline styles to apply to legend wrapper */
  wrapperStyles: PropTypes.object
};

Legend.defaultProps = {
  items: [],
  ItemComponent: LegendItem,
  TitleComponent: LegendTitle,
};
