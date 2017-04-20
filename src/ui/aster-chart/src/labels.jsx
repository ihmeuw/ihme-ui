import React from 'react';
import classNames from 'classnames';
import { includes } from 'lodash';

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
  /**
   * calculates the angle of the label based on the angle of the aster-arc
   * @param {object} datum - the datum of the aster arc, containing startAngle and endAngle
   * @param {number} offset - to be added to calculated angle
   * @param {number} threshold - limit of the angle (will flip 180 degrees if exceeded)
   * @returns {number}
   */
  static calculateAngle(datum, offset, threshold) {
    const angle = ((datum.startAngle + datum.endAngle) * (NINETY_DEGREES / Math.PI)) + offset;
    return angle > threshold ? angle - ONE_EIGHTY_DEGREES : angle;
  }

  /**
   * determines the transform of aster-arc label
   * @param {object} datum - the datum of the aster arc
   * @param {function} outlineFunction - passed in function that returns outline of arc
   * @returns {string}
   */
  static determineLabelTransform(datum, outlineFunction) {
    const center = outlineFunction.centroid(datum);
    const angle = AsterLabels.calculateAngle(datum, NEG_NINETY_DEGREES, NINETY_DEGREES);

    return `translate(${center}) rotate(${angle})`;
  }

  /**
   * takes arc outline d attr and returns just outer edge of that d attr
   * @param {object} datum - the datum of the aster arc
   * @param {function} outlineFunction - passed in function that returns outline of arc
   * @returns {string} d attribute of path for outer aster-arc
   */
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
      keyField,
      labelField,
      labelOuterField,
      radius,
      outlineFunction,
      selectedArcs,
    } = this.props;

    const angle = AsterLabels.calculateAngle(datum, 0, 0);

    return (
      <g className="asterLabels">
        <text
          className={classNames(classNameLabelOutline)}
          dy={LABEL_OUTLINE_DY}
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          fontSize={`${radius / TEXT_SIZE_DENOMINATOR}px`}
        >
          {labelField ? propResolver(datum.data, labelField) : ''}
        </text>
        <text
          className={classNames(classNameLabel)}
          dy={LABEL_DY}
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          fontSize={`${radius / TEXT_SIZE_DENOMINATOR}px`}
        >
          {labelField ? propResolver(datum.data, labelField) : ''}
        </text>

        <path
          className={classNames(classNameOuterArc)}
          id={`outer-arc-${datum.data[keyField]}`}
          d={AsterLabels.outerArcFunction(datum, outlineFunction)}
        />
        <text
          className={
            (includes(selectedArcs.map(
              selected => propResolver(selected.data, keyField)),
              propResolver(datum.data, keyField))
            ) ? classNames(classNameOuterLabelSelected) : classNames(classNameOuterLabel)
          }
          dy={(angle < NINETY_DEGREES && angle > NEG_NINETY_DEGREES) ? POS_OFFSET : NEG_OFFSET}
        >
          <textPath
            startOffset="50%"
            textAnchor="middle"
            xlinkHref={`#outer-arc-${datum.data[keyField]}`}
          >
            {labelOuterField ? propResolver(datum.data, labelOuterField) : ''}
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
   * property in data to access what text a label should display
   */
  labelField: CommonPropTypes.dataAccessor,

  /**
   * property in data to access what the score should display on edge of aster
   */
  labelOuterField: CommonPropTypes.dataAccessor,

  /**
   *  radius of aster-plot
   */
  radius: React.PropTypes.number,

  /**
   *  d3 function for finding the outline of the aster-arc
   */
  outlineFunction: React.PropTypes.func,
};
