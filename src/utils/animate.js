import includes from 'lodash/includes';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

export function animationProcessorFactory(animate, defaultProcessor, animatableKeys) {
  // A factory for each animation method: `start` | `enter` | `update` | `leave`;
  return (method) => {
    // Animation Processor function.
    return (datum, index) => {
      const {
        events,
        timing,
        ...specificAnimationProps,
      } = animate;

      // Process datum, apply default animation, which can be overridden by user methods.
      return reduce(
        defaultProcessor(datum, index),
        (accum, value, key) => {
          if (includes(animatableKeys, key)) {
            // A user defined animation method. ie, `animate.fill.update`
            const userMethod = get(specificAnimationProps, [key, method]);

            // Apply animate defaults that can be overridden by user for respective `key`.
            const animationObject = {
              [key]: [value],
              events,
              timing,
              ...(userMethod && userMethod(value, datum, index)),
            };

            // Concatenate with accumulator and return.
            return [
              ...accum,
              animationObject,
            ];
          }
          // Return non-animation object with accumulator.
          return [
            ...accum,
            { [key]: value },
          ];
        },
        [],
      );
    };
  };
}

export function animationStartFactory(animate, defaultProcessor) {
  // Upon initialization, `start` cannot animate, but is required by `react-move`
  const METHOD = 'start';
  return (datum, index) => {
    return reduce(
      defaultProcessor(datum, index),
      (accum, value, key) => {
        const userMethod = get(animate, [key, METHOD]);

        const startValues = {
          [key]: value,
          ...(userMethod && userMethod(value, datum, index)),
        };

        return {
          ...accum,
          ...startValues,
        };
      },
      {},
    );
  };
}
