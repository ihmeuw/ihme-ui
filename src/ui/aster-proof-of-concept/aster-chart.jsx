import React from 'react';
import { arc, pie } from 'd3';
import { CommonPropTypes, getScale, getScaleTypes, propsChanged } from '../src/utils';

import AsterTickCircles from './src/aster-tick-circles';
import AsterArcs from './src/aster-arcs';
import AsterWhiskers from './src/aster-whiskers';
import AsterLabels from './src/aster-labels';
import AsterScore from './src/aster-score';

export default class AsterChart extends React.Component {
  constructor(props) {
    super(props);
    const chartDimensions = this.calcChartDimensions(props.width, props.height, props.padding);
    const { innerRadius, radius } = this.getRadiusFromDimensions(chartDimensions);

    this.state = {
      ...props,
      average: this.getAverageFromInputData(),
      chartDimensions,
      data: this.asterDataFunction()(props.inputData),
      innerRadius,
      radius,
      transformTranslate: {
        transform: `translate(${chartDimensions.width / 2}px, ${chartDimensions.height / 2}px)`
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { width, height, padding, inputData } = nextProps;
    const chartDimensions = this.calcChartDimensions(width, height, padding);
    const { innerRadius, radius } = this.getRadiusFromDimensions(chartDimensions);

    this.setState({
      ...nextProps,
      average: this.getAverageFromInputData(),
      chartDimensions,
      data: this.asterDataFunction()(inputData),
      innerRadius,
      radius,
      transformTranslate: {
        transform: `translate(${chartDimensions.width / 2}px, ${chartDimensions.height / 2}px)`
      },
    });
  }

  getAverageFromInputData() {
    const { inputData, valueProp } = this.props;

    return inputData.reduce((a, b) => a + +b[valueProp], 0) / inputData.length;
  }

  getRadiusFromDimensions({width, height}) {
    const radius = Math.min(width, height) / 2;
    const innerRadius = this.props.centerRadiusRatio * radius;

    return { innerRadius, radius, };
  }

  asterDataFunction() {
    return pie().sort((a, b) => a.order - b.order).value(() => 1);
  }

  arcValueFunction() {
    const { domain, innerRadius, radius } = this.state;
    return arc()
      .innerRadius(innerRadius)
      .outerRadius((d) => (radius - innerRadius) * (d.data.score / domain[1]) + innerRadius);
  }

  outlineFunction() {
    const { innerRadius, radius } = this.state;

    return arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);
  }

  calcChartDimensions(width, height, padding) {
    return {
      width: width - (padding.left + padding.right),
      height: height - (padding.top + padding.bottom),
    };
  }

  render() {
    const {
      average,
      bottomText,
      chartDimensions,
      colorScale,
      data,
      domain,
      innerRadius,
      inputData,
      labelProp,
      pieFunction,
      radius,
      ticks,
      topText,
      transformTranslate,
      valueProp,
    } = this.state;

    return (
      <svg
        width={chartDimensions.width}
        height={chartDimensions.height}
      >
        <g style={transformTranslate} className="aster-chart-group">
          <AsterTickCircles
            domain={domain}
            innerRadius={innerRadius}
            radius={radius}
            ticks={ticks}
          >
            <AsterArcs
              arc={{
                arcValueFunction: this.arcValueFunction(),
                outlineFunction: this.outlineFunction(),
              }}
              color={{colorProp: 'label', colorScale}}
              data={data}
            />
            <AsterWhiskers
              data={data}
              domainEnd={domain[1]}
              innerRadius={innerRadius}
              radius={radius}
            />
            <AsterLabels
              data={data}
              outlineFunction={this.outlineFunction()}
              labelProp={labelProp}
              scoreProp={valueProp}
              radius={radius}
            />
            <AsterScore
              content={{
                average,
                bottomText,
                topText,
              }}
              radius={radius}
            />
          </AsterTickCircles>
        </g>
      </svg>
    );
  }
}

AsterChart.defaultProps = {
  centerRadiusRatio: 0.3,
  ticks: 5,
  padding: {
    top: 30,
    right: 10,
    bottom: 10,
    left: 30,
  },
  labelProp: 'label',
  valueProp: 'score',
  bottomText: '',
  topText: ''
};
