import React from 'react';

import { CommonPropTypes, PureComponent } from '../../../utils';
import {
  NINETY_DEGREES,
  NEG_NINETY_DEGREES,
  ONE_EIGHTY_DEGREES,
  POS_OFFSET,
  NEG_OFFSET,
  DIVISOR,
} from './constants';

export default class AsterLabels extends PureComponent {
  /**
   * calculates the angle of the label based on the angle of the aster-arc
   * @param {object} datum - the datum of the aster arc, containing startAngle and endAngle
   * @param {number} offset - to be added to calculated angle
   * @param {number} threshold - limit of the angle (will flip 180 degrees if exceeded)
   * @returns {number}
   */
  static angleCalculator(datum, offset, threshold) {
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
    const angle = AsterLabels.angleCalculator(datum, NEG_NINETY_DEGREES, NINETY_DEGREES);

    return `translate(${center}) rotate(${angle})`;
  }

  /**
   * takes arc outline d attr and returns just outer edge of that d attr
   * @param {object} datum - the datum of the aster arc
   * @param {function} outlineFunction - passed in function that returns outline of arc
   * @returns {string} d attribute of path for outer aster-arc
   */
  static outerArcFunction(datum, outlineFunction) {
    const angle = AsterLabels.angleCalculator(datum, 0, 0);

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
      datum,
      labelProp,
      radius,
      scoreProp,
      styles,
      outlineFunction,
    } = this.props;

    return (
      <g className="asterLabels">
        <text
          className={styles.labelOutline}
          dy=".35em"
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          fontSize={`${radius / DIVISOR}px`}
        >
          {labelProp ? datum.data[labelProp] : ''}
        </text>
        <text
          className={styles.label}
          dy=".35em"
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(datum, outlineFunction)}
          fontSize={`${radius / DIVISOR}px`}
        >
          {labelProp ? datum.data[labelProp] : ''}
        </text>

        <path
          className={styles.outerArc}
          id={`outer-arc-${datum.data.id}`}
          d={AsterLabels.outerArcFunction(datum, outlineFunction)}
        />
        <text
          className={styles.outerLabel}
          dy={(AsterLabels.angleCalculator(datum, 0, 0) < NINETY_DEGREES
                && AsterLabels.angleCalculator(datum, 0, 0) > NEG_NINETY_DEGREES)
                  ? POS_OFFSET
                  : NEG_OFFSET
          }
        >
          <textPath
            startOffset="50%"
            xlinkHref={`#outer-arc-${datum.data.id}`}
          >
            {scoreProp ? datum.data[scoreProp] : ''}
          </textPath>
        </text>
      </g>
    );
  }
}

AsterLabels.propTypes = {
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

  /* property in data to access what text a label should display */
  labelProp: CommonPropTypes.dataAccessor,

  /* radius of aster-plot */
  radius: React.PropTypes.string,

  /* property in data to access what the score should display */
  scoreProp: React.PropTypes.string,

  /* css style */
  styles: CommonPropTypes.style,

  /* d3 function for finding the outline of the aster-arc */
  outlineFunction: React.PropTypes.func,
};
