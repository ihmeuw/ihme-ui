import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { isArray, pick } from 'lodash';
import { propResolver } from '../../../utils';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';

const propTypes = {
  /* legend items to render */
  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  /* custom component to render for each item, passed current item;
     must be passable to React.createElement
   */
  ItemComponent: PropTypes.func,

  /* inline styles to be applied to individual legend item <li> */
  itemStyles: PropTypes.object,

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
     passed { title: props.title, style: props.titleStyles } as props;
     must be passable to React.createElement
   */
  TitleComponent: PropTypes.func,

  /* extra class names to append to the title component */
  titleClassNames: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),

  /* inline styles to be applied to title component */
  titleStyles: PropTypes.object,

  /* any additional classes to add to <ul> */
  ulClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /* any additional classes to add to Legend container */
  wrapperClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /* inline styles to apply to legend wrapper */
  wrapperStyles: PropTypes.object
};

const defaultProps = {
  items: [],
  ItemComponent: LegendItem,
  renderClear: false,
  onClear: null,
  onClick: null,
  TitleComponent: LegendTitle,
  titleClassNames: [],
};

export default class Legend extends React.Component {

  renderTitle() {
    const { title, TitleComponent, titleClassNames, titleStyles } = this.props;
    if (!title) return null;
    return (
      <TitleComponent
        title={title}
        className={classNames(titleClassNames)}
        style={titleStyles}
      />
    );
  }

  renderItemList() {
    const { items, ItemComponent, labelKey } = this.props;
    const itemProps = pick(this.props, [
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

Legend.propTypes = propTypes;
Legend.defaultProps = defaultProps;
