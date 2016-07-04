import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { getBackgroundColor } from '../../../utils/window';

import { containerStore } from './ExpansionContainer';
import style from './expansion-container.css';

export default class Expandable extends PureComponent {
  constructor(props) {
    super(props);
    this._expansionContainer = containerStore[props.group];
    this._expansionContainer.subscribe(this);
    this.backgroundColor = undefined;
    this.state = {
      hidden: false,
      expanded: false,
    };

    bindAll(this, [
      'onExpand',
      'onHide',
      'onRestore',
      'expand',
      'hide',
      'restore',
      'containerRef',
    ]);
  }

  componentDidMount() {
    this.backgroundColor = getBackgroundColor(this._container);
  }

  componentWillUnmount() {
    this._expansionContainer.unsubscribe(this);
  }

  componentDidUpdate() {
    if (this.state.expanded) this._expansionContainer.update();
  }

  onExpand() {
    this.setState({
      hidden: false,
      expanded: true,
    });
  }

  onHide() {
    this.setState({
      hidden: true,
    });
  }

  onRestore() {
    this.setState({
      hidden: false,
      expanded: false,
    });
  }

  expand() {
    this._expansionContainer.expand(this);
  }

  hide() {
    this._expansionContainer.hide(this);
  }

  restore() {
    this._expansionContainer.restore(this);
  }

  get boundingClientRect() {
    return this._container.getBoundingClientRect();
  }

  get parentStyle() {
    return window.getComputedStyle(this._container.parentNode);
  }

  containerRef(ref) {
    this._container = ref;
  }

  renderExpandIcon(hideIcon) {
    if (hideIcon) return null;
    return (
      <div
        key="expandable"
        style={{ position: 'absolute', top: '0.2em', right: '0.2em' }}
        onClick={this.props.expanded ? this.restore : this.expand}
      >
        *
      </div>
    );
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className={classNames(style.expandable, this.props.className)}
        style={this.props.style}
      >
        {this.props.children}
        {this.renderExpandIcon(this.props.hideIcon)}
      </div>
    );
  }
}

Expandable.propTypes = {
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  expandableClassName: CommonPropTypes.className,
  expandableStyle: CommonPropTypes.style,
  children: PropTypes.node,
  group: PropTypes.string,
  hideIcon: PropTypes.bool,
  expanded: PropTypes.bool,
};

Expandable.defaultProps = {
  group: 'default',
};
