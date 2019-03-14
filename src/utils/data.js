import { assign, flatMap, map, reduce, uniqueId } from 'lodash';

import { propResolver } from './objects';

export function computeDataMax(data, valueAccessor) {
  return data.reduce(
    (prevMax, datum) => Math.max(prevMax, propResolver(datum, valueAccessor)),
    Number.NEGATIVE_INFINITY,
  );
}

export const dataGenerator = (config = {}) => {
  const {
    primaryKeys = [
      { name: 'Sex', values: [1, 2, 3] },
      { name: 'Age', values: [1, 2, 3] },
      { name: 'Location', values: [1, 2] },
    ],
    valueKeys = [
      { name: 'mean', range: [100, 200], uncertainty: true },
      { name: 'Population', range: [200, 500], uncertainty: false }
    ],
    year = 2000,
    length = 10
  } = config;

  /*
  Collect primary key values.
  [
    [{k_1:v_1}, {k_1:v_2}, {k_1:v_3}],
    [{k_2:v_1}, {k_2:v_2}, {k_2:v_3}],
    [{k_3:v_1}, {k_3:v_2}]
  ]
  */
  const keyStore = map(primaryKeys, (k) => map(k.values, (v) => ({ [k.name]: v })));

  /*
  Create unique composite keys.
  [
    {k_1:v_1, k_2:v_1, k_3:v_1},
    {k_1:v_2, k_2:v_1, k_3:v_1},
    {k_1:v_3, k_2:v_1, k_3:v_1},
    {k_1:v_1, k_2:v_2, k_3:v_1},
    {k_1:v_2, k_2:v_2, k_3:v_1},
    {k_1:v_3, k_2:v_2, k_3:v_1},
    {k_1:v_1, k_2:v_3, k_3:v_1},
    {k_1:v_2, k_2:v_3, k_3:v_1},
    {k_1:v_3, k_2:v_3, k_3:v_1},
    {k_1:v_1, k_2:v_1, k_3:v_2},
    {k_1:v_2, k_2:v_1, k_3:v_2},
    {k_1:v_3, k_2:v_1, k_3:v_2},
    {k_1:v_1, k_2:v_2, k_3:v_2},
    {k_1:v_2, k_2:v_2, k_3:v_2},
    {k_1:v_3, k_2:v_2, k_3:v_2},
    {k_1:v_1, k_2:v_3, k_3:v_2},
    {k_1:v_2, k_2:v_3, k_3:v_2},
    {k_1:v_3, k_2:v_3, k_3:v_2},
  ]
  */
  const uniqKeys = reduce(keyStore,
    (uniqueCombinations, primaryKeyOptions) => flatMap(primaryKeyOptions,
      (keyOption) => map(uniqueCombinations,
        (intermediateCombo) => assign({}, keyOption, intermediateCombo)
      )
    )
  );

  /**
   * Floor function modified to cut off at tenths digit.
   * @param number {NUMBER}
   * @return {NUMBER}
   */
  function floor(number) {
    return Math.floor(number * 10) / 10;
  }

  /**
   * amp computes the half distance of the total range.
   * amplitude of sinusoidal curve.
   * @param [a, b] {ARRAY}
   * @return {NUMBER}
   */
  function amp(range) {
    return (range[1] - range[0]) / 2;
  }

  /**
   * sAxis computes the midpoint of the total range.
   * sinusoidal axis.
   * @param [a, b] {ARRAY}
   * @return {NUMBER}
   */
  function sAxis(range) {
    return (range[1] + range[0]) / 2;
  }

  function sin(x) {
    return Math.sin(x);
  }

  /*
  Create data for value keys.
  [
    [
      {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
      {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
      ...
      {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
    ],
    [
      {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
      {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
      ...
      {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
    ],
    ...
    [
      {k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
      {k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
      ...
      {k_a:v_18, k_b:v_18, k_c:v_18, k_d:v_18},
    ],
  ]
  */
  const valueData = [];
  for (let j = 0; j < length; j++) {
    const segment = [];
    for (let i = 0; i < uniqKeys.length; i++) {
      const rowObj = {};
      for (let k = 0; k < valueKeys.length; k++) {
        const valObj = valueKeys[k];
        const amplitude = amp(valObj.range);
        // sinusoidal data generator y=Asin(2x/L+B)+D
        const value = floor(amplitude * sin(2 * j / length + k + i) + sAxis(valObj.range));
        const obj = { [valObj.name]: value, year_id: year + j };
        if (valObj.uncertainty) {
          obj[`${valObj.name}_ub`] = floor(value + amplitude / 4);
          obj[`${valObj.name}_lb`] = floor(value - amplitude / 4);
        }
        assign(rowObj, obj);
      }
      segment.push(rowObj);
    }
    valueData.push(segment);
  }

  /*
  Populate rows.
  [
    {k_1:v_1, k_2:v_1, k_3:v_1, k_a:v_1, k_b:v_1, k_c:v_1, k_d:v_1},
    {k_1:v_2, k_2:v_1, k_3:v_1, k_a:v_2, k_b:v_2, k_c:v_2, k_d:v_2},
    ...
  ]
  */
  const rows = flatMap(valueData,
    (listOfValueKeys) => map(listOfValueKeys,
      (valueKey, i) => assign({}, valueKey, uniqKeys[i])
    )
  );

  return map(rows, (r) => assign({ id: uniqueId() }, r));
};
