import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import pick from 'lodash/pick';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { getBackgroundColor } from '../../../utils/window';

import { containerStore } from './ExpansionContainer';
import styles from './expansion-container.css';

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
 * `import { Expandable } from 'ihme-ui/ui/expansion-container'`
 *
 *
 * `<Expandable />` is a *mostly* drop in replacement for a layout `<div />` that gives its contents
 * expanding powers, and must accompany an `<ExpansionContainer />` of the same `group` (default
 * group is 'default'). Flex related layout styles are passed directly to a content `<div />`, and
 * additional styles like `border`, `margin`, etc. must be supplied via the `expandableClassName`
 * and `expandableStyle` props.
 *
 * Note: Transitions on the restore event do not execute on Firefox, and thus have been disabled.
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
    ]);
  }

  componentDidMount() {
    // The container styles are calculated on component mount and content render is delayed.
    // In order to allow the react render cycle to settle, the styles are set to state using
    // a setTimeout.
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
      innerStyle: {},
      contentStyle: {
        paddingRight: this.props.iconSize,
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
      if (this.state.expanding) {
        this.setState({
          expanded: true,
          expanding: false,
          transitioning: false,
        });
      } else if (this.state.restoring) {
        this.setState(this.defaultState);
      }
    }
  }

  calcInnerStyle({ left, top, width, height }) {
    return {
      ...this.defaultState.innerStyle,
      backgroundColor: this.backgroundColor,
      left,
      top,
      width,
      height,
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

  wrappedEvent(fn) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (fn) fn();
    };
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

  renderExpandIcon(hideIcon) {
    if (hideIcon) return null;
    const {
      iconClassName,
      iconSize,
      iconStyle,
    } = this.props;
    const {
      expanded,
      restored,
      restoring,
    } = this.state;

    return (
      <svg
        className={classNames(styles['icon-container'], iconClassName)}
        style={{ fontSize: iconSize, ...iconStyle }}
        onClick={this.wrappedEvent((expanded && this.restore) || (restored && this.expand))}
        viewBox="-16 -16 32 32"
        width="1em" height="1em"
      >
        <circle
          r="15"
          className={styles.icon}
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
            className={styles['expandable-inner']}
            style={innerStyle}
            onTransitionEnd={this.onTransitionEnd}
          >
            <div
              className={classNames(styles['expandable-content'], expandableClassName)}
              style={contentStyle}
            >
              {children}
            </div>
            {this.renderExpandIcon(hideIcon)}
          </div>
        )}
      </div>
    );
  }
}

Expandable.propTypes = {
  /**
   * className applied to outermost containing div
   */
  className: CommonPropTypes.className,

  /**
   * inline styles applied to outermost containing div
   */
  style: CommonPropTypes.style,

  /**
   * className applied to div directly wrapping component to expand
   */
  expandableClassName: CommonPropTypes.className,

  /**
   * inline styles applied to div directly wrapping component to expand
   */
  expandableStyle: CommonPropTypes.style,

  /**
   * className applied to "expand/contract" icon
   */
  iconClassName: CommonPropTypes.className,

  /**
   * inline styles applied to "expand/contract" icon
   */
  iconStyle: CommonPropTypes.style,

  /**
   * size of icon in px; applied to contentStyle as paddingRight and iconStyle as fontSize
   */
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  children: PropTypes.node,

  /**
   * key used by `<Expandable />`s to register with `<ExpansionContainer />`;
   * if more than one `<ExpansionContainer />` is mounted, `group` should be treated as required
   * and unique per instance.
   */
  group: PropTypes.string,

  /**
   * do not render "expand/contract" icon
   */
  hideIcon: PropTypes.bool,

  /**
   * CSS transition to apply to `<Expandable />` when transitioning in height/width
   */
  transition: PropTypes.string,
};

Expandable.defaultProps = {
  group: 'default',
  iconSize: '20px',
  transition: 'all 0.5s ease',
};
