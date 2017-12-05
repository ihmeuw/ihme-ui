import { shallowEqual } from './objects';

// Export PureComponent for backwards compatibility (introduced before React.PureComponent existed).
// export { PureComponent } from 'react';

/**
 * Implementation of PureComponent's `shouldComponentUpdate`, copied directly from react (https://github.com/facebook/react).
 *
 * It's useful to have this as a standalone function when we want the sort of shallow equality check
 * that React.PureComponent provides but need to augment that behavior with some additional check(s).
 * @param {Object} oldProps
 * @param {Object} oldState
 * @param {Object} newProps
 * @param {Object} newState
 */
export function shouldPureComponentUpdate(oldProps, oldState, newProps, newState) {
  return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
}
