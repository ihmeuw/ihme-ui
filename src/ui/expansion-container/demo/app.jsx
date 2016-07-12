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
                    <Expandable
                      style={{ flex: '3' }}
                      expandableStyle={{ overflow: 'scroll' }}
                      iconClassName={styles.icon}
                    >
{/* <pre><code>
  <ExpansionContainer className="..." style={{ display: 'flex' }}>  // drop in replacement for <div>
    <Expandable className="..." style={{ flex: '1' }}>              // *mostly* drop in replacement for <div>
      This content...
    </Expandable>
    <div style={{ display: 'flex' flexDirection: 'column', flex: '1' }}>
      <Expandable className="..." style={{ flex: '1' }}>
        <h3>Chart 0</h3>
        <AxisChart ... />
      </Expandable>
      <Expandable className="..." style={{ flex: '1' }}>
        <H3>Chart 1</h3>
        <AxisChart ... />
      </Expandable>
    </div>
  </ExpansionContainer>

</code></pre> */}
                    </Expandable>
                    <div
                      style={{
                        display: 'flex',
                        flex: '2',
                        flexDirection: 'column',
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      <Chart chartNumber={this.state.clicks} style={chartStyle} />
                      <Chart chartNumber={1} style={chartStyle} />
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
