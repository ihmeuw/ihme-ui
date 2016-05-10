import _ from 'lodash';
import cuid from 'cuid';

export const dataGenerator = (config = {}) => {
  const {
    primaryKeys = [
      { name: 'Sex', values: [1, 2, 3] },
      { name: 'Age', values: [1, 2, 3] },
      { name: 'Location', values: [1, 2, 3] },
    ],
    valueKeys = [
      { name: 'mean', range: [100, 200] },
      { name: 'ub', range: [110, 230] },
      { name: 'lb', range: [90, 170] },
      { name: 'Population', range: [200, 500] }
    ],
    year = 2000,
    length = 10
  } = config;

  // Collect primary key values.
  const keyStore = [];
  _.forEach(primaryKeys, (k) => {
    const keySpread = [];
    _.forEach(k.values, (v) => {
      const obj = {};
      obj[k.name] = v;
      keySpread.push(obj);
    });
    keyStore.push(keySpread);
  });

  // Create unique composite keys.
  let uniqKeys = [{}];
  _.forEach(keyStore, (keyValues) => {
    const sto = [];
    _.forEach(keyValues, (keyObj) => {
      _.forEach(uniqKeys, (rowObj) => {
        sto.push(Object.assign({}, rowObj, keyObj));
      });
    });
    uniqKeys = sto;
  });


  function floor(number) {
    return Math.floor(number * 10) / 10;
  }

  function delY(range) {
    return length > 1 ? floor((range[1] - range[0]) / (length - 1)) : 0;
  }

  // Create data for value keys.
  const valueData = [];
  _.forEach(valueKeys, (valObj) => {
    const col = [];
    const dy = delY(valObj.range);
    for (let i = 0; i < length; i++) {
      const obj = {};
      obj[valObj.name] = floor(valObj.range[0] + dy * i);
      col.push(obj);
    }
    valueData.push(col);
  });

  // Populate rows.
  const rows = [];
  _.forEach(uniqKeys, (k) => {
    for (let i = 0; i < length; i++) {
      const idObj = { id: cuid() };
      const yObj = { year: year + i };
      const vObj = {};
      for (let j = 0; j < valueData.length; j++) {
        Object.assign(vObj, valueData[j][i]);
      }
      rows.push(Object.assign({}, idObj, k, yObj, vObj));
    }
  });

  return rows;
};
