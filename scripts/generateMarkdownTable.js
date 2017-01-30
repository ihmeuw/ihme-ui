'use strict';

const getValue = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isPlainObject = require('lodash/isPlainObject');
const join = require('lodash/join');
const map = require('lodash/map');
const replace = require('lodash/replace');

const HEADER = `
Property | Required | Type(s) | Defaults | Description
        --- | :---: | :---: | :---: | ---
`;

const COMMON_PROP_TYPES_TO_LINKS_MAP = {
  'CommonPropTypes.className': '[CommonPropTypes.className](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L11)',
  'CommonPropTypes.style': '[CommonPropTypes.style](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L16)',
  'CommonPropTypes.dataAccessor': '[CommonPropTypes.dataAccessor](https://github.com/ihmeuw/ihme-ui/blob/master/src/utils/props.js#L28)',
};

/**
 * props of type 'enum' can be string, e.g. "SCALE_TYPES"
 * or array of values, e.g., [{ value: 'green' }]
 * @param {String|Object|Array} value
 * @return {Array}
 */
function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (isPlainObject(value)) {
    return [value];
  }

  return [{ name: value }];
}

/**
 * Given a type description object, return legible string description
 * @param {Object} type
 * @return {String}
 */
function inferType(type) {
  if (!type) return '';

  function iterateTypes(subTree) {
    return map(normalizeValue(subTree), inferType).join(', ');
  }

  switch (type.name) {
    case 'arrayOf':
      return `array of ${iterateTypes(type.value)}`;
    case 'custom':
      return COMMON_PROP_TYPES_TO_LINKS_MAP[type.raw] || type.raw;
    case 'enum':
      return `one of: ${iterateTypes(type.value)}`;
    case 'shape':
    case 'shapeOf': // FALL THROUGH
      return 'object';
    case 'union':
      return iterateTypes(type.value);
    default:
      return type.name || type.value;
  }
}

/**
 * replace linefeeds with <br /> elements for markdown formatting
 * @param {String} str
 * @return {String}
 */
function replaceNewlineWithBreak(str) {
  return replace(str, /(\n)+/g, '<br />');
}

/**
 * given tree-like description of component api, return markdown table
 * header of table described by HEADER
 * @param {Object} api
 * @return {String}
 */
function generateMarkdownTable(api) {
  if (isEmpty(api.props)) return '';
  return HEADER.concat(
    join(map(api.props, (description, propName) =>
      [
        `\`${propName}\``,
        description.required ? 'true' : '',
        inferType(description.type),
        replaceNewlineWithBreak(getValue(description, 'defaultValue.value', '')),
        replaceNewlineWithBreak(description.description),
      ].join(' | ')
    ), '\n')
  );
}

module.exports = generateMarkdownTable;
