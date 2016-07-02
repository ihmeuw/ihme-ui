import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import pull from 'lodash/pull';
import without from 'lodash/without';
import { CommonPropTypes } from '../../../utils';

import style from './expansion-container.css';

export const containerStore = {};

export default class ExpansionContainer extends React.Component {
  constructor(props) {
    super(props);
    containerStore[props.group] = this;
    this.expandables = [];
    this.state = {
      expanded: null,
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

  componentWillReceiveProps(nextProps) {
    console.log('ExpansionContainer.cWRP()', nextProps);
  }

  componentWillUnmount() {
    console.log('ExpansionContainer.cWU()');
    delete containerStore[this.props.group];
  }

  get boundingClientRect() {
    return this._container.getBoundingClientRect();
  }

  containerRef(ref) {
    this._container = ref;
  }

  subscribe(expandable) {
    // console.log('ExpansionContainer.subscribe()', expandable);
    if (!includes(this.expandables, expandable)) {
      this.expandables.push(expandable);
    }
  }

  unsubscribe(expandable) {
    // console.log('ExpansionContainer.unsubscribe()', expandable);
    pull(this.expandables, expandable);
  }

  expand(expandable) {
    if (includes(this.expandables, expandable)) {
      this.setState({ expanded: expandable });
      forEach(without(this.expandables, expandable), (hideable) => {
        hideable.onHide();
      });
      expandable.onExpand();
    }
  }

  hide(expandable) {
    // console.log('ExpansionContainer.hide()');
    expandable.onHide();
  }

  restore() {
    this.setState({ expanded: null });
    forEach(this.expandables, (restorable) => {
      restorable.onRestore();
    });
  }

  render() {
    // console.log('ExpansionContainer.render()');
    return (
      <div
        ref={this.containerRef}
        className={classNames(style['expansion-container'], this.props.className)}
        style={{
          position: 'relative',
          backgroundColor:
          this.props.backgroundColor,
          ...this.props.style,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

ExpansionContainer.propTypes = {
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  children: PropTypes.node,
  group: PropTypes.string,
  backgroundColor: PropTypes.string,
};

ExpansionContainer.defaultProps = {
  group: 'default',
};
