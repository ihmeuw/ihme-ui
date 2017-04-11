import React from 'react';
import { render } from 'react-dom';
import { scaleOrdinal, csvParse } from 'd3';
import { bindAll } from 'lodash';

import ResponsiveContainer from '../../responsive-container';
import HtmlLabel from '../../html-label';
import Tooltip from '../../tooltip';

import Group, { Option } from '../../group';
import AsterChart from '../';

const inputData = [
  csvParse('id,upper,order,score,color,label,lower\nFIS,62,1.1,51,#9E0041,Fisheries,50\nMAR,40,1.3,24,#C32F4B,Mariculture,20\nAO,100,2,98,#E1514B,Artisanal Fishing,96\nNP,66,3,60,#F47245,Natural Products,56\nCS,80,4,74,#FB9F59,Carbon Storage,70\nCP,71,5,70,#FEC574,Coastal Protection,68\nTR,49,6,42,#FAE38C,Tourism & Recreation,39\nLIV,90,7.1,77,#EAF195,Livelihoods,60\nECO,90,7.3,88,#C7E89E,Economies,80\nICO,70,8.1,60,#9CD6A4,Iconic Species,55\nLSP,88,8.3,65,#6CC4A4,Lasting Special Places,55\nCW,88,9,71,#4D9DB4,Clean Waters,55\nHAB,91,10.1,88,#4776B4,Habitats,70\nSPP,90,10.3,83,#5E4EA1,Species,80'), // eslint-disable-line
  csvParse('id,upper,order,score,color,label,lower\nFIS,96,1.1,72,#9E0041,Fisheries,70\nMAR,40,1.3,34.5,#C32F4B,Mariculture,20\nAO,44,2,11,#E1514B,Artisanal Fishing,1\nNP,34,3,20,#F47245,Natural Products,10\nCS,5,4,1,#FB9F59,Carbon Storage,.5\nCP,100,5,99,#FEC574,Coastal Protection,68\nTR,100,6,100,#FAE38C,Tourism & Recreation,39\nLIV,33,7.1,22,#EAF195,Livelihoods,18\nECO,23,7.3,22,#C7E89E,Economies,18\nICO,70,8.1,63,#9CD6A4,Iconic Species,55\nLSP,88,8.3,77,#6CC4A4,Lasting Special Places,55\nCW,52,9,40,#4D9DB4,Clean Waters,36\nHAB,66,10.1,50,#4776B4,Habitats,40\nSPP,20,10.3,12,#5E4EA1,Species,8')  // eslint-disable-line
];

const labels = [
  'Fisheries',
  'Mariculture',
  'Artisanal Fishing',
  'Natural Products',
  'Carbon Storage',
  'Coastal Protection',
  'Tourism & Recreation',
  'Livelihoods',
  'Economies',
  'Iconic Species',
  'Lasting Special Places',
  'Clean Waters',
  'Habitats',
  'Species'
];

const colors = [
  '#9E0041',
  '#C32F4B',
  '#E1514B',
  '#F47245',
  '#FB9F59',
  '#FEC574',
  '#FAE38C',
  '#EAF195',
  '#C7E89E',
  '#9CD6A4',
  '#6CC4A4',
  '#4D9DB4',
  '#4776B4',
  '#5E4EA1'
];
const colorScale = scaleOrdinal(colors).domain(labels);

