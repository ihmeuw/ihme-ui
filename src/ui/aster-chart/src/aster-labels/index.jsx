import React from 'react';

import {
  // CommonPropTypes,
  // propsChanged,
  PureComponent,
  // stateFromPropUpdates,
} from '../../../../utils';

export default class AsterLabels extends PureComponent {
  /**
   * calculates the angle of the label based on the angle of the aster-arc
   * @param {object} datum - the datum of the aster arc, containing startAngle and endAngle
   * @param {number} offset - to be added to calculated angle
   * @param {number} threshold - limit of the angle (will flip 180 degrees if exceeded)
   * @returns {number}
   */
  static angleCalculator(datum, offset, threshold) {
    const { NINETY, ONE_EIGHTY } = AsterLabels.statics;

    const angle = ((datum.startAngle + datum.endAngle) * (NINETY / Math.PI)) + offset;
    return angle > threshold ? angle - ONE_EIGHTY : angle;
  }

  /**
   * determines the transform of aster-arc label
   * @param {object} datum - the datum of the aster arc
   * @param {function} outlineFunction - passed in function that returns outline of arc
   * @returns {string}
   */
  static determineLabelTransform(datum, outlineFunction) {
    const { NINETY, NEG_NINETY } = AsterLabels.statics;

    const center = outlineFunction.centroid(datum);
    const angle = AsterLabels.angleCalculator(datum, NEG_NINETY, NINETY);

    return `translate(${center}) rotate(${angle})`;
  }

  /**
   * takes arc outline d attr and returns just outer edge of that d attr
   * @param {object} datum - the datum of the aster arc
   * @param {function} outlineFunction - passed in function that returns outline of arc
   * @returns {string} d attribute of path for outer aster-arc
   */
  static outerArcFunction(datum, outlineFunction) {
    const { NINETY, NEG_NINETY } = AsterLabels.statics;
    const angle = AsterLabels.angleCalculator(datum, 0, 0);

    let newArc = /(^.+?)L/.exec(outlineFunction(datum))[1];
    newArc = newArc.replace(/,/g, ' ');

    if (newArc === 'M0 0') return newArc;

    if (angle < NINETY && angle > NEG_NINETY) {
      const newStart = /0 0 1 (.*?)$/.exec(newArc)[1];
      const newEnd = /M(.*?)A/.exec(newArc)[1];
      const middleSec = /A(.*?)0 0 1/.exec(newArc)[1];

      newArc = `M${newStart}A${middleSec}0 0 0 ${newEnd}`;
    }

    return newArc;
  }

  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    const {
      NINETY,
      NEG_NINETY,
      POS_OFFSET,
      NEG_OFFSET,
      DIVISOR,
    } = AsterLabels.statics;

    const {
      d,
      labelProp,
      radius,
      scoreProp,
      styles,
      outlineFunction,
    } = this.state;

    return (
      <g className="asterLabels">
        <text
          className={styles.labelOutline}
          dy=".35em"
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(d, outlineFunction)}
          fontSize={`${radius / DIVISOR}px`}
        >
          {labelProp ? d.data[labelProp] : ''}
        </text>
        <text
          className={styles.label}
          dy=".35em"
          textAnchor="middle"
          transform={AsterLabels.determineLabelTransform(d, outlineFunction)}
          fontSize={`${radius / DIVISOR}px`}
        >
          {labelProp ? d.data[labelProp] : ''}
        </text>

        <path
          className={styles.outerArc}
          id={`outer-arc-${d.data.id}`}
          d={AsterLabels.outerArcFunction(d, outlineFunction)}
        />
        <text
          className={styles.outerLabel}
          dy={(AsterLabels.angleCalculator(d, 0, 0) < NINETY
                && AsterLabels.angleCalculator(d, 0, 0) > NEG_NINETY) ? POS_OFFSET : NEG_OFFSET}
        >
          <textPath
            startOffset="50%"
            xlinkHref={`#outer-arc-${d.data.id}`}
          >
            {scoreProp ? d.data[scoreProp] : ''}
          </textPath>
        </text>
      </g>
    );
  }
}

AsterLabels.statics = {
  NINETY: 90,
  NEG_NINETY: -90,
  ONE_EIGHTY: 180,
  POS_OFFSET: 18,
  NEG_OFFSET: -8,
  DIVISOR: 30
};
