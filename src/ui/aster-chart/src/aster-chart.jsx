import React from 'react';
import { arc, pie } from 'd3';
import { assign, includes, isEqual, map, noop, reduce } from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {
  stateFromPropUpdates
} from '../../../utils';

import AsterTickCircles from './aster-tick-circles';
import AsterArc from './aster-arcs/aster-arc';
import AsterArcs from './aster-arcs';
import AsterWhiskers from './aster-whiskers';
import AsterLabels from './aster-labels';
import AsterScore from './aster-score';
import style from './aster-chart.css';

export default class AsterChart extends React.Component {
  static getAverageFromInputData(data, valueField) {
    return Math.round(reduce(data, (a, b) => a + +b[valueField], 0) / data.length);
  }

  static getRadiiFromDimensions(width, height, radiusPaddingRatio, centerRadiusRatio) {
    const radius = Math.min(width, height) / radiusPaddingRatio;
    const innerRadius = centerRadiusRatio * radius;

    return { innerRadius, radius };
  }

  constructor(props) {
    super(props);
    const {
      data,
      accessorFields,
      width,
      height,
      radiusCenterRatio,
      radiusPaddingRatio,
      sort,
    } = props;

    const state = {
      average: AsterChart.getAverageFromInputData(data, accessorFields.value),
      asterData: pie()
        .sort(sort)
        .value(1)(data),
      radii: AsterChart.getRadiiFromDimensions(
        width,
        height,
        radiusCenterRatio,
        radiusPaddingRatio
      ),
      selectedArcs: [],
      transformTranslate: {
        transform: `translate(${props.width / 2}px, ${props.height / 2}px)`
      },
      width,
      height,
    };

    this.state = stateFromPropUpdates(AsterChart.propUpdates, {}, props, state, this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(
        AsterChart.propUpdates,
        this.props,
        nextProps,
        this.state,
        this
      )
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if data is not being currently loaded,
    // and when props have changed,
    return !nextProps.loading
      && PureRenderMixin.shouldComponentUpdate.call(this, nextProps, nextState);
  }

  arcValueFunction() {
    const { innerRadius, radius } = this.state.radii;
    const { domain, accessorFields } = this.props;
    const { value } = accessorFields;

    return arc()
      .innerRadius(innerRadius)
      .outerRadius(d => ((radius - innerRadius) * (d.data[value] / domain[1])) + innerRadius);
  }

  outlineFunction() {
    const { innerRadius, radius } = this.state.radii;

    return arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);
  }

  render() {
    const {
      average,
      asterData,
      radii,
      transformTranslate,
      width,
      height,
    } = this.state;

    const {
      accessorFields,
      centerText,
      colorScale,
      domain,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
      onArcClick,
      onScoreClick,
      selectedArcs,
      styles,
      ticks,
    } = this.props;

    const { labels, uncertainty } = accessorFields;
    const { innerRadius, radius } = radii;
    const {
      arcGroup,
      asterScore,
      label,
      labelOutline,
      outerArc,
      outerLabel,
      underArc,
      whiskers,
    } = styles;

    return (
      <svg
        width={width}
        height={height}
      >
        <g style={transformTranslate} className="aster-chart-group">
          <AsterTickCircles
            domain={domain}
            innerRadius={innerRadius}
            radius={radius}
            ticks={ticks}
          >
            {
             map(asterData, (d, i) => (
               <g key={i}>
                 <AsterArcs
                   arc={{
                     arcValueFunction: this.arcValueFunction(),
                     outlineFunction: this.outlineFunction(),
                   }}
                   styles={{ arcGroup, underArc }}
                   color={{ colorProp: 'label', colorScale }}
                   datum={d}
                   onMouseOver={onMouseOver}
                   onMouseMove={onMouseMove}
                   onMouseLeave={onMouseLeave}
                   onClick={onArcClick}
                   selectedArcs={[]}
                 />
                 <AsterWhiskers
                   data={d}
                   domainEnd={domain[1]}
                   innerRadius={innerRadius}
                   radius={radius}
                   styles={{ whiskers }}
                   uncertaintyProps={uncertainty}
                 />
                 <AsterLabels
                   d={d}
                   outlineFunction={this.outlineFunction()}
                   labelProp={labels.inner}
                   scoreProp={labels.outer}
                   styles={{ label, labelOutline, outerArc, outerLabel }}
                   radius={radius}
                 />
               </g>
             ))
            }

            {
              map(asterData, (d) => {
                if (!includes(selectedArcs, d.data.id)) return null;

                return (
                  <AsterArc
                    key={`SelectedArcs-${d.data.id}`}
                    className="overArc"
                    d={this.outlineFunction()(d)}
                    style={{ stroke: 'black', strokeWidth: '2px' }}
                  />
                );
              })
            }
            <AsterScore
              className={asterScore}
              content={{ average, centerText }}
              onClick={onScoreClick}
              radius={radius}
            />
          </AsterTickCircles>
        </g>
      </svg>
    );
  }
}

