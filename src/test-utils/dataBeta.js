import _ from 'lodash';
import cuid from 'cuid';

/**
 * Random data generator
 * @param   {Object}  config -> configuration object with the following * * properties:
              {Array}   keys -> an Array of Objects containing column information. Each object may have the following properties:
                {String}  name -> string identifying the column name.
                {Boolean} primaryKey -> determines if key is part of a unique identifier
                {String}  type -> description of the type of data stored.
                  Supports: location | years | year | sex | range
                {Array}   values ->
                  case type: 'location' => an Array list of location ids.
                  case type: 'years' => an Array list of years.
                  case type: 'sex' => an Array list of sex ids.
                  case type: 'range' => an Array list of numbers. will do linear interpolation only between Max and Min values.
                {Number}  uncertainty -> creates two additional keys 'ub' and 'lb'. an uncertainty from a 'mean value'.
                {Number}  year -> for type:'year', this property provides an end year and steps backward based on 'step' below and 'length' below.
                {Number}  step -> steps to increment by when computing backward list of years based on 'year'.
              {Number}  length => number of datum objects.
 * @return  {Array} array of datum objects.
 */

// EXAMPLE
// config = {
//   keys: [
//     {name: 'location_id', primaryKey: true, type: 'location', values: [101, 102, 203, 204]},
//     {name: 'year_id', primaryKey: true, type: 'year', year: 2016, step: 0.5},
//     {name: 'sex_id', primaryKey: true, type: 'sex', values: [1, 2, 3]},
//     {name: 'mean', primaryKey: false, type: 'range', values: [100, 700], uncertainty: 50}
//   ],
//   length: 20
// };

export const dataGenerator = (config = {}) => {
  const {
    keys: [
      {name: 'year', primaryKey: true, type: 'year', year: 2016, step: 1},
      {name: 'mean', primaryKey: false, type: 'range', values: [100, 200], uncertainty: 25}
    ],
    length: 20
  } = config;
  const result = new Array(length);

  const primaryKeys = [];
  const otherKeys = [];

  // sort keys.
  _.forEach(keys, function(k) {
    switch (k.type) {
      case: 'year'
        k.values = getYearList(k.year, k.step);
        break;
      case: 'range'
        k.values = getRange(k.values)
    }
    if(k.primaryKey) {
      primaryKeys.push(k);
    } else {
      otherKeys.push(k);
    }
  });


  if(k.type === 'range') {
    k.data = makeRange(_.min(k.values, _.max(k.values)));
    if(k.uncertainty) {
      k.ub = makeUpperBound(k.data);
      k.lb = makeLowerBound(k.data);
    }
  }

  function getYearList(year, step) {
    const result = [];
    for(let i = 0; i < length; i++) {
      result.push(year - i * step)
    }
    return result;
  }

  function getRange(arr) {
    const max = _.max(arr);
    const min = _.min(arr);
    const dy = (max - min) / (length - 1);
    const result = [];
    for(let i = 0; i < length; i++) {
      result.push{min + i * dy}
    }
    return result;
  }

  function makeLowerBound(data) {
    const result = [];
    for (var i = 0; i < data.length; i++) {
      result.push(data[i] - uncertainty);
    }
    return result;
  }

  function makeUpperBound(data) {
    const result = [];
    for (var i = 0; i < data.length; i++) {
      result.push(data[i] + uncertainty);
    }
    return result;
  }
};
