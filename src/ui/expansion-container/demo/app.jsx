import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { CommonPropTypes } from '../../../utils';

import Button from '../../button';
import ExpansionContainer, { Expandable } from '../';

function Chart(props) {
  console.log('Chart.render()', props);
  return (
    <Expandable
      style={{
        border: '1px solid green',
        display: 'flex',
        flex: '1 0 auto',
        ...props.style,
      }}
    >
      Chart{props.chartNumber}
    </Expandable>
  );
}

Chart.propTypes = {
  children: CommonPropTypes.children,
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  chartNumber: PropTypes.any,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  render() {
    return (
      <div style={{ width: 800, height: 600, display: 'flex', flexDirection: 'column' }}>
        <h3>Title</h3>
        <Button clickHandler={this.onClick} text="+" />
        <ExpansionContainer
          style={{
            flex: '1 0 auto',
            border: '1px solid black',
            display: 'flex',
          }}
          backgroundColor="aliceblue"
        >
          <Chart chartNumber={this.state.clicks} />
          <div
            style={{
              border: '1px solid green',
              display: 'flex',
              flex: '1 0 auto',
              flexDirection: 'column',
            }}
          >
            <Expandable style={{ border: '1px solid blue', display: 'flex', flex: '1 0 auto' }}>
              Chart2
            </Expandable>
            <Expandable style={{ border: '1px solid blue', display: 'flex', flex: '1 0 auto' }}>
              Chart3
            </Expandable>
          </div>
        </ExpansionContainer>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