AsterChart.propTypes = {
  /**
   * Fields to access corresponding parts of data
   */
  accessorFields: React.PropTypes.shape({
    labels: React.PropTypes.shape({
      inner: React.PropTypes.string,
      outer: React.PropTypes.string,
    }),
    uncertainty: React.PropTypes.shape({
      lower: React.PropTypes.string,
      upper: React.PropTypes.string,
    }),
    value: React.PropTypes.string,
  }).isRequired,

  /**
   * text to display in center of aster-chart
   */
  centerText: React.PropTypes.shape({
    bottom: React.PropTypes.string,
    top: React.PropTypes.string,
  }),

  /**
   * scale to use for each arc in aster-chart
   */
  colorScale: React.PropTypes.func.isRequired,

  /**
   * array containing data for aster-chart
   */
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

  /**
   * domain array for aster scores
   */
  domain: React.PropTypes.arrayOf(React.PropTypes.number),

  /**
   * width of aster-chart
   */
  width: React.PropTypes.number,

  /**
   * height of aster-chart
   */
  height: React.PropTypes.number,

  /**
   * callback function for onMouseOver
   */
  onMouseOver: React.PropTypes.func,

  /**
   * callback function for onMouseMove
   */
  onMouseMove: React.PropTypes.func,

  /**
   * callback function for onMouseLeave
   */
  onMouseLeave: React.PropTypes.func,

  /**
   * callback function for onArcClick
   */
  onArcClick: React.PropTypes.func,

  /**
   * callback function for onScoreClick
   */
  onScoreClick: React.PropTypes.func,

  /**
   * how much of the circle will be empty in the center
   */
  radiusCenterRatio: React.PropTypes.number,

  /**
   * padding of the asterChart radius to divide by for outer padding
   */
  radiusPaddingRatio: React.PropTypes.number,

  /**
   * an array of the selected arcs key ids
   */
  selectedArcs: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  ),

  /**
   * sort function for ordering data set
   * default: (a, b) => a.order - b.order
   */
  sort: React.PropTypes.func,

  /**
   * css styles from aster-chart.css
   */
  styles: React.PropTypes.shape({

  }),

  /**
   * total number of circluar tick guides to display
   */
  ticks: React.PropTypes.number,
};

AsterChart.defaultProps = {
  radiusCenterRatio: 0.2,
  centerText: { bottom: '', top: '' },
  domain: [0, 100],
  height: 100,
  onMouseOver: noop,
  onMouseMove: noop,
  onMouseLeave: noop,
  onArcClick: noop,
  onScoreClick: noop,
  radiusPaddingRatio: 2.2,
  selectedArcs: [],
  sort: (a, b) => a.order - b.order,
  styles: style,
  ticks: 5,
  width: 100,
};

AsterChart.propUpdates = {
  average: (state, _, prevProps, nextProps) => {
    if (isEqual(prevProps.data, nextProps.data)) return state;
    return assign({}, state, {
      average: AsterChart.getAverageFromInputData(nextProps.data, nextProps.accessorFields.value),
    });
  },
  asterData: (state, _, prevProps, nextProps) => {
    if (isEqual(prevProps.data, nextProps.data) && prevProps.sort === nextProps.sort) return state;
    return assign({}, state, {
      asterData: pie()
        .sort(nextProps.sort)
        .value(1)(nextProps.data),
    });
  },
  height: (state, _, prevProps, nextProps) => {
    if (prevProps.height === nextProps.height) return state;
    return assign({}, state, {
      height: nextProps.height,
    });
  },
  radii: (state, _, prevProps, nextProps) => {
    if (prevProps.width === nextProps.width && prevProps.height === nextProps.height) return state;
    return assign({}, state, {
      radii: AsterChart.getRadiiFromDimensions(
        nextProps.width,
        nextProps.height,
        nextProps.radiusPaddingRatio,
        nextProps.radiusCenterRatio)
    });
  },
  transformTranslate: (state, _, prevProps, nextProps) => {
    if (prevProps.width === nextProps.width && prevProps.height === nextProps.height) return state;
    return assign({}, state, {
      transformTranslate: {
        transform: `translate(${nextProps.width / 2}px, ${nextProps.height / 2}px)`
      },
    });
  },
  width: (state, _, prevProps, nextProps) => {
    if (prevProps.width === nextProps.width) return state;
    return assign({}, state, {
      width: nextProps.width,
    });
  }
};
