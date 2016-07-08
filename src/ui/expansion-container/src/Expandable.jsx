import React, { PropTypes } from 'react';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';
import pick from 'lodash/pick';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { getBackgroundColor } from '../../../utils/window';

import { containerStore } from './ExpansionContainer';
import styles from './expansion-container.css';

const LAYOUT_SELECTORS = ['display', 'flexFlow', 'justifyContent', 'alignItems', 'alignContent'];

export default class Expandable extends PureComponent {
  constructor(props) {
    super(props);
    this._expansionContainer = containerStore[props.group];
    this._expansionContainer.subscribe(this);
    this.state = {
      hidden: false,
      expanded: false,
      expanding: false,
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
      'expand',
      'hide',
      'restore',
      'containerRef',
      'setState',
    ]);
  }

  componentDidMount() {
    this.backgroundColor = getBackgroundColor(this._container);
    this.outerStyle = {
      ...this.props.style,
      display: 'initial',
      flexFlow: 'initial',
      justifyContent: 'initial',
      alignItems: 'initial',
      alignContent: 'initial',
    };
    this.innerStyle = {
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
    if (this.state.expanding) setTimeout(this.setState, 0, { expanding: false });
  }

  onExpand() {
    const { left, top, width, height } = this.boundingClientRect;

    this.setState({
      hidden: false,
      expanded: true,
      expanding: true,
      innerStyle: {
        ...this.state.innerStyle,
        position: 'fixed',
        left, top, width, height,
        zIndex: '1',
        backgroundColor: this.backgroundColor,
      },
    });
  }

  onHide() {
    this.setState({
      hidden: true,
    });
  }

  onRestore() {
    this.setState(this.defaultState);
  }

  onResize({ left, top, width, height }) {
    setTimeout(this.setState, 0, {
      innerStyle: {
        ...this.state.innerStyle,
        transition: this.state.expanding ? 'all 1s ease' : 'initial',
        left, top, width, height,
      },
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

  get containerStyle() {
    return window.getComputedStyle(this._container);
  }

  get parentStyle() {
    return window.getComputedStyle(this._container.parentNode);
  }

  containerRef(ref) {
    this._container = ref;
  }

  renderExpandIcon(hideIcon) {
    if (hideIcon) return null;
    const {
      iconClassName,
    } = this.props;
    const {
      expanded,
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
        {!!expanded ? (
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
            className={styles['expandable-parent']}
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
};

Expandable.defaultProps = {
  group: 'default',
};
