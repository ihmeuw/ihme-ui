import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import without from 'lodash/without';
import { CommonPropTypes, PureComponent } from '../../../utils';

import styles from './expansion-container.css';

export const containerStore = {};

/**
 * `import { ExpansionContainer } from 'ihme-ui'`
 *
 */
export default class ExpansionContainer extends PureComponent {
  constructor(props) {
    super(props);
    containerStore[props.group] = this;
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

  componentWillUnmount() {
    containerStore[this.props.group] = null;
    delete containerStore[this.props.group];
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

  /**
   * key used by `<Expandable />`s to register with `<ExpansionContainer />`;
   * if more than one `<ExpansionContainer />` is mounted, `group` should be treated as required and unique per instance.
   */
  group: PropTypes.string,
};

ExpansionContainer.defaultProps = {
  group: 'default',
};