class App extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onMouseOver',
      'onMouseMove',
      'onMouseLeave',
      'onArcClick',
      'onScoreClick',
      'toggleDataSet',
      'toggleLabelProp',
      'toggleScoreLabels',
      'toggleUncertainty',
    ]);

    this.state = props;
  }

  onMouseOver(_, datum) {
    this.setState({
      showTooltip: true,
      hoverData: datum.data,
    });
  }

  onMouseMove(evt) {
    const { clientX, clientY } = evt;
    this.setState({
      clientX,
      clientY,
    });
  }

  onMouseLeave() {
    this.setState({
      showTooltip: false,
    });
  }

  onArcClick(e, datum) {
    this.setState({ selectedArcs: [datum.data.id] });
  }

  onScoreClick(e, scoreProps) {
    const { label, score } = this.state.hoverData;
    alert(`AVERAGE: ${scoreProps.content.average}\n${label}: ${score}`); // eslint-disable-line
  }

  toggleDataSet(_, selectedOptionValue) {
    this.setState({ dataIndex: selectedOptionValue });
  }

  toggleLabelProp(_, selectedOptionValue) {
    this.setState({
      accessorFields: {
        ...this.state.accessorFields,
        labels: {
          ...this.state.accessorFields.labels,
          inner: selectedOptionValue ? App.defaultProps.accessorFields.labels.inner : null,
        },
      }
    });
  }

  toggleScoreLabels(_, selectedOptionValue) {
    this.setState({
      accessorFields: {
        ...this.state.accessorFields,
        labels: {
          ...this.state.accessorFields.labels,
          outer: selectedOptionValue ? App.defaultProps.accessorFields.labels.outer : null,
        },
      }
    });
  }

  toggleUncertainty(_, selectedOptionValue) {
    this.setState({
      accessorFields: {
        ...this.state.accessorFields,
        uncertainty: selectedOptionValue ? App.defaultProps.accessorFields.uncertainty : null,
      }
    });
  }

  render() {
    return (
      <div className="app-container">
        <div className="aster-code">
          <section>
            {/* <pre><code>
             <AsterChart
               accessorFields={this.state.accessorFields}
               colorScale={colorScale}
               data={inputData[this.state.dataIndex]}
               domain={[0, 100]}
               onMouseOver={this.onMouseOver}
               onMouseMove={this.onMouseMove}
               onMouseLeave={this.onMouseLeave}
               onArcClick={this.onArcClick}
               onScoreClick={this.onScoreClick}
               selectedArcs={this.state.selectedArcs}
               ticks={5}
             />
             </code></pre> */}
          </section>
        </div>
        <div style={{ display: 'flex', flex: '1 0 auto', flexDirection: 'column' }}>
          <div
            style={{ display: 'flex', flex: '0 0 auto', justifyContent: 'center' }}
            className="controls"
          >
            <div className="button-set">
              <HtmlLabel text="Data set">
                <Group onClick={this.toggleDataSet}>
                  <Option
                    text="1"
                    value={0}
                    selected={this.state.dataIndex === 0}
                  />
                  <Option
                    text="2"
                    value={1}
                    selected={this.state.dataIndex === 1}
                  />
                </Group>
              </HtmlLabel>
            </div>

            <div className="button-set">
              <HtmlLabel text="Uncertainty">
                <Group onClick={this.toggleUncertainty}>
                  <Option
                    text="On"
                    value={1}
                    selected={!!this.state.accessorFields.uncertainty}
                  />
                  <Option
                    text="Off"
                    value={0}
                    selected={!this.state.accessorFields.uncertainty}
                  />
                </Group>
              </HtmlLabel>
            </div>

            <div className="button-set">
              <HtmlLabel text="Labels">
                <Group onClick={this.toggleLabelProp}>
                  <Option
                    text="On"
                    value={1}
                    selected={!!this.state.accessorFields.labels.inner}
                  />
                  <Option
                    text="Off"
                    value={0}
                    selected={!this.state.accessorFields.labels.inner}
                  />
                </Group>
              </HtmlLabel>
            </div>

            <div className="button-set">
              <HtmlLabel text="Toggle outer score labels">
                <Group onClick={this.toggleScoreLabels}>
                  <Option
                    text="On"
                    value={1}
                    selected={!!this.state.accessorFields.labels.outer}
                  />
                  <Option
                    text="Off"
                    value={0}
                    selected={!this.state.accessorFields.labels.outer}
                  />
                </Group>
              </HtmlLabel>
            </div>
          </div>

          <div style={{ display: 'flex', flex: '1 0 auto' }}>
            <div style={{ display: 'flex', flex: '1 0 auto' }}>
              <ResponsiveContainer>
                <AsterChart
                  accessorFields={this.state.accessorFields}
                  colorScale={colorScale}
                  data={inputData[this.state.dataIndex]}
                  domain={[0, 100]}
                  onMouseOver={this.onMouseOver}
                  onMouseMove={this.onMouseMove}
                  onMouseLeave={this.onMouseLeave}
                  onArcClick={this.onArcClick}
                  onScoreClick={this.onScoreClick}
                  selectedArcs={this.state.selectedArcs}
                  ticks={5}
                />
              </ResponsiveContainer>
            </div>
          </div>
          {
            this.state.hoverData ? (
              <Tooltip
                mouseX={this.state.clientX}
                mouseY={this.state.clientY}
                offsetY={10}
                show={this.state.showTooltip}
                className="tooltip"
                style={{ borderColor: this.state.hoverData.color }}
              >
                <div>
                  <h4
                    fontWeight="bold"
                    style={{ borderBottom: '1px solid black' }}
                  >
                    {this.state.hoverData.label}
                  </h4>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>score:</span>
                    {` ${this.state.hoverData.score}` }
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>uncertainty:</span>
                    {` ${this.state.hoverData.lower} - ${this.state.hoverData.upper}`}
                  </p>
                </div>
              </Tooltip>
            ) : null
          }
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  accessorFields: {
    labels: { outer: 'score', inner: 'label' },
    uncertainty: { lower: 'lower', upper: 'upper' },
    value: 'score',
  },
  clientX: 0,
  clientY: 0,
  dataIndex: 0,
  selectedArcs: [],
  showTooltip: false,
};

render(<App />, document.getElementById('app'));
