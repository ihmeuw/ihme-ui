import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { CommonPropTypes, PureComponent } from '../../../utils';

import Button from '../../button';
import ExpansionContainer, { Expandable } from '../';
import styles from '../src/expansion-container.css';

const expansionContainerStyle = {
  flex: '1',
  display: 'flex',
};

const chartStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
};

const expandableStyle = {
  border: '1px solid',
  margin: '4px',
};

class Chart extends PureComponent {
  render() {
    // log={props.chartNumber === 3}
    const { props } = this;
    return (
      <Expandable
        style={props.style}
        expandableStyle={expandableStyle}
        iconClassName={props.iconClassName}
      >
        Chart{props.chartNumber}
        <div
          style={{
            flex: '1',
            border: 'solid',
            borderWidth: '0 0 3px 3px',
            margin: '1em',
          }}
        ></div>
      </Expandable>
    );
  }
}

Chart.propTypes = {
  children: CommonPropTypes.children,
  className: CommonPropTypes.className,
  style: CommonPropTypes.style,
  iconClassName: CommonPropTypes.className,
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
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1' }}>
        <AutoSizer>
          {({ width, height }) => {
            if (width && height) {
              return (
                <div style={{ width, height, display: 'flex', flexDirection: 'column' }}>
                  <h3>Title</h3>
                  <Button clickHandler={this.onClick} text="+" />
                  <ExpansionContainer
                    style={expansionContainerStyle}
                  >
                    <Chart
                      chartNumber={this.state.clicks}
                      style={chartStyle}
                      iconClassName={styles.icon}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flex: '1',
                        flexDirection: 'column',
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      <Chart chartNumber={2} style={chartStyle} />
                      <Chart chartNumber={3} style={chartStyle} />
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
