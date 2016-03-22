import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Select from '../src/select';

chai.use(chaiEnzyme());

describe('<Select />', () => {
  const testHierarchicalData = [
    { location_id: 6, name: 'China', children: [
      { location_id: 491, name: 'Anhui', children: [
        { location_id: 40726, name: 'Bagongshan Qi', children: [] },
        { location_id: 40717, name: 'Bangshan Qi', children: [] },
        { location_id: 40702, name: 'Baohe Qi', children: [] },
        { location_id: 40792, name: 'Chizhou Shi', children: [] },
        { location_id: 40743, name: 'Daguan Qu', children: [] },
        { location_id: 40777, name: 'Dangshan Xian', children: [] }
      ] },
      { location_id: 492, name: 'Beijing', children: [
        { location_id: 39770, name: 'Changping Qu', children: [] },
        { location_id: 39762, name: 'Chaoyang Qu', children: [] },
        { location_id: 39771, name: 'Daxing Qu', children: [] },
        { location_id: 39760, name: 'Dongcheng Qu', children: [] },
        { location_id: 39767, name: 'Fangshan Qu', children: [] },
        { location_id: 39763, name: 'Fengtai Qu', children: [] }
      ] }
    ] }
  ];

  ('it flattens a hierarchy', () => {
    const expectedFlattenedData = [
      { location_id: 6, name: 'China', level: 0 },
      { location_id: 491, name: 'Anhui', level: 1 },
      { location_id: 40726, name: 'Bagongshan Qi', level: 2 },
      { location_id: 40717, name: 'Bangshan Qi', level: 2 },
      { location_id: 40702, name: 'Baohe Qi', level: 2 },
      { location_id: 40792, name: 'Chizhou Shi', level: 2 },
      { location_id: 40743, name: 'Daguan Qu', level: 2 },
      { location_id: 40777, name: 'Dangshan Xian', level: 2 },
      { location_id: 492, name: 'Beijing', level: 1 },
      { location_id: 39770, name: 'Changping Qu', level: 2 },
      { location_id: 39762, name: 'Chaoyang Qu', level: 2 },
      { location_id: 39771, name: 'Daxing Qu', level: 2 },
      { location_id: 39760, name: 'Dongcheng Qu', level: 2 },
      { location_id: 39767, name: 'Fangshan Qu', level: 2 },
      { location_id: 39763, name: 'Fengtai Qu', level: 2 }
    ];

    expect(Select.flattenHierarchy({
      data: testHierarchicalData,
      labelKey: 'name',
      valueKey: 'location_id'
    })).to.deep.equal(expectedFlattenedData);
  });
});
