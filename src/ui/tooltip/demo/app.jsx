import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';

import { Shape } from '../../shape';
import Tooltip from '../';

import styles from './style.css';

function Dot({ datum, idx, left, onMouseOver, onMouseMove, onMouseLeave, top }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
      }}
    >
      <svg>
        <Shape
          datum={datum}
          onMouseOver={onMouseOver}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          size={1000}
          translateX={25}
          translateY={25}
        />
      </svg>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      clientX: 0,
      clientY: 0,
      dotPosition: { left: null, top: null },
      dotData: [
        { left: 0, top: 0 },
        { left: 500, top: 300 },
        { left: 300, top: 600 },
        { left: 1000, top: 0 },
      ],
    }

    bindAll(this, [
      'onMouseOver',
      'onMouseMove',
      'onMouseLeave',
      'renderDots',
    ]);
  }

  onMouseOver() {
    this.setState({
      showTooltip: true,
    })
  }

  onMouseMove(evt, datum) {
    const { clientX, clientY } = evt;
    this.setState({
      clientX,
      clientY,
      dotPosition: datum,
    });
  }

  onMouseLeave() {
    this.setState({
      showTooltip: false,
    });
  }

  renderDots() {
    return this.state.dotData.map((position, idx) => {
      return (
        <Dot
          datum={position}
          idx={idx}
          key={idx}
          left={position.left}
          onMouseOver={this.onMouseOver}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          top={position.top}
        />
      );
    });
  }

  render() {
    const { showTooltip, clientX, clientY, dotPosition } = this.state;
    return (
      <div>
        <section>
          <h3>Tooltip</h3>
{/* <pre><code>
 <Tooltip
   mouseX={this.state.clientX}
   mouseY={this.state.clientY}
   offsetY={10}
   show={this.state.showTooltip}
 >
 <div>
   <h4>This dot is positioned</h4>
   <p>
    <span>{this.state.dotPosition.left}</span> pixels left of the origin
   </p>
   <p>
    <span>{this.state.dotPosition.top}</span> pixels below the origin
   </p>
 </div>
 </Tooltip>
 </code></pre> */}
        <p>(hover over dots to see tooltip in action)</p>
        </section>
        {this.renderDots()}
        <Tooltip
          mouseX={clientX}
          mouseY={clientY}
          offsetY={10}
          show={showTooltip}
        >
          <div className={styles.wrapper}>
            <h4 className={styles.header}>This dot is positioned</h4>
            <p className={styles.row}>
              <span className={styles.bold}>{dotPosition.left}</span> pixels left of the origin
            </p>
            <p className={styles.row}>
              <span className={styles.bold}>{dotPosition.top}</span> pixels below the origin
            </p>
          </div>
        </Tooltip>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
