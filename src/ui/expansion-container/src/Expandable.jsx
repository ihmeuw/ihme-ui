import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import reduce from 'lodash/reduce';
import pick from 'lodash/pick';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { getBackgroundColor } from '../../../utils/window';

import { containerStore } from './ExpansionContainer';
import styles from './expansion-container.css';

const transitionTypes = {
  transition: 'transitionend',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  WebkitTransition: 'webkitTransitionEnd',
};

/* From Modernizr */
export const transitionEvent = (() => {
  const el = document.createElement('transitionEventTest');
  return reduce(transitionTypes, (acc, type, t) => {
    return acc || (el.style[t] !== undefined ? type : undefined);
  }, undefined);
})();

const LAYOUT_SELECTORS = [
  'alignContent',
  'alignItems',
  'display',
  'flexDirection',
  /* 'flexFlow', */ // causes firefox to fail flex layout
  'flexWrap',
  'justifyContent',
];

export default class Expandable extends PureComponent {
  constructor(props) {
    super(props);
    this._expansionContainer = containerStore[props.group];
    this._expansionContainer.subscribe(this);
    this.state = {
      expanded: false,
      expanding: false,
      hidden: false,
      restoring: false,
      restored: true,
      transitioning: false,
      outerStyle: props.style,
      iconStyle: {
        position: 'absolute',
        top: '0.2em',
        right: '0.2em',
        ...props.iconStyle,
      },
    };

    bindAll(this, [
      'onExpand',
      'onHide',
      'onRestore',
      'onResize',
      'onTransitionEnd',
      'expand',
      'hide',
      'restore',
      'containerRef',
      'setState',
      'innerRef',
    ]);
  }

  componentDidMount() {
    this.backgroundColor = getBackgroundColor(this._container);
    this.outerStyle = {
      ...this.props.style,
      display: undefined,
      flexFlow: undefined,
      justifyContent: undefined,
      alignItems: undefined,
      alignContent: undefined,
    };
    this.innerStyle = {
      ...this.props.expandableStyle,
      ...pick(this.containerStyle, LAYOUT_SELECTORS),
    };
    this.defaultState = {
      ...this.state,
      outerStyle: this.outerStyle,
      innerStyle: this.innerStyle,
    };
    setTimeout(this.setState, 0, this.defaultState);
  }

  componentWillUnmount() {
    this._expansionContainer.unsubscribe(this);
  }

  componentDidUpdate() {
    if (this.state.transitioning && !!this.state.innerStyle.transition) {
      // do nothing
    } else if (this.state.expanding) {
      if (this.state.expanded) {
        setTimeout(this.setState, 0, {
          expanding: false,
          transitioning: false,
        });
      }
    } else if (this.state.restoring) {
      if (!this.state.restored) {
        setTimeout(this.setState, 0, this.defaultState);
      }
    }
  }

  onExpand() {
    this.setState({
      expanded: false,
      expanding: true,
      hidden: false,
      restoring: false,
      restored: false,
      transitioning: false,
      innerStyle: this.calcInnerStyle(this.boundingClientRect),
    });
  }

  onHide() {
    this.setState({
      hidden: true,
    });
  }

  onRestore() {
    if (this.state.expanded) {
      this.setState({
        expanded: false,
        expanding: false,
        hidden: false,
        restored: false,
        restoring: true,
        transitioning: !!this.props.transition,
        innerStyle: {
          ...this.calcInnerStyle(this.boundingClientRect),
          transition: this.props.transition,
        },
      });
    } else {
      this.setState(this.defaultState);
    }
  }

  onResize(boundingClientRect) {
    const state = {
      innerStyle: {
        ...this.calcInnerStyle(boundingClientRect),
        transition: !this.state.expanded && this.props.transition,
      },
      expanded: this.state.expanded || !this.props.transition,
      expanding: !this.state.expanded && !!this.props.transition,
      transitioning: !this.state.expanded && !!this.props.transition,
    };
    setTimeout(this.setState, 0, state);
  }

  onTransitionEnd() {
    if (this.state.transitioning) {
      this.setState({
        expanded: !!this.state.expanding,
        expanding: false,
        transitioning: false,
      });
    }
  }

  calcInnerStyle({ left, top, width, height }) {
    return {
      ...this.innerStyle,
      backgroundColor: this.backgroundColor,
      left, top, width, height,
      right: undefined,
      bottom: undefined,
      position: 'fixed',
      zIndex: '1',
    };
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

  get containerStyle() {
    return window.getComputedStyle(this._container);
  }

  get parentStyle() {
    return window.getComputedStyle(this._container.parentNode);
  }

  containerRef(ref) {
    this._container = ref;
  }

  innerRef(ref) {
    if (ref) ref.addEventListener(transitionEvent, this.onTransitionEnd);
  }

  renderExpandIcon(hideIcon) {
    if (hideIcon) return null;
    const {
      iconClassName,
    } = this.props;
    const {
      expanded,
      expanding,
      iconStyle,
    } = this.state;

    return (
      <svg
        className={iconClassName}
        style={iconStyle}
        onClick={!!expanded ? this.restore : this.expand}
        viewBox="-16 -16 32 32"
        width="1em" height="1em"
      >
        <circle r="15" fill="none" stroke="black" />
        {(expanding || expanded) ? (
          <path d="M1,-10.6 L10.6,-1 L1,-1z M-10.6,1 L-1,10.6 L-1,1z" />
        ) : (
          <path d="M6.4,3.2 L-3.2,-6.4 L6.4,-6.4z M3.2,6.4 L-6.4,-3.2 L-6.4,6.4z" />
        )}
      </svg>
    );
  }

  render() {
    const {
      children,
      className,
      expandableClassName,
      hideIcon,
    } = this.props;
    const {
      innerStyle,
      outerStyle,
    } = this.state;

    return (
      <div
        ref={this.containerRef}
        className={classNames(styles.expandable, className)}
        style={outerStyle}
      >
        {!!innerStyle && (
          <div
            ref={this.innerRef}
            className={classNames(styles['expandable-parent'], expandableClassName)}
            style={innerStyle}
          >
               {children}
               {this.renderExpandIcon(hideIcon)}
          </div>
        )}
      </div>
    );
  }
}

Expandable.propTypes = {
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  expandableClassName: CommonPropTypes.className,
  expandableStyle: CommonPropTypes.style,
  iconClassName: CommonPropTypes.className,
  iconStyle: CommonPropTypes.style,
  children: PropTypes.node,
  group: PropTypes.string,
  hideIcon: PropTypes.bool,
  expanded: PropTypes.bool,
  transition: PropTypes.string,
};

Expandable.defaultProps = {
  group: 'default',
  iconStyle: {
    position: 'absolute',
    top: '0.2em',
    right: '0.2em',
  },
  // transition: 'all 0.5s ease',
};
