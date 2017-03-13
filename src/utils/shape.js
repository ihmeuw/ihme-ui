import * as d3 from 'd3';

const SHAPES = {
  ...Object.keys(d3).reduce((acc, key) => {
    if (key.match(/symbol[A-Z]/)) {
      return { ...acc, [key.toLowerCase().replace('symbol', '')]: d3[key] };
    }
    return acc;
  }, {}),
  line: {
    draw(context, size) {
      const width = Math.sqrt(size);
      const height = width * (1.5 / 8);  // 1.5px for every 8px wide
      return context.rect(-width / 2, -height / 2, width, height);
    },
  },
};

/**
 * Get a list of shortened d3 symbol names.
 * @returns {Array} list of shortened scale names.
 */
export function shapeTypes() {
  return Object.keys(SHAPES);
}

/**
 * Get a d3 symbol by shortened name.
 * @param type
 * @param default_
 * @returns {symbol|circle} specified symbol type. Defaults to `circle`.
 */
export function getShape(type, default_ = SHAPES.circle) {
  return SHAPES[type] || default_;
}

