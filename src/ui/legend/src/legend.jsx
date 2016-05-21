import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { isArray, omit } from 'lodash';

import styles from './legend.css';

import LegendItem from './legend-item';
import LegendTitle from './legend-title';

const propTypes = {
  /* legend items to render */
  items: PropTypes.arrayOf(PropTypes.shape({
    /* whether this item should be rendered with a 'clear' icon */
    clearable: PropTypes.bool
  })),

  /* custom React component to render for each item, passed current item */
  itemComponent: PropTypes.element,

  /* height of an individual item */
  itemHeight: PropTypes.number,

  /* custom React component to render for each label, passed current item */
  labelComponent: PropTypes.element,

  labelKey: PropTypes.oneOfType([
    /* either the path of label in the item objects */
    PropTypes.string,

    /* or a function to resolve the label, passed the current item */
    PropTypes.function
  ]),

  /* title for the legend */
  title: PropTypes.string,

  /* custom React component to render for the title, passed props.title*/
  titleComponent: PropTypes.element,

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
  ]),

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

};

const defaultProps = {
  itemComponent: LegendItem,
  itemHeight: 23,
  titleComponent: LegendTitle
};

export default class Legend extends React.Component {

  renderTitle() {
    const { title, titleComponent } = this.props;
    if (!title) return null;
    return <titleComponent title={title} />;
  }

  renderItemList() {
    // easier to omit the props we don't need than to declare the ones we do
    const { items } = this.props;
    const itemProps = omit(this.props, ['items', 'title', 'titleComponent', 'className']);

    if (!isArray(items) || !items.length) return null;
    return items.map((item) => {
      return <itemComponent item={item} {...itemProps} />;
    });
  }

  render() {
    const {
      wrapperClassName,
      ulClassName
    } = this.props;

    return (
      <div className={classNames(styles.container, wrapperClassName)}>
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
