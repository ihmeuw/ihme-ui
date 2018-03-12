import includes from 'lodash/includes';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

export function animationStartFactory(animate) {
  // Upon initialization, `start` cannot animate, but is required by `react-move`
  const METHOD = 'start';
  return ({ data, key, state }, index) => {
    return reduce(
      state,
      (accum, value, property) => {
        const userMethod = get(animate, [property, METHOD]);

        const resolvedStartState = {
          [property]: value,
          ...(userMethod && userMethod(value, data, index)),
        };

        return {
          ...accum,
          ...resolvedStartState,
        };
      },
      {},
    );
  };
}

// A factory for each animation method: `enter` | `update` | `leave`;
export function animationProcessorFactory(animate, animatableKeys, method) {
  const NON_ANIMATABLE_METHOD = 'start';

  if (method === NON_ANIMATABLE_METHOD) {
    return animationStartFactory(animate);
  }

  return ({ data, key, state }, index) => {
    const {
      events: rootEvents,
      timing: rootTiming,
      ...specificAnimationMethods,
    } = animate;

    // Process datum, apply default animation, which can be overridden by user methods.
    return reduce(
      state,
      (accum, value, property) => {
        if (includes(animatableKeys, property)) {
          // Override root animate `events` and `timing` properties.
          // ie, `animate.events` can be overridden by `animate.fill.events`.
          const events = get(specificAnimationMethods, [property, 'events'], rootEvents);
          const timing = get(specificAnimationMethods, [property, 'timing'], rootTiming);

          // A user defined animation method. ie, `animate.fill.update`
          const userMethod = get(specificAnimationMethods, [property, method]);

          // Apply animate defaults that can be overridden by user for respective `key`.
          const resolvedState = {
            [property]: [value],
            events,
            timing,
            ...(userMethod && userMethod(value, data, index)),
          };

          // Concatenate with accumulator and return.
          return [
            ...accum,
            resolvedState,
          ];
        }
        // Return non-animation object with accumulator.
        return [
          ...accum,
          { [property]: value },
        ];
      },
      [],
    );
  };
}
