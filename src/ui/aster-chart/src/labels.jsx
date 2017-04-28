import React from 'react';
import classNames from 'classnames';

import {
  assign,
} from 'lodash';

import {
  CommonPropTypes,
  propResolver,
  PureComponent
} from '../../../utils';

import {
  LABEL_DY,
  LABEL_OUTLINE_DY,
  NINETY_DEGREES,
  NEG_OFFSET,
  NEG_NINETY_DEGREES,
  ONE_EIGHTY_DEGREES,
  POS_OFFSET,
  TEXT_SIZE_DENOMINATOR,
} from './constants';

export default class AsterLabels extends PureComponent {
  static calculateAngle(datum, offset, threshold) {
    const angle = ((datum.startAngle + datum.endAngle) * (NINETY_DEGREES / Math.PI)) + offset;
    return angle > threshold ? angle - ONE_EIGHTY_DEGREES : angle;
  }

  static determineLabelTransform(datum, outlineFunction) {
    const center = outlineFunction.centroid(datum);
    const angle = AsterLabels.calculateAngle(datum, NEG_NINETY_DEGREES, NINETY_DEGREES);

    return `translate(${center}) rotate(${angle})`;
  }

  static getStyle({ datum, fontSize, selected, style, styleSelected }) {
    const baseStyle = { fontSize };

    const computedStyle = typeof style === 'function' ? style(datum) : style;
    let computedSelectedStyle = {};

    // if arc is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof styleSelected === 'function' ?
        styleSelected(datum) : styleSelected;
    }

    return assign({}, baseStyle, computedStyle, computedSelectedStyle);
  }

  static outerArcFunction(datum, outlineFunction) {
    const angle = AsterLabels.calculateAngle(datum, 0, 0);

    let newArc = /(^.+?)L/.exec(outlineFunction(datum))[1];
    newArc = newArc.replace(/,/g, ' ');

    if (newArc === 'M0 0') return newArc;

    if (angle < NINETY_DEGREES && angle > NEG_NINETY_DEGREES) {
      const newStart = /0 0 1 (.*?)$/.exec(newArc)[1];
      const newEnd = /M(.*?)A/.exec(newArc)[1];
      const middleSec = /A(.*?)0 0 1/.exec(newArc)[1];

      newArc = `M${newStart}A${middleSec}0 0 0 ${newEnd}`;
    }

    return newArc;
  }

  render() {
    const {
      classNameLabel,
      classNameLabelOutline,
      classNameOuterArc,
      classNameOuterLabel,
      classNameOuterLabelSelected,
      datum,
      formatOuterLabel,
      keyField,
      labelField,
      labelOuterField,
      radius,
      outlineFunction,
      selected,
      styleLabel,
      styleLabelOutline,
      styleOuterArc,
      styleOuterLabel,
      styleOuterLabelSelected,
    } = this.props;

    const angle = AsterLabels.calculateAngle(datum, 0, 0);

    return (
      <g className="asterLabels">
        <text
          className={classNames(classNameLabelOutline)}
          dy={LABEL_OUTLINE_DY}
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          style={AsterLabels.getStyle({
            datum,
            style: styleLabelOutline,
            fontSize: `${radius / TEXT_SIZE_DENOMINATOR}px`,
          })}
        >
          {propResolver(datum.data, labelField)}
        </text>
        <text
          className={classNames(classNameLabel)}
          dy={LABEL_DY}
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          style={AsterLabels.getStyle({
            datum,
            style: styleLabel,
            fontSize: `${radius / TEXT_SIZE_DENOMINATOR}px`,

          })}
        >
          {propResolver(datum.data, labelField)}
        </text>

        <path
          className={classNames(classNameOuterArc)}
          id={`outer-arc-${datum.data[keyField]}`}
          d={AsterLabels.outerArcFunction(datum, outlineFunction)}
          style={AsterLabels.getStyle({ datum, style: styleOuterArc })}
        />
        <text
          className={classNames(
            classNameOuterLabel, {
              [classNameOuterLabelSelected]: selected && classNameOuterLabelSelected,
            })}
          dy={(angle < NINETY_DEGREES && angle > NEG_NINETY_DEGREES) ? POS_OFFSET : NEG_OFFSET}
          style={AsterLabels.getStyle({
            datum,
            selected,
            style: styleOuterLabel,
            styleSelected: styleOuterLabelSelected,
            transform: null,
          })}
        >
          <textPath
            startOffset="50%"
            textAnchor="middle"
            xlinkHref={`#outer-arc-${datum.data[keyField]}`}
          >
            {(labelOuterField) ? formatOuterLabel(propResolver(datum.data, labelOuterField)) : ''}
          </textPath>
        </text>
      </g>
    );
  }
}

AsterLabels.propTypes = {
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
   * the data to be displayed by label
   */
  datum: React.PropTypes.shape({
    endAngle: React.PropTypes.number,
    index: React.PropTypes.number,
    padAngle: React.PropTypes.number,
    startAngle: React.PropTypes.number,
    value: React.PropTypes.number,
    data: React.PropTypes.objectOf(React.PropTypes.string),
  }).isRequired,

  /**
   * an optional function to format the content in the labels that surround the
   * Aster-Chart
   */
  formatOuterLabel: React.PropTypes.func.isRequired,

  /**
   * unique key of datum (if originally a function, string should be interpolated by parent)
   */
  keyField: React.PropTypes.oneOfType([
    React.PropTypes.string,
  ]).isRequired,

  /**
   * property in data to access what text a label should display
   */
  labelField: CommonPropTypes.dataAccessor,

  /**
   * property in data to access what the score should display on edge of aster
   */
  labelOuterField: CommonPropTypes.dataAccessor,

  /**
   *  d3 function for finding the outline of the aster-arc
   */
  outlineFunction: React.PropTypes.func.isRequired,

  /**
   *  radius of aster-plot
   */
  radius: React.PropTypes.number.isRequired,

  /**
   * Whether arc is selected.
   */
  selected: React.PropTypes.bool,

  /**
   * Base inline styles applied to main arc label of `<AsterLabel />`s
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleLabel: CommonPropTypes.style,

  /**
   * Base inline styles applied to outline of arc label of `<AsterLabel />`s
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleLabelOutline: CommonPropTypes.style,

  /**
   * Base inline styles applied to outer arc that `<AsterLabel />`s
   * outer label is positioned by.
   * it's not advisable to change this since it is mainly a positioning element for the outer label.
   * but. do what your hear tells you.
   *
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleOuterArc: CommonPropTypes.style,

  /**
   * Base inline styles applied to outer label of `<AsterLabel />`s
   * Usually, this label will show the score represented by the arc it corresponds to
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleOuterLabel: CommonPropTypes.style,

  /**
   * Base inline styles applied to a selected arc's outer label of `<AsterLabel />`s
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleOuterLabelSelected: CommonPropTypes.style,
};

AsterLabels.defaultProps = {
  classNameLabel: '',
  classNameLabelOutline: '',
  classNameOuterArc: '',
  classNameOuterLabel: '',
  classNameOuterLabelSelected: '',
  labelField: null,
  labelOuterField: null,
  selected: false,
  styleLabel: {},
  styleLabelOutline: {},
  styleOuterArc: {},
  styleOuterLabel: {},
  styleOuterLabelSelected: {},
};
