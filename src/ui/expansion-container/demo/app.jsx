import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { CommonPropTypes, PureComponent } from '../../../utils';

import Button from '../../button';
import ExpansionContainer, { Expandable } from '../';

const expansionContainerStyle = {
  flex: '1',
  border: '1px solid black',
  display: 'flex',
};

const chartStyle = {
  border: '1px solid green',
  display: 'flex',
  flex: '1',
};

const chartStyle2 = {
  border: '1px solid blue',
  display: 'flex',
  flex: '1',
};

class Chart extends PureComponent {
  render() {
    const { props } = this;
    return (
      <Expandable style={props.style}>
        Chart{props.chartNumber}
      </Expandable>
    );
  }
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
      <div style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column' }}>
        <AutoSizer>
          {({ width, height }) => {
            console.log(width, height);
            if (width && height) {
              return (
                <div style={{ width, height, display: 'flex', flexDirection: 'column' }}>
                  <h3>Title</h3>
                  <Button clickHandler={this.onClick} text="+" />
                  <ExpansionContainer
                    style={expansionContainerStyle}
                  >
                    <Chart chartNumber={this.state.clicks} style={chartStyle} />
                    <div
                      style={{
                        border: '1px solid green',
                        display: 'flex',
                        flex: '1',
                        flexDirection: 'column',
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      <Chart chartNumber={2} style={chartStyle2} />
                      <Chart chartNumber={3} style={chartStyle2} />
                    </div>
                  </ExpansionContainer>
                </div>
              );
            }
            return null;
          }}
        </AutoSizer>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
