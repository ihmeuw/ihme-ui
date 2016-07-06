import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import without from 'lodash/without';
import math from 'lodash/math';
import { CommonPropTypes, PureComponent, applyFuncToProps } from '../../../utils';

import Expandable from './Expandable';
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
        backgroundColor: this.props.backgroundColor,
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

  componentDidUpdate() {
    if (this.state.expanding) {
      this.setExpandingState({
        expanding: false,
        expandableParentStyle: {
          ...this.state.expandableParentStyle,
          left: 0, right: 0, top: 0, bottom: 0,
        },
      });
    }
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

  setExpandingState(state) {
    this.setState(state);
  }

  expand(expandable) {
    if (includes(this.expandables, expandable)) {
      const clientRectDiff = applyFuncToProps(this.boundingClientRect,
        expandable.boundingClientRect, ['left', 'right', 'top', 'bottom'], math.subtract, Math.abs);

      this.setState({
        expanded: expandable,
        expandableTargetStyle: {
          display: 'initial',
        },
        expandableParentStyle: {
          ...clientRectDiff,
          backgroundColor: expandable.backgroundColor,
        },
        expandableProps: {
          ...expandable.props,
          style: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
        },
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
        <div className={style['expandable-target']} style={this.state.expandableTargetStyle}>
          {this.state.expanded && (
            <div className={style['expandable-parent']} style={this.state.expandableParentStyle}>
              <Expandable {...this.state.expandableProps} expanded />
            </div>)}
        </div>
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
