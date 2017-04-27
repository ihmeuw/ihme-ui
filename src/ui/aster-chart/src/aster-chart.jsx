import React from 'react';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {
  arc,
  pie,
} from 'd3';

import {
  assign,
  includes,
  map,
  noop,
  sortBy,
} from 'lodash';

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
import classes from './aster-chart.css';

import {
  RADIUS_CENTER_PROPORTION,
  RADIUS_PADDING_DIVIDER,
  UNITY,
} from './constants';

export default class AsterChart extends React.Component {
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
      asterData,
      radii: {
        innerRadius,
        radius,
      },
      styleAsterGroup,
    } = this.state;

    const {
      classNameArc,
      classNameArcGroup,
      classNameAsterGroup,
      classNameAsterScore,
      classNameInnerTick,
      classNameLabel,
      classNameLabelOutline,
      classNameOuterArc,
      classNameOuterLabel,
      classNameOuterLabelSelected,
      classNameOuterTick,
      classNameOverArc,
      classNameSelectedArcs,
      classNameSVG,
      classNameUnderArc,
      classNameWhiskers,
      boundsLowerField,
      boundsUpperField,
      centerTextBottom,
      centerTextTop,
      colorField,
      colorScale,
      domain,
      formatOuterLabel,
      formatScore,
      height,
      keyField,
      labelField,
      labelOuterField,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
      onArcClick,
      onScoreClick,
      selectedArcs,
      styleArc,
      styleArcGroup,
      styleAsterScore,
      styleInnerTick,
      styleLabel,
      styleLabelOutline,
      styleOuterArc,
      styleOuterLabel,
      styleOuterLabelSelected,
      styleOuterTick,
      styleSVG,
      styleOverArc,
      styleSelectedArc,
      styleUnderArc,
      styleWhiskers,
      ticks,
      valueField,
      width,
    } = this.props;

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
    } = classes;

    return (
      <svg
        className={classNames(classNameSVG)}
        height={height}
        width={width}
        style={styleSVG}
      >
        <g
          className={classNames(classNameAsterGroup)}
          style={styleAsterGroup}
        >
          <AsterTickCircles
            domain={domain}
            innerRadius={innerRadius}
            classNameInnerTick={classNames(innerTick, classNameInnerTick)}
            classNameOuterTick={classNames(outerTick, classNameOuterTick)}
            radius={radius}
            styleInnerTick={styleInnerTick}
            styleOuterTick={styleOuterTick}
            ticks={ticks}
          >
            {
             map(asterData, (datum) => {
               const isSelected = includes(map(selectedArcs, selected =>
                 propResolver(selected.data, keyField)), propResolver(datum.data, keyField));

               return (
                 <g key={datum.data[keyField]}>
                   <AsterArcs
                     arcValueFunction={this.arcValueFunction()}
                     classNameArc={classNames(arc, classNameArc)}
                     classNameArcGroup={classNames(arcGroup, classNameArcGroup)}
                     classNameOver={classNames(overArc, classNameOverArc)}
                     classNameSelectedArcs={classNames(selectedArc, classNameSelectedArcs)}
                     classNameUnder={classNames(underArc, classNameUnderArc)}
                     colorField={colorField}
                     colorScale={colorScale}
                     datum={datum}
                     keyField={keyField}
                     onMouseOver={onMouseOver}
                     onMouseMove={onMouseMove}
                     onMouseLeave={onMouseLeave}
                     onClick={onArcClick}
                     outlineFunction={this.outlineFunction()}
                     selected={isSelected}
                     styleArc={styleArc}
                     styleArcGroup={styleArcGroup}
                     styleOverArc={styleOverArc}
                     styleSelectedArc={styleSelectedArc}
                     styleUnderArc={styleUnderArc}
                   />
                   <AsterWhiskers
                     boundsLowerField={boundsLowerField}
                     boundsUpperField={boundsUpperField}
                     data={datum}
                     domainEnd={domain[1]}
                     innerRadius={innerRadius}
                     radius={radius}
                     className={classNames(whiskers, classNameWhiskers)}
                     style={styleWhiskers}
                   />
                   <AsterLabels
                     classNameLabel={classNames(label, classNameLabel)}
                     classNameLabelOutline={classNames(labelOutline, classNameLabelOutline)}
                     classNameOuterArc={classNames(outerArc, classNameOuterArc)}
                     classNameOuterLabel={classNames(outerLabel, classNameOuterLabel)}
                     classNameOuterLabelSelected={
                       classNames(outerLabelSelected, classNameOuterLabelSelected)
                     }
                     datum={datum}
                     formatOuterLabel={formatOuterLabel}
                     outlineFunction={this.outlineFunction()}
                     keyField={keyField}
                     labelField={labelField}
                     labelOuterField={labelOuterField}
                     selected={isSelected}
                     styleLabel={styleLabel}
                     styleLabelOutline={styleLabelOutline}
                     styleOuterArc={styleOuterArc}
                     styleOuterLabel={styleOuterLabel}
                     styleOuterLabelSelected={styleOuterLabelSelected}
                     radius={radius}
                   />
                 </g>
               );
             })
            }
            <AsterScore
              centerTextBottom={centerTextBottom}
              centerTextTop={centerTextTop}
              className={classNames(asterScore, classNameAsterScore)}
              data={asterData}
              formatScore={formatScore}
              onClick={onScoreClick}
              radius={radius}
              style={styleAsterScore}
              valueField={valueField}
            />
          </AsterTickCircles>
        </g>
      </svg>
    );
  }
}

