import includes from 'lodash/includes';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

// A factory for each animation method: `enter` | `update` | `leave`;
export function animationProcessorFactory(animate, animatableKeys, method) {
  return ({ data, key, state }, index) => {
    const {
      events,
      timing,
      ...specificAnimationMethods,
    } = animate;

    // Process datum, apply default animation, which can be overridden by user methods.
    return reduce(
      state,
      (accum, value, property) => {
        if (includes(animatableKeys, property)) {
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
