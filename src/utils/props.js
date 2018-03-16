import PropTypes from 'prop-types';
import eq from 'lodash/eq';
import identity from 'lodash/identity';
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';

export const CommonPropTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object, // e.g., inline styles
    PropTypes.func, // function to be passed some datum, required to return an object
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  dataAccessor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

export const CommonDefaultProps = {
  noop,
  identity,
};

/**
 * Event functions that happen during animated transition.
 * @type {AnimateEventsType}
 */
export const AnimateEvents = PropTypes.shape({
  start: PropTypes.func,
  interrupt: PropTypes.func,
  end: PropTypes.func,
});

/**
 * Timing instructions for animated transition.
 * @type {AnimateTimingType}
 */
export const AnimateTiming = PropTypes.shape({
  delay: PropTypes.number,
  duration: PropTypes.number,
  ease: PropTypes.func,
});

/**
 * A value that an animatable attribute can evaluate to animate to.
 * @type {AnimatableValueType}
 */
export const AnimatableValue = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.number),
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]);

/**
 * A function that returns an object describing how the state should initially start.
 * @type {AnimateStartCallback}
 */
export const AnimateStart = PropTypes.func;

/**
 * A function that returns an object describing how the state should transform.
 * @type {AnimateMethodCallback}
 */
export const AnimateMethod = PropTypes.func;

/**
 * An object that gives instructions for handling animation
 * @type {AnimatePropType}
 */
export const AnimateProp = PropTypes.shape({
  start: AnimateStart,
  enter: AnimateMethod,
  leave: AnimateMethod,
  update: AnimateMethod,
  events: AnimateEvents,
  timing: AnimateTiming,
});

export function exactlyOneOfProp(propTypes) {
  return (props, propName, componentName, ...rest) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length === 1) {
      if (validProps[0] === propName) {
        error = propTypes[propName](props, propName, componentName, ...rest);
      }
    } else {
      /* eslint-disable max-len */
      error = `Exactly one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`. Found: [${validProps.length ? `\`${validProps.join('`,`')}\`` : ''}].`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}

export function atLeastOneOfProp(propTypes) {
  return (props, propName, componentName, ...rest) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length > 0) {
      if (includes(validProps, propName)) {
        error = propTypes[propName](props, propName, componentName, ...rest);
      }
    } else {
      /* eslint-disable max-len */
      error = `At least one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`.`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}

export function propsChanged(prevProps, nextProps, propsToCompare, propsToOmit, comparator = eq) {
  return !reduce(propsToCompare || Object.keys(nextProps), (acc, prop) => {
    return acc && (includes(propsToOmit, prop) || comparator(prevProps[prop], nextProps[prop]));
  }, true);
}

/**
 * Helper function to build a state object from updated props.
 *
 * The `propUpdates` object will define the prop name and the comparison action. The comparison
 * action is a callback with signature (accumulator, propName, prevProps, nextProps), that
 * evaluates the prop changes, and determines what to add to the state. The return value will be
 * the new accumulated state. It is important to return the accumulator even if no relevant prop
 * changes are found.
 *
 * @param {{ propName: comparisonActionCallback }} propUpdates - prop name and comparison action function.
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @param {Object} state
 * @param {Object} [context] - optional `this` context with which to call propUpdate functions
 * @returns {Object} accumulated state.
 */
export function stateFromPropUpdates(propUpdates, prevProps, nextProps, state, context) {
  return reduce(propUpdates, (acc, value, key) => {
    return value(acc, key, prevProps, nextProps, context);
  }, state);
}

/**
 * Helper function to plug into `stateFromPropUpdates` to provide simplified comparison and update
 * functionality.
 *
 * The `func` callback will be called if the immediate prop has changed. Its signature is
 * (nextProp, propName, nextProps), and it determines what to add to the state. The return value
 * will be the new accumulated state.
 *
 * @param {updateFuncCallback} func
 * @returns {comparisonActionCallback} comparison action callback.
 */
export function updateFunc(func) {
  return (acc, key, prevProps = {}, nextProps, context) => {
    return prevProps[key] !== nextProps[key] ?
      { ...acc, ...func(nextProps[key], key, nextProps, acc, context) } :
      acc;
  };
}

/**
 * Apply a series of function to the properties of two objects.
 * @param prevProps
 * @param nextProps
 * @param propNames
 * @param {firstFuncCallback} firstFunc
 * @param {restFuncsCallback} restFuncs
 * @returns {Object}
 */
