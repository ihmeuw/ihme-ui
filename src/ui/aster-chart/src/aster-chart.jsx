import React from 'react';
import classNames from 'classnames';
import { arc, pie } from 'd3';
import {
  assign,
  map,
  noop,
  reduce,
  sortBy,
} from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {
  CommonPropTypes,
  propsChanged,
  propResolver,
  stateFromPropUpdates,
} from '../../../utils';

import AsterTickCircles from './tick-circles';
import AsterArcs from './arcs';
import AsterWhiskers from './whiskers';
import AsterLabels from './labels';
import AsterScore from './score';
import style from './aster-chart.css';
import {
  RADIUS_CENTER_PROPORTION,
  RADIUS_PADDING_DIVIDER,
  UNITY,
} from './constants';

export default class AsterChart extends React.Component {
  static getAverageFromInputData(data, keyField) {
    return Math.round(reduce(data, (a, b) => a + +propResolver(b, [keyField]), 0) / data.length);
  }

  static getRadiiFromDimensions(width, height, radiusPaddingDivider, radiusCenterProportion) {
    const radius = Math.min(width, height) / radiusPaddingDivider;
    const innerRadius = radiusCenterProportion * radius;

    return { innerRadius, radius };
  }

  static orderDataForSelectedArcs(data, selectedArcs, keyField) {
    return sortBy(
      data,
      datum => map(
        selectedArcs,
        selected => propResolver(selected.data, [keyField]) === propResolver(datum.data, [keyField])
      )
    );
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(AsterChart.propUpdates, {}, props, {});
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
    const { domain, valueField } = this.props;

    return arc()
      .innerRadius(innerRadius)
      .outerRadius(d =>
        ((radius - innerRadius) * (propResolver(d.data, valueField) / domain[1])) + innerRadius
      );
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
    } = this.state;

    const {
      arcClassName,
      arcGroupClassName,
      asterClassName,
      asterScoreClassName,
      boundsLowerField,
      boundsUpperField,
      centerTextBottom,
      centerTextTop,
      colorField,
      colorScale,
      domain,
      height,
      innerTickClassName,
      keyField,
      labelClassName,
      labelOutlineClassName,
      labelField,
      labelOuterField,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
      onArcClick,
      onScoreClick,
      outerArcClassName,
      outerLabelClassName,
      outerLabelSelectedClassName,
      outerTickClassName,
      overArcClassName,
      selectedArcs,
      selectedArcsClassName,
      ticks,
      underArcClassName,
      width,
      whiskersClassName,
    } = this.props;

    const { innerRadius, radius } = radii;
    const {
      arcGroup,
      asterScore,
      innerTick,
      label,
      labelOutline,
      outerArc,
      outerLabel,
      outerLabelSelected,
      outerTick,
      overArc,
      selectedArc,
      underArc,
      whiskers,
    } = style;

