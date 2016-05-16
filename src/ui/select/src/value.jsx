import React, { PropTypes } from 'react';
import { bindAll } from 'lodash';

const propTypes = {
  children: PropTypes.node,

  /* disabled prop passed to ReactSelect */
  disabled: PropTypes.bool,

  /* method to handle click on value label */
  onClick: PropTypes.func,

  /* method to handle removal of the value */
  onRemove: PropTypes.func,

  /* the option object for this value */
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};

export default class Value extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onRemove',
      'handleMouseDown',
      'handleTouchEndRemove',
      'handleTouchMove',
      'handleTouchStart'
    ]);
  }

  onRemove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemove(this.props.value, event);
  }

  handleMouseDown(event) {
    if (event.type === 'mousedown' && event.button !== 0) return;

    if (this.props.onClick) {
      event.stopPropagation();
      this.props.onClick(this.props.value, event);
      return;
    }
  }

  handleTouchEndRemove(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;

    // Fire the mouse events
    this.onRemove(event);
  }

  handleTouchMove() {
    // Set a flag that the view is being dragged
    this.dragging = true;
  }

  handleTouchStart() {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  }

  renderLabel() {
    return (
      <span style={{ marginRight: '7px' }}>
				{this.props.children}
			</span>
    );
  }

  renderCount() {
    return (
      <span>
        ({this.props.value.length})
      </span>
    );
  }

  render() {
    return (
      <div className="Select-value">
        {this.renderLabel()}
        {this.renderCount()}
      </div>
    );
  }
}

Value.propTypes = propTypes;