AsterChart.propTypes = {
  /**
   * the field to access the lower uncertainty property on the data
   */
  boundsLowerField: CommonPropTypes.dataAccessor,

  /**
   * the field to access the upper uncertainty property on the data
   */
  boundsUpperField: CommonPropTypes.dataAccessor,

  /**
   * css class for the classNameArc
   * arcGroup contains 'underArc', 'arc', and 'overArc'. This class is applied to the 'arc'
   * component -- which displays the value of inputed data.
   */
  classNameArc: CommonPropTypes.className,

  /**
   * css class for the arc-group
   */
  classNameArcGroup: CommonPropTypes.className,

  /**
   * css class for the g element that contains the Aster-Chart
   */
  classNameAsterGroup: CommonPropTypes.className,

  /**
   * css class for the AsterScore element in the center of the Aster-Chart
   */
  classNameAsterScore: CommonPropTypes.className,

  /**
   * css class for the entire aster chart group
   */
  classNameAsterGroupGroup: CommonPropTypes.className,

  /**
   * css class for the score in the center of the aster chart
   */
  classNameAsterGroupScore: CommonPropTypes.className,

  /**
   * css class for the inner tick guides of the aster chart
   */
  classNameInnerTick: CommonPropTypes.className,

  /**
   * css class for label in the arc of the Aster-Chart
   */
  classNameLabel: CommonPropTypes.className,

  /**
   * css class for the label outline of the Aster-Chart
   */
  classNameLabelOutline: CommonPropTypes.className,

  /**
   * css class for the outer arc of the Aster-Chart
   * note: this element exists to position outside label.
   * it's advisable to not mess with this prop, but to leave it's default css
   */
  classNameOuterArc: CommonPropTypes.className,

  /**
   * css class for the outer labels surrounding the Aster-Chart
   */
  classNameOuterLabel: CommonPropTypes.className,

  /**
   * css class for the outer label of the Aster-Chart when that arc is selected
   */
  classNameOuterLabelSelected: CommonPropTypes.className,

  /**
   * css class surrounding SVG element of the Aster-Chart
   */
  classNameSVG: CommonPropTypes.className,

  /**
   * css class for the outlining circles (most inner and most outer)
   */
  classNameOuterTick: CommonPropTypes.className,

  /**
   * css class for the outlining arcs
   */
  classNameOverArc: CommonPropTypes.className,

  /**
   * css class for the selected arcs
   */
  classNameSelectedArcs: CommonPropTypes.className,

  /**
   * css class for the under arcs
   * under arcs main function is to supply a hover color
   */
  classNameUnderArc: CommonPropTypes.className,
  /**
   * css class for the arc-group
   */
  classNameWhiskers: CommonPropTypes.className,

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
  colorField: CommonPropTypes.dataAccessor.isRequired,

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
   * an optional function to format the content in the labels that surround the Aster-Chart
   * defaults to Math.round
   */
  formatOuterLabel: React.PropTypes.func,

  /**
   * an optional function to format the average shown in center of Aster-Chart
   * defaults to Math.round
   */
  formatScore: React.PropTypes.func,

  /**
   * height of Aster-Chart
   */
  height: CommonPropTypes.height,

  /**
   * unique key of datum;
   * if a function, will be called with the datum object as first parameter
   */
  keyField: CommonPropTypes.dataAccessor.isRequired,

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
   * Base inline styles applied to `<Arc />`s. (Controls color fill)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  styleArc: CommonPropTypes.style,

  /**
   * Inline styles applied to `<Arc />`s. (Controls color fill)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  styleArcGroup: CommonPropTypes.style,

  /**
   * Inline style applied to center score element of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleAsterScore: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * Inline style applied to inner ticks of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleInnerTick: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * Base inline styles applied to interior label `<AsterLabel />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterLabel />`.
   */
  styleLabel: CommonPropTypes.style,

  /**
   * Base inline styles applied to outline of `<AsterLabel />`s. (displayed on each arc)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterLabel />`.
   */
  styleLabelOutline: CommonPropTypes.style,

  /**
   * Base inline styles applied to outside arc `<AsterLabel />`s.
   * It should be noted that this is best not messed with.
   * the main style applied here is making the element not visible, since it is used to place
   * the outside text in the outer label of the Aster-Chart
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterLabel />`.
   */
  styleOuterArc: CommonPropTypes.style1,

  /**
   * Base inline styles applied to outer label of `<AsterLabel />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterLabel />`.
   */
  styleOuterLabel: CommonPropTypes.style1,

  /**
   * Base inline styles applied to outside label of selected arcs of `<AsterLabel />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterLabel />`.
   */
  styleOuterLabelSelected: CommonPropTypes.style1,

  /**
   * Inline style applied to outer ticks of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleOuterTick: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * Base inline styles applied to overlaying `<Arc />`s. (controls non-selected outline)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleOverArc: CommonPropTypes.style,

  /**
   * Selected inline styles applied to overlaying `<Arc />`s. (Control's selected outline)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleSelectedArc: CommonPropTypes.style,

  /**
   * Inline style applied directly to svg containing entire chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleSVG: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * Base inline styles applied to underlying `<Arc />`s. (Controls hover)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleUnderArc: CommonPropTypes.style,

  /**
   * Base inline styles applied to `<styleWhiskers />`s. (Mainly concerning stroke, stroke-width)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleWhiskers: CommonPropTypes.style,

  /**
   * total number of circluar tick guides to display
   */
  ticks: React.PropTypes.number,

  /**
   * the name of the field of the Aster can derive value from.
   * i.e. measure, score, or any quantifyable value to display
   */
  valueField: CommonPropTypes.dataAccessor.isRequired,

  /**
   * width of aster-chart
   */
  width: CommonPropTypes.width,
};

