import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { AutoSizer } from 'react-virtualized';
import { CommonPropTypes, PureComponent } from '../../../utils';

import Button from '../../button';
import ExpansionContainer, { Expandable } from '../';

const expansionContainerStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'row',
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
    const { props } = this;
    return (
      <Expandable
        style={props.style}
        expandableStyle={expandableStyle}
        iconClassName={props.iconClassName}
        onMouseLeave={this.props.onMouseLeave}
        onMouseMove={this.props.onMouseMove}
        onMouseOver={this.props.onMouseOver}
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
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,
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

  onMouseLeave() {
    console.log('leave');
  }

  onMouseMove() {
    console.log('move');
  }

  onMouseOver() {
    console.log('over');
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
                      style={{
                        flex: '1 1 auto',
                        overflow: 'scroll'
                      }}
                      onMouseLeave={this.onMouseLeave}
                      onMouseMove={this.onMouseMove}
                      onMouseOver={this.onMouseOver}
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
                        flex: '1 1 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      <Chart
                        chartNumber={this.state.clicks}
                        style={chartStyle}
                        onMouseOver={this.onMouseOver}
                        onMouseLeave={this.onMouseLeave}
                        onMouseMove={this.onMouseMove}
                      />
                      <Chart
                        chartNumber={1}
                        style={chartStyle}
                        onMouseOver={this.onMouseOver}
                        onMouseLeave={this.onMouseLeave}
                        onMouseMove={this.onMouseMove}
                      />
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
