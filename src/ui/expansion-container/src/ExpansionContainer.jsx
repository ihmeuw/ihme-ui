import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import without from 'lodash/without';
import { CommonPropTypes } from '../../../utils';

export const ExpansionContainerContext = React.createContext({});

import styles from './expansion-container.css';

/**
 * `import { ExpansionContainer } from 'ihme-ui'`
 *
 */
export default class ExpansionContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.expandables = [];
    this.defaultState = this.state = {
      expanded: null,
      expanding: false,
      expandableTargetStyle: undefined,
      containerStyle: {
        position: 'relative',
        ...props.style,
      },
    };

    bindAll(this, [
      'subscribe',
      'unsubscribe',
      'expand',
      'hide',
      'restore',
      'containerRef',
    ]);
  }

  get boundingClientRect() {
    return this._container.getBoundingClientRect();
  }

  containerRef(ref) {
    this._container = ref;
  }

  subscribe(expandable) {
    if (!includes(this.expandables, expandable)) {
      this.expandables.push(expandable);
    }
  }

  unsubscribe(expandable) {
    pull(this.expandables, expandable);
    if (expandable === this.state.expanded) this.restore();
  }

  expand(expandable) {
    if (includes(this.expandables, expandable)) {
      this.setState({
        expanded: expandable,
        expanding: true,
      });

      forEach(without(this.expandables, expandable), (hideable) => {
        hideable.onHide();
      });

      expandable.onExpand();
    }
  }

  hide(expandable) {
    expandable.onHide();
  }

  restore() {
    this.setState(this.defaultState);

    forEach(this.expandables, (restorable) => {
      restorable.onRestore();
    });
  }

  render() {
    const {
      children,
      className,
    } = this.props;
    const {
      containerStyle,
      expanded,
    } = this.state;

    return (
      <ExpansionContainerContext.Provider value={this}>
      <div
        ref={this.containerRef}
        className={classNames(styles['expansion-container'], className)}
        style={containerStyle}
      >
        {children}
        {!!expanded && (
          <div className={styles['expandable-target']}>
            <AutoSizer>
              {({ width, height }) => {
                if (width && height && includes(this.expandables, expanded)) {
                  expanded.onResize(this.boundingClientRect);
                }
              }}
            </AutoSizer>
          </div>
        )}
      </div>
    </ExpansionContainerContext.Provider>
    );
  }
}

ExpansionContainer.propTypes = {
  /**
   * className applied to outermost wrapping div
   */
  className: CommonPropTypes.className,

  /**
   * inline styles applied to outermost wrapping div; `position: relative` is added automatically
   */
  style: CommonPropTypes.style,

  children: PropTypes.node,

};
