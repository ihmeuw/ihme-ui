import { map } from 'lodash';
import cuid from 'cuid';
import random from 'd3-random';

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
*  {Boolean} useDates -> whether to use dates for valueField
*  {Number} startYear -> if (useDates), values will start at startYear
*  {Number} intitialValue -> seed output value
*  {Number} changeFactor -> parameter to adjust shape of data
*  {Number} initialDeviation -> parameter to adjust volitilty of data
*  {String} dataTrend -> one of 'increasing'|'decreasing'|'exponentialGrowth'|'exponentialDecay'
*  {Any} any other property that will be passed directly to individual datum
* @return {Array} array of datum objects
*/
export const dataGenerator = (config = {}) => {
  const {
    dataQuality = 'best',
    length = 200,
    keyField = 'location_id',
    valueField = 'value',
    useDates = false,
    intitialValue = 25000,
    changeFactor = 0.5,
    initialDeviation = 0.5 * changeFactor * intitialValue,
    dataTrend = 'increasing',
    startYear = (new Date()).getFullYear(),
    ...rest
  } = config;
  const ret = new Array(length);
  const linearGen = random.randomNormal(
    intitialValue * changeFactor,
    initialDeviation * changeFactor
  );
  const expChange = Math.pow(1 / changeFactor, 1 / length);
  const expGen = random.randomNormal(expChange, 0.01);

  const yearProducer = {
    initYear: startYear,
    currYear: startYear - length,
    next: function() {
      this.currYear++;
      return this.currYear;
    }
  };

  const trend = {
    increasing: (p) => {return p + linearGen();},
    decreasing: (p) => {return p - linearGen();},
    exponentialGrowth: (p) => {return p * expGen();},
    exponentialDecay: (p) => {return p * 1 / expGen();}
  };

  let prev = intitialValue;

  const valueProducer = (() => {
    return () => {
      const newVal = trend[dataTrend](prev);
      prev = newVal;
      let val;
      let useNum;

      switch (dataQuality) {
        case 'best':
          val = newVal;
          break;
        case 'mixed':
          useNum = random.randomUniform()() < 0.75 ? true : false; // 75% chance of true
          val = useNum ? newVal : null;
          break;
        case 'worst':
          useNum = random.randomUniform()() < 0.25 ? true : false; // 25% chance of true
          val = useNum ? newVal : null;
          break;
        default:
          val = newVal;
      }
      return val;
    };
  })();

  return map(ret, () => {
    const value = valueProducer();
    return {
      [keyField]: useDates ? yearProducer.next() : cuid(), // collision-resistant string id
      [valueField]: value,
      ub: value + initialDeviation,
      lb: value - initialDeviation,
      ...rest
    };
  });
};
