import PropTypes from 'prop-types';
import {
  atLeastOneOfProp,
  shapeTypes,
} from './props';
import intersection from "lodash/intersection";

/**
 * Optional transition properties for returned objects of react-move animation functions.
 * [Detailed in react-move](https://react-move.js.org/#/documentation/node-group)
 */
export const AnimationTransitionProps = PropTypes.shape({
  timing: PropTypes.shape({
    delay: PropTypes.number,
    duration: PropTypes.number,
    ease: PropTypes.func,
  }),
  events: PropTypes.shape({
    end: PropTypes.func,
    interrupt: PropTypes.func,
    start: PropTypes.func,
  }),
});

export const ScatterAnimationStateProps = PropTypes.shape({
  /**
   * processedFill: color after colorScales has been applied.
   */
  processedFill: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
  /**
   * resolvedShapeType: shape after shapeScale has been applied.
   * One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
   */
  resolvedShapeType: PropTypes.oneOf([
    PropTypes.oneOf(shapeTypes()),
    PropTypes.arrayOf(PropTypes.oneOf(shapeTypes())),
  ]).isRequired,
  /**
   * translateX: x coordinate in pixel space after positioning scale has been applied.
   */
  translateX: PropTypes.oneOf([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]).isRequired,
  /**
   * translateY: y coordinate in pixel space after positioning scale has been applied.
   */
  translateY: PropTypes.oneOf([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]).isRequired,
});

// TODO: This may not be possible. Unfortunately, this is a decent check -- but for the return of
// these functions. blerg.
export function allRequiredAnimationProps(propTypes) {
  return (props, propName, componentName, ...rest) => {
    const propObject = props[propName].reduce(
      (accum, propValue) => ({ ...accum, ...propValue }),
      {},
    );
    const error = propTypes[propName](props, propName, componentName, ...rest);
    return error && new Error(error);
  };
}
