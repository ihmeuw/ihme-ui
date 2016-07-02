import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import { CommonPropTypes } from '../../../utils';

import { containerStore } from './ExpansionContainer';
// import style from './expansion-container.css';

// const TRANSPARENT_BACKGROUND = /rgba(\d+, \d+, \d+, 0)/;

export default class Expandable extends React.Component {
  constructor(props) {
    super(props);
    this._expansionContainer = containerStore[props.group];
    this._expansionContainer.subscribe(this);
    this.state = {
      hidden: false,
      expanded: false,
      nextStyle: undefined,
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
    const nextStyle = {
      transform: `translate(${containerLeft - left}px, ${containerTop - top}px)`,
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      zIndex: '1',
      // transition: 'all 0.3s ease',
    };
    this.setState({
      expanded: true,
      nextStyle,
    });
  }

  onHide() {
    this.setState({ hidden: true });
  }

  onRestore() {
    this.setState({
      expanded: false,
      nextStyle: undefined,
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
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            ...this.state.nextStyle,
          }}
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
  children: PropTypes.node,
  group: PropTypes.string,
  hideIcon: PropTypes.bool,
  expanded: PropTypes.bool,
};

Expandable.defaultProps = {
  group: 'default',
};