    return (
      <svg
        width={width}
        height={height}
        style={this.props.style}
      >
        <g style={transformTranslate} className={classNames(asterClassName)}>
          <AsterTickCircles
            domain={domain}
            innerRadius={innerRadius}
            innerTickClassName={classNames(innerTick, innerTickClassName)}
            outerTickClassName={classNames(outerTick, outerTickClassName)}
            radius={radius}
            ticks={ticks}
          >
            {
             map(asterData, datum => (
               <g key={datum.data[keyField]}>
                 <AsterArcs
                   arcValueFunction={this.arcValueFunction()}
                   classNameArc={classNames(arc, arcClassName)}
                   classNameArcGroup={classNames(arcGroup, arcGroupClassName)}
                   classNameOver={classNames(overArc, overArcClassName)}
                   classNameSelectedArcs={classNames(selectedArc, selectedArcsClassName)}
                   classNameUnder={classNames(underArc, underArcClassName)}
                   colorField={colorField}
                   colorScale={colorScale}
                   datum={datum}
                   keyField={keyField}
                   onMouseOver={onMouseOver}
                   onMouseMove={onMouseMove}
                   onMouseLeave={onMouseLeave}
                   onClick={onArcClick}
                   outlineFunction={this.outlineFunction()}
                   selectedArcs={selectedArcs}
                 />
                 <AsterWhiskers
                   boundsLowerField={boundsLowerField}
                   boundsUpperField={boundsUpperField}
                   data={datum}
                   domainEnd={domain[1]}
                   innerRadius={innerRadius}
                   radius={radius}
                   className={classNames(whiskers, whiskersClassName)}
                 />
                 <AsterLabels
                   classNameLabel={classNames(label, labelClassName)}
                   classNameLabelOutline={classNames(labelOutline, labelOutlineClassName)}
                   classNameOuterArc={classNames(outerArc, outerArcClassName)}
                   classNameOuterLabel={classNames(outerLabel, outerLabelClassName)}
                   classNameOuterLabelSelected={
                     classNames(outerLabelSelected, outerLabelSelectedClassName)
                   }
                   datum={datum}
                   outlineFunction={this.outlineFunction()}
                   keyField={keyField}
                   labelField={labelField}
                   labelOuterField={labelOuterField}
                   selectedArcs={selectedArcs}
                   radius={radius}
                 />
               </g>
             ))
            }
            <AsterScore
              average={average} // maybe make aster score make the average?
              centerTextBottom={centerTextBottom}
              centerTextTop={centerTextTop}
              className={classNames(asterScore, asterScoreClassName)}
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
   * css class for the arcClassName
   * arcGroup contains 'underArc', 'arc', and 'overArc'. This class is applied to the 'arc'
   * component -- which displays the value of inputed data.
   */
  arcClassName: CommonPropTypes.className,

  /**
   * css class for the arc-group
   */
  arcGroupClassName: CommonPropTypes.className,

  /**
   * css class for the entire aster chart group
   */
  asterClassName: CommonPropTypes.className,

  /**
   * css class for the score in the center of the aster chart
   */
  asterScoreClassName: CommonPropTypes.className,

  /**
   * the field to access the lower uncertainty property on the data
   */
  boundsLowerField: CommonPropTypes.dataAccessor,

  /**
   * the field to access the upper uncertainty property on the data
   */
  boundsUpperField: CommonPropTypes.dataAccessor,

  /**
   * text to display in center of aster-chart (below center average score)
   */
  centerTextBottom: React.PropTypes.string,

  /**
   * text to display in center of aster-chart (above center average score)
   */
  centerTextTop: React.PropTypes.string,

  /**
   * scale to use for each arc in aster-chart
   */
  colorScale: React.PropTypes.func.isRequired,

  /**
   * property in data that colorScale can use to determine color
   */
  colorField: CommonPropTypes.dataAccessor,

  /**
   * sort function for ordering data set
   * default: (a, b) => a.order - b.order
   */
  comparator: React.PropTypes.func,

  /**
   * array containing data for aster-chart
   */
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

  /**
   * domain array for aster scores
   */
  domain: React.PropTypes.arrayOf(React.PropTypes.number),

  /**
   * height of aster-chart
   */
  height: CommonPropTypes.height,

  /**
   * css class for the inner tick guides of the aster chart
   */
  innerTickClassName: CommonPropTypes.className,

  /**
   * unique key of datum;
   * if a function, will be called with the datum object as first parameter
   */
  keyField: CommonPropTypes.dataAccessor.isRequired,

  /**
   * css class for label in the arc of the Aster-Chart
   */
  labelClassName: CommonPropTypes.className,

  /**
   * css class for the label outline of the Aster-Chart
   */
  labelOutlineClassName: CommonPropTypes.className,

  /**
   * property in data to access what text a label should display with arc of Aster-Chart
   */
  labelField: CommonPropTypes.dataAccessor,

  /**
   * property in data to access what should be displayed on edge of Aster-Chart
   */
  labelOuterField: CommonPropTypes.dataAccessor,

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
   * css class for the outer arc of the Aster-Chart
   * note: this element exists to position outside label.
   * it's advisable to not mess with this prop, but to leave it's default css
   */
  outerArcClassName: CommonPropTypes.className,

  /**
   * css class for the outer labels surrounding the Aster-Chart
   */
  outerLabelClassName: CommonPropTypes.className,

  /**
   * css class for the outer label of the Aster-Chart when that arc is selected
   */
  outerLabelSelectedClassName: CommonPropTypes.className,

  /**
   * css class for the outlining circles (most inner and most outer)
   */
  outerTickClassName: CommonPropTypes.className,

  /**
   * css class for the outlining arcs
   */
  overArcClassName: CommonPropTypes.className,

  /**
   * 'radiusCenterProportion' is how much of the circle will be empty in the center of the chart.
   * eg. if the aster-chart has a radius of 1000px, and the user wants 35% of the radius to be
   * empty for the center area labeling, assign .35 to radiusCenterProportion.
   */
  radiusCenterProportion: React.PropTypes.number,

  /**
   * Radius of the AsterChart is calcluated by Math.min(width, height) / radiusPaddingDivider.
   * If a user would like no padding, the 'radiusPaddingDivider' would be 2. The higher the number,
   * the more padding the chart will have.  The default value is 2.2 to allow for outside
   * score labels.
   */
  radiusPaddingDivider: React.PropTypes.number,

  /**
   * an array of the selected arcs key ids
   */
  selectedArcs: React.PropTypes.arrayOf(React.PropTypes.object),

  /**
   * css class for the selected arcs
   */
  selectedArcsClassName: CommonPropTypes.className,

  /**
   * css styles from aster-chart.css
   */
  style: CommonPropTypes.className,

  /**
   * total number of circluar tick guides to display
   */
  ticks: React.PropTypes.number,

  /**
   * css class for the under arcs
   * under arcs main function is to supply a hover color
   */
  underArcClassName: CommonPropTypes.className,

  /**
   * the name of the field of the Aster can derive value from.
   * i.e. measure, score, or any quantifyable value to display
   */
  valueField: CommonPropTypes.dataAccessor,

  /**
   * width of aster-chart
   */
  width: CommonPropTypes.width,

  /**
   * css class for the arc-group
   */
  whiskersClassName: CommonPropTypes.className,
};

AsterChart.defaultProps = {
  centerText: { bottom: '', top: '' },
  domain: [0, 100],
  height: 100,
  onMouseOver: noop,
  onMouseMove: noop,
  onMouseLeave: noop,
  onArcClick: noop,
  onScoreClick: noop,
  radiusCenterProportion: RADIUS_CENTER_PROPORTION,
  radiusPaddingDivider: RADIUS_PADDING_DIVIDER,
  selectedArcs: [],
  comparator: (a, b) => a.order - b.order,
  ticks: 5,
  width: 100,
};

AsterChart.propUpdates = {
  asterData: (state, _, prevProps, nextProps) => {
    if (!propsChanged(
        prevProps,
        nextProps,
        ['selectedArcs', 'comparator', 'data', 'keyField']
      )) return state;

    return assign({}, state, {
      asterData: AsterChart.orderDataForSelectedArcs(
        pie().sort(nextProps.comparator).value(UNITY)(nextProps.data),
        nextProps.selectedArcs,
        nextProps.keyField
      ),
    });
  },
  average: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['data'])) return state;

    return assign({}, state, {
      average: AsterChart.getAverageFromInputData(nextProps.data, nextProps.valueField),
    });
  },
  radii: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['height', 'width'])) return state;

    return assign({}, state, {
      radii: AsterChart.getRadiiFromDimensions(
        nextProps.width,
        nextProps.height,
        nextProps.radiusPaddingDivider,
        nextProps.radiusCenterProportion)
    });
  },
  transformTranslate: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['height', 'width'])) return state;

    return assign({}, state, {
      transformTranslate: {
        transform: `translate(${nextProps.width / 2}px, ${nextProps.height / 2}px)`
      },
    });
  },
};
