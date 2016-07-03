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
      'setDefaultState',
    ]);
  }

  setDefaultState() {
    this.setState(this.defaultState);
  }

  componentDidMount() {
    // console.log('oS', window.getComputedStyle(this._container.parentNode));
    const { display, flexDirection } = window.getComputedStyle(this._container.parentNode);

    this.defaultStyle = {
      ...this.props.expandableStyle,
      display,
      flexDirection,
      backgroundColor: getBackgroundColor(this._container),
    };
    this.defaultState = {
      hidden: false,
      expanded: false,
      expandableStyle: this.defaultStyle,
    };
    this.setDefaultState();
  }

  componentWillUnmount() {
    this._expansionContainer.unsubscribe(this);
  }

  onExpand() {
    const {
      left: containerLeft,
      top: containerTop,
      width: containerWidth,
      height: containerHeight,
    } = this._expansionContainer.boundingClientRect;
    const {
      left: left,
      top: top,
    } = this.boundingClientRect;

    const expandableStyle = {
      ...this.defaultStyle,
      transform: `translate(${containerLeft - left}px, ${containerTop - top}px)`,
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      zIndex: '1',
    };

    this.setState({
      hidden: false,
      expanded: true,
      expandableStyle,
    });
  }

  onHide() {
    this.setState({
      hidden: true,
      expandableStyle: {
        ...this.defaultStyle,
        visibility: 'hidden',
      },
    });
  }

  onRestore() {
    this.setState(this.defaultState);
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

  containerRef(ref) {
    this._container = ref;
  }

  renderExpandIcon(hideIcon) {
    if (hideIcon) return null;
    return (
      <div
        key="expandable"
        style={{ position: 'absolute', top: '0.2em', right: '0.2em' }}
        onClick={this.state.expanded ? this.restore : this.expand}
      >
        *
      </div>
    );
  }

  render() {
    // console.log('Expandable.render()', this.state);
    return (
      <div
        className={classNames(this.props.className)}
        style={{ position: 'relative', ...this.props.style }}
      >
        <div
          ref={this.containerRef}
          className={classNames(style.expandable, this.props.expandableClassName)}
          style={this.state.expandableStyle}
        >
          {this.props.children}
          {this.renderExpandIcon(this.props.hideIcon)}
        </div>
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
