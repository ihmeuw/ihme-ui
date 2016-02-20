import map from 'lodash.map';
import cuid from 'cuid';
import random from 'random-js';

/**
 * Random data generator
 * @param {Object} config -> configuration object with the following properties:
 *  {String} dataQuality -> one of 'best'|'worst'|'mixed'
 *    'best' = no data quality issues (no null or missing values)
 *    'worst' = a lot of data quality issues (lots of null or missing values)
 *    'mixed' = some null values
 *  {Number} length -> number of data
 *  {String} keyField -> a field of datum that uniquely identifies it
 *  {String} valueField -> a field of datum that holds the "primary" datum (e.g., 'value' or 'mean')
 *  {Any} any other property that will be passed directly to individual datum
 * @return {Array} array of datum objects
 */
export const dataGenerator = (config = {}) => {
  const {
    dataQuality = 'best',
    length = 200,
    keyField = 'location_id',
    valueField = 'value',
    ...rest
  } = config;
  const ret = new Array(length);
  const randomGenerator = random();

  const valueProducer = (() => {
    return () => {
      const randNum = randomGenerator.real(0, 999999);
      let val;
      let useInt;

      switch (dataQuality) {
        case 'best':
          val = randNum;
          break;
        case 'mixed':
          useInt = randomGenerator.bool(0.75); // 75% chance of true
          val = useInt ? randNum : null;
          break;
        case 'worst':
          useInt = randomGenerator.bool(0.25); // 25% chance of true
          val = useInt ? randNum : null;
          break;
        default:
          val = randNum;
      }

      return val;
    };
  })();

  return map(ret, () => {
    return {
      [keyField]: cuid(), // collision-resistant string id
      [valueField]: valueProducer(),
      ...rest
    };
  });
};