AsterChart.defaultProps = {
  boundsLowerField: null,
  boundsUpperField: null,
  centerTextBottom: '',
  centerTextTop: '',
  classNameArc: '',
  classNameArcGroup: '',
  classNameAsterGroup: '',
  classNameAsterGroupScore: '',
  classNameInnerTick: '',
  classNameLabel: '',
  classNameLabelOutline: '',
  classNameOuterArc: '',
  classNameOuterLabel: '',
  classNameOuterLabelSelected: '',
  classNameOuterTick: '',
  classNameOverArc: '',
  classNameSelectedArcs: '',
  classNameSVG: '',
  classNameUnderArc: '',
  classNameWhiskers: '',
  domain: [0, 100],
  formatOuterLabel: Math.round,
  formatScore: Math.round,
  height: 100,
  labelField: null,
  labelOuterField: null,
  onMouseOver: noop,
  onMouseMove: noop,
  onMouseLeave: noop,
  onArcClick: noop,
  onScoreClick: noop,
  radiusCenterProportion: RADIUS_CENTER_PROPORTION,
  radiusPaddingDivider: RADIUS_PADDING_DIVIDER,
  selectedArcs: [],
  styleArc: {},
  styleArcGroup: {},
  styleAsterScore: {},
  styleInnerTick: {},
  styleLabel: {},
  styleLabelOutline: {},
  styleOuterArc: {},
  styleOuterTick: {},
  styleOuterLabel: {},
  styleOuterLabelSelected: {},
  styleSVG: {},
  styleOverArc: {},
  styleSelectedArc: {},
  styleUnderArc: {},
  styleWhiskers: {},
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
  styleAsterGroup: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['height', 'styleAsterGroup', 'width'])) return state;

    return assign({}, state, {
      styleAsterGroup: assign({},
        {
          transform: `translate(${nextProps.width / 2}px, ${nextProps.height / 2}px)`,
        },
        nextProps.styleAsterGroup
      ),
    });
  },
};
