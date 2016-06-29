import d3Shape from 'd3-shape';

const SHAPES = {
  ...Object.keys(d3Shape).reduce((acc, key) => {
    if (key.match(/symbol[A-Z]/)) {
      return { ...acc, [key.toLowerCase().replace('symbol', '')]: d3Shape[key] };
    }
    return acc;
  }, {}),
  line: {
    draw(context, size) {
      const width = Math.sqrt(size);
      const height = width * (1.5 / 8);  // 1.5px for every 8px wide
      return context.rect(-width / 2, -height / 2, width, height);
    }
  },
};

/**
 * Get a list of shortened d3 symbol names.
 * @returns {Array} list of shortened scale names.
 */
export function getSymbolTypes() {
  return Object.keys(SHAPES);
}

/**
 * Get a d3 symbol by shortened name.
 * @param type
 * @returns {symbol|circle} specified symbol type. Defaults to `circle`.
 */
export function getSymbol(type) {
  return SHAPES[type] || SHAPES.circle;
}

