import _ from 'lodash';
import cuid from 'cuid';

export const dataGenerator = (config = {}) => {
  const {
    primaryKeys = [
      { name: 'Sex', values: [1, 2, 3] },
      { name: 'Age', values: [1, 2, 3] },
<<<<<<< HEAD
      { name: 'Location', values: [1, 2] },
    ],
    valueKeys = [
      { name: 'mean', range: [100, 200], uncertainty: true },
      { name: 'Population', range: [200, 500], uncertainty: false }
=======
      { name: 'Location', values: [1, 2, 3] },
    ],
    valueKeys = [
      { name: 'mean', range: [100, 200] },
      { name: 'ub', range: [110, 230] },
      { name: 'lb', range: [90, 170] },
      { name: 'Population', range: [200, 500] }
>>>>>>> c72f4bd94ba2357c0e050cccbb0ac09355715573
    ],
    year = 2000,
    length = 10
  } = config;

  // Collect primary key values.
<<<<<<< HEAD
  // [
  //   [{k_1:v_1}, {k_1:v_2}, {k_1:v_3}],
  //   [{k_2:v_1}, {k_2:v_2}, {k_2:v_3}],
  //   [{k_3:v_1}, {k_3:v_2}]
  // ]
  const keyStore = _.map(primaryKeys, (k) => {
    return _.map(k.values, (v) => {
      const obj = {};
      obj[k.name] = v;
      return obj;
    });
  });

  // Create unique composite keys.
  // [
  //   {k_1:v_1, k_2:v_1, k_3:v_1},
  //   {k_1:v_2, k_2:v_1, k_3:v_1},
  //   {k_1:v_3, k_2:v_1, k_3:v_1},
  //   {k_1:v_1, k_2:v_2, k_3:v_1},
  //   {k_1:v_2, k_2:v_2, k_3:v_1},
  //   {k_1:v_3, k_2:v_2, k_3:v_1},
  //   {k_1:v_1, k_2:v_3, k_3:v_1},
  //   {k_1:v_2, k_2:v_3, k_3:v_1},
  //   {k_1:v_3, k_2:v_3, k_3:v_1},
  //   {k_1:v_1, k_2:v_1, k_3:v_2},
  //   {k_1:v_2, k_2:v_1, k_3:v_2},
  //   {k_1:v_3, k_2:v_1, k_3:v_2},
  //   {k_1:v_1, k_2:v_2, k_3:v_2},
  //   {k_1:v_2, k_2:v_2, k_3:v_2},
  //   {k_1:v_3, k_2:v_2, k_3:v_2},
  //   {k_1:v_1, k_2:v_3, k_3:v_2},
  //   {k_1:v_2, k_2:v_3, k_3:v_2},
  //   {k_1:v_3, k_2:v_3, k_3:v_2},
  // ]
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

  function amp(range) {
    return (range[1] - range[0]) / 2;
  }

  function sAxis(range) {
    return (range[1] + range[0]) / 2;
  }

  function sin(x) {
    return Math.sin(x);
  }

  // Create data for value keys.
  // [
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  //   ...
  //   [
  //     {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //     {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //     ...
  //     {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
  //   ],
  // ]
  const valueData = [];
  for (let j = 0; j < length; j++) {
    const segment = [];
    for (let i = 0; i < uniqKeys.length; i++) {
      const rowObj = {};
      for (let k = 0; k < valueKeys.length; k++) {
        const valObj = valueKeys[k];
        const obj = {};
        // sinusoidal data generator y=Asin(2x/L+B)+D
        const value = floor(amp(valObj.range) * sin(2 * j / length + k + i) + sAxis(valObj.range));
        obj[valObj.name] = value;
        if (valObj.uncertainty) {
          obj[`${valObj.name}_ub`] = floor(value + amp(valObj.range) / 4);
          obj[`${valObj.name}_lb`] = floor(value - amp(valObj.range) / 4);
        }
        Object.assign(rowObj, obj);
      }
      segment.push(rowObj);
    }
    valueData.push(segment);
  }


  // Populate rows.
  // [
  //   {k_1:v_1, k_2:v_1, k_3:v_1, k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
  //   {k_1:v_2, k_2:v_1, k_3:v_1, k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
  //   ...
  // ]
  const rows = [];
  _.forEach(valueData, (valArr, i) => {
    const yObj = { year_id: year + i };
    _.forEach(valArr, (valRow, j) => {
      const rowObj = { id: cuid() };
      Object.assign(rowObj, valRow, uniqKeys[j], yObj);
      rows.push(rowObj);
    });
=======
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
>>>>>>> c72f4bd94ba2357c0e050cccbb0ac09355715573
  });

  return rows;
};
