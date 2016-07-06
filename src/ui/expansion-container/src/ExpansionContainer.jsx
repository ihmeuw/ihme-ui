import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import without from 'lodash/without';
import { CommonPropTypes, PureComponent } from '../../../utils';

import style from './expansion-container.css';

export const containerStore = {};

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
        ...this.props.style,
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

  update() {
    this.forceUpdate();
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className={classNames(style['expansion-container'], this.props.className)}
        style={this.state.containerStyle}
      >
        {this.props.children}
        {!!this.state.expanded && (
          <div className={style['expandable-target']}>
            <AutoSizer>
              {({ width, height }) => {
                if (width && height) {
                  this.state.expanded.onResize(this.boundingClientRect);
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
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  children: PropTypes.node,
  group: PropTypes.string,
};

ExpansionContainer.defaultProps = {
  group: 'default',
};
