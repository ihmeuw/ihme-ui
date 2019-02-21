import { scaleLinear, scaleBand } from 'd3';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';

import { propResolver } from './objects';

/**
 * Determines the orientation of the bars relative to the default orientation
 * of vertical bars.
 * @param orientation : A string that represents the orientation of the chart
 * @returns {boolean} : Returns whether the given argument is vertical
 */
export function isVertical(orientation) {
  return (orientation.toLowerCase() === 'vertical');
}

export function computeDomainScale(categories, orientation, spaceAvailable) {
  return scaleBand()
    .domain(categories)
    .range(isVertical(orientation) ? [0, spaceAvailable] : [spaceAvailable, 0]);
}

export function computeRangeScale(max, orientation, spaceAvailable) {
  return scaleLinear()
    .domain([0, max])
    .range(isVertical(orientation) ? [spaceAvailable, 0] : [0, spaceAvailable]);
}

export function computeStackMax(data, stacks, stackAccessor, valueAccessor) {
  // Iterate through the data, creating an object mapping stack name to the max value for the stack.
  const maxPerStack = data.reduce((acc, datum) => {
    const stack = propResolver(datum, stackAccessor);
    const value = propResolver(datum, valueAccessor);
    // If the key exists on the accumulator, add the current value to its value.
    // Otherwise add the key, initializing its value with the current value.
    /* eslint-disable no-param-reassign */
    if (stack in acc) {
      acc[stack] += value;
    } else {
      acc[stack] = value;
    }
    /* eslint-enable no-param-reassign */
    return acc;
  }, {});

  // Return the max of the biggest stack.
  return values(maxPerStack).reduce((prevMax, currMax) => Math.max(prevMax, currMax), 0);
}

export function computeStackDatumKey(stack, layer) {
  return `${stack}:${layer}`;
}

/**
 * Computes the spatial offsets (start, end) for each bar in a stacked bar chart
 *
 * @param {datum[]} data - Array of datum objects, each of which must contain fields denoting the
 *   stack, layer, and value.
 * @param {string[]|number[]} stackDomain - names of the categories represented by each stack
 * @param {string[]|number[]} layerDomain - names of the categories represented by each layer
 * @param {string|number} stackField - property name of each datum object denoting the stack
 * @param {string|number} layerField - property name on each datum object denoting the layer
 * @param {number} valueField - property name on each datum object denoting the value
 *
 * @returns {object} - a mapping of keys in the form `${stack}:${layer}` to two-element arrays
 *   in the form `[start, end]` denoting the spatial offsets for each bar
 */
export function computeStackOffsets(
  data,
  stackDomain,
  layerDomain,
  stackField,
  layerField,
  valueField,
) {
  // We create an object mapping keys `${stack}:${layer}` to each datum object.
  // That allows us quick lookups to retrieve the value of each bar.
  const dataByStackAndLayer = keyBy(
    data,
    datum => computeStackDatumKey(datum[stackField], datum[layerField]),
  );

  // Now we create an object mapping keys `${stack}:${layer}`, the same as in `dataByStackAndLayer`,
  // to the spatial offsets [start, end] for each bar. It's important that we traverse each stack in
  // the same order, so that the ordering of layers is consistent.
  const offsetsByStackAndLayer = Object.create(null);

  // traverse the stacks
  for (const stack of stackDomain) {
    // In each stack, we keep track of where the previous layer ended.
    // This will be the start of the next layer.
    let prevEnd = 0;

    // traverse the layers in a stack
    for (const layer of layerDomain) {
      const key = computeStackDatumKey(stack, layer);
      const datum = dataByStackAndLayer[key];
      const value = datum[valueField];
      const start = prevEnd;
      const end = start + value;

      // store the starting and ending offsets for the current bar
      offsetsByStackAndLayer[key] = [start, end];

      // store the ending offset for use in the next iteration
      prevEnd = end;
    }
  }

  return offsetsByStackAndLayer;
}

/**
 * Adjusts the domain scaling function with alignment and band padding
 *
 * @param scale : a function that computes the bar's position on the domain axis
 * @param align : Represents the alignment properties for the ordinal scale bandwidth
 * @param bandPaddingInner : Represents the inner band padding property for the ordinal scale bandwidth
 * @param bandPaddingOuter : Represents the outter band padding property for the ordinal scale bandwidth
 * @returns {function} : Returns a function that represents the ordinal scale for chart
 */
export function adjustDomainScale(scale, align, bandPaddingInner, bandPaddingOuter) {
  scale.paddingInner(bandPaddingInner);
  scale.paddingOuter(bandPaddingOuter);
  if (align) {
    scale.align(align);
  }
  return scale;
}
