import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import reduce from 'lodash/reduce';
import pick from 'lodash/pick';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { getBackgroundColor } from '../../../utils/window';

import { containerStore } from './ExpansionContainer';
import styles from './expansion-container.css';

/* Adapted from Modernizr via stackoverflow */
const transitionTypes = {
  transition: 'transitionend',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd',
  WebkitTransition: 'webkitTransitionEnd',
};

export const transitionEvent = (() => {
  const el = document.createElement('transitionEventTest');
  return reduce(transitionTypes, (acc, type, t) => {
    return acc || (el.style[t] !== undefined ? type : undefined);
  }, undefined);
})();

/* Adapted from is.js */
const userAgent = (navigator && navigator.userAgent || '').toLowerCase();

function isFirefox() {
  const match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
  return !!match;
}

const LAYOUT_STYLES = [
  'alignContent',
  'alignItems',
  'display',
  'flexDirection',
  'flexWrap',
  'justifyContent',
];

/**
 * <Expandable /> is a *mostly* drop in replacement for a layout <div /> that gives its contents
 * expanding powers, and must accompany an <ExpansionContainer /> of the same `group` (default
 * group is 'default'). Flex related layout styles are passed directly to a content <div />, and
 * additional styles like `border`, `margin`, etc. must be supplied via the `expandableClassName`
 * and `expandableStyle` props.
 *
 * Note: Transitions on the restore event do not execute on FireFox, and thus have been disabled.
 */
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
      containerStyle: props.style,
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
    this.defaultState = {
      ...this.state,
      containerStyle: {
        ...this.props.style,
        alignContent: undefined,
        alignItems: undefined,
        display: undefined,
        flexDirection: undefined,
        flexFlow: undefined,
        flexWrap: undefined,
        justifyContent: undefined,
      },
      innerStyle: {
      },
      contentStyle: {
        ...this.props.expandableStyle,
        ...pick(this.containerStyle, LAYOUT_STYLES),
      },
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
        transitioning: (!isFirefox() && !!this.props.transition),
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
        transition: !this.state.expanded && (!isFirefox() && this.props.transition),
      },
      expanded: this.state.expanded || (isFirefox() || !this.props.transition),
      expanding: !this.state.expanded && (!isFirefox() && !!this.props.transition),
      transitioning: !this.state.expanded && (!isFirefox() && !!this.props.transition),
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
      ...this.defaultState.innerStyle,
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
      iconStyle,
      restoring,
    } = this.state;

    return (
      <svg
        className={iconClassName}
        style={iconStyle}
        onClick={!!expanded ? this.restore : this.expand}
        viewBox="-16 -16 32 32"
        width="1em" height="1em"
      >
        <circle
          r="15"
          style={{
            fill: 'rgb(51, 199, 72)',
            stroke: '1.5px solid rgba(0, 255, 0, 0.5)',
          }}
        />
        <g
          style={{
            transition: 'transform 0.5s ease',
            opacity: '0.75',
          }}
        >
          <path
            d="M6.4,3.2 L-3.2,-6.4 L6.4,-6.4z"
            style={{
              fontSize: 'initial',
              transform: `${!!(restoring || expanded) ? 'translate(-0.5em, 0.5em)' : 'initial'}`,
              transition: 'inherit',
            }}
          />
          <path
            d="M3.2,6.4 L-6.4,-3.2 L-6.4,6.4z"
            style={{
              fontSize: 'initial',
              transform: `${!!(restoring || expanded) ? 'translate(0.5em, -0.5em)' : 'initial'}`,
              transition: 'inherit',
            }}
          />
        </g>
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
      containerStyle,
      contentStyle,
      innerStyle,
    } = this.state;

    return (
      <div
        ref={this.containerRef}
        className={classNames(styles['expandable-container'], className)}
        style={containerStyle}
      >
        {!!contentStyle && (
          <div
            ref={this.innerRef}
            className={styles['expandable-inner']}
            style={innerStyle}
          >
            <div
              className={classNames(styles['expandable-content'], expandableClassName)}
              style={contentStyle}
            >
              {children}
              {this.renderExpandIcon(hideIcon)}
            </div>
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
  transition: 'all 0.5s ease',
};