export function applyFuncToProps(prevProps, nextProps, propNames, firstFunc, ...restFuncs) {
  return reduce(propNames || Object.keys(nextProps), (acc, prop) => {
    return {
      ...acc,
      [prop]: reduce(restFuncs, (funcAcc, func) => {
        return func(funcAcc);
      }, (firstFunc || identity)(prevProps[prop], nextProps[prop])),
    };
  }, {});
}

/**
 * @callback firstFuncCallback
 * @param {*} prevProp
 * @param {*} nextProp
 * @returns {*} result
 */

/**
 * @callback restFuncsCallback
 * @param {*} acc
 * @returns {*} result
 */

/**
 * @callback comparisonActionCallback
 * @param {Object} state accumulator
 * @param {string} propName
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @param {Object} [context] - optional `this` context with which to call updateFuncCallback
 * @returns {Object} state property
 */

/**
 * @callback updateFuncCallback
 * @param {any} nextProp
 * @param {string} propName
 * @param {Object} nextProps
 * @param {Object} state accumulator
 * @param {Object} [context] - optional `this` context with which to call updateFuncCallback.
 *                             Usually the react component instance.
 * @returns {Object} accumulated state.
 */

/**
 * @typedef {(string | string[] | number | number[] )} AnimatableValueType
 * @description Value for animatable attribute. Values not wrapped in an array will not be animated.
 *   ie, a `fill` attribute can animate to the color, '#ccc', by the value `['#ccc']`.
 *   [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
 */

/**
 * @typedef {Object} AnimationStartStateType
 * @description Object representing animatable attribute's initial state.
 * @property {(string | number)} <keyof AnimationInstruction> - value of
 *   AnimationStartState. The key would be the name of the attribute that is to be
 *   affected, ie `fill`.
 */

/**
 * @callback AnimateStartCallback
 * @param {(number | string)} value - computed value of animatable attribute that can be overridden.
 * @param {Object} rawDatum - input data object from which `value` was computed.
 * @param {number} index - array index of `rawDatum` within greater dataset.
 * @returns {AnimationStartStateType}
 */

/**
 * @callback AnimateEventsCallback
 * @description Function to execute during an animated transition event.
 *   ie, function to execute on transition `end`.
 *   No formal parameters the function has access to the context in which it was created.
 * @returns {Void}
 */

/**
 * @typedef {Object} AnimateEventsType
 * @description The given functions are passed. no arguments but
 * have access to the context in which they were created.
 * [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
 * @property {AnimateEventsCallback} start - function to run on `start`.
 * @property {AnimateEventsCallback} interrupt - function to run on `interrupt`.
 * @property {AnimateEventsCallback} end - function to run on `end`.
 */

/**
 * @callback EasingFunction
 * @description Easing function [detailed in react-move](https://react-move.js.org/#/documentation/node-group).
 * @param {number} t - input value
 * @returns {number}
 */

/**
 * @typedef {Object} AnimateTimingType
 * @param {number} [delay] - time in ms before transition occurs.
 * @param {number} [duration] - time in ms of how long the transition should last.
 * @param {EasingFunction} [ease] - easing function like `d3-easeLinear`.
 */

/**
 * @typedef {Object} AnimationInstructionType
 * @description Instructions for how an animatable attribute should animate.
 * @property {AnimatableValueType} [<keyof AnimationInstruction>] - optional value of
 *   AnimationInstruction. The key would be the name of the animatable attribute that is to be
 *   affected, ie `fill`. Note, the value must be wrapped in an array if animation is desired.
 * @property {AnimateEventsType} [events] - optional object containing instructions for events.
 * @property {AnimateTimingType} [timing] - optional object containing instructions for timing.
 */

/**
 * @callback AnimateMethodCallback
 * @param {number|string} value - computed value of animatable attribute that can be overridden.
 * @param {Object} rawDatum - input data object from which `value` was computed.
 * @param {number} index - array index of `rawDatum` within greater dataset.
 * @returns {AnimationInstructionType}
 */

/**
 * @typedef {Object} AnimatePropType
 * @description An object that gives instructions for handling animation:
 * @property {AnimateStart} start - establish state at `start`
 * @property {AnimateMethodCallback} enter - establish state for animations at `enter`
 * @property {AnimateMethodCallback} update - establish state for animations at `update`
 * @property {AnimateMethodCallback} leave - establish state for animations at `leave`
 * @property {AnimateEvents} events - `events` used if not overridden by `AnimateMethod`
 * @property {AnimateTiming} timing - `timing` used if not overridden by `AnimateMethod`
 */
