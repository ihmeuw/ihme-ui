/* eslint-disable no-unused-expressions, max-len */
import chai, { expect } from 'chai';
import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Map, { filterData } from '../src/map';

chai.use(chaiEnzyme());

describe('<Map />', () => {
  describe('utils', () => {
    it('filterData only returns data corresponding to rendered geometries', () => {
      const data = [
        { key: 1 },
        { key: 2 },
        { key: 3 }
      ];

      const keysOfVisibleGeometries = [1, 2];
      expect(filterData(data, keysOfVisibleGeometries, 'key'))
        .to.be.an('array')
        .of.length(2)
        .to.deep.include({ key: 1 })
        .and.to.deep.include({ key: 2 })
        .and.to.not.deep.include({ key: 3 });
    });
  });

  describe('mesh filters', () => {
    const geometryKeyField = 'loc_id';

    const disputedTerritory = {
      properties: {
        claimants: ['2', '3'],
        admins: ['3'],
      },
    };

    const claimingCountry = {
      properties: {
        [geometryKeyField]: '2',
      }
    };

    const administeringCountry = {
      properties: {
        [geometryKeyField]: '3',
      }
    };

    const nonClaimingCountry = {
      properties: {
        [geometryKeyField]: '4',
      },
    };

    describe('disputedBordersMeshFilter', () => {
      const disputedBordersMeshFilter = Map.prototype.getMeshFilter.bind(
        { state: { keysOfSelectedLocations: [] } },
        'disputed-borders',
      );

      it('returns false when there is not a dispute between two geometries', () => {
        const result = disputedBordersMeshFilter(
          disputedTerritory,
          claimingCountry,
          nonClaimingCountry,
        );
        expect(result).to.be.false;
      });

      it('returns true when there is a dispute between two geometries', () => {
        const result = disputedBordersMeshFilter(
          disputedTerritory,
          claimingCountry,
          administeringCountry,
        );
        expect(result).to.be.true;
      });

      it('returns false when boundary is external', () => {
        expect(disputedBordersMeshFilter(disputedTerritory, claimingCountry)).to.be.false;
        expect(disputedBordersMeshFilter(disputedTerritory, administeringCountry)).to.be.false;
        expect(disputedBordersMeshFilter(disputedTerritory, nonClaimingCountry)).to.be.false;
      });
    });

    describe('nonDisputedBordersMeshFilter', () => {
      const nonDisputedBordersMeshFilter = Map.prototype.getMeshFilter.bind(
        { state: { keysOfSelectedLocations: [] } },
        'non-disputed-borders',
      );

      it('returns true when there is not a dispute between two geometries', () => {
        const result = nonDisputedBordersMeshFilter(disputedTerritory,
          disputedTerritory,
          claimingCountry,
          nonClaimingCountry,
        );
        expect(result).to.be.true;
      });

      it('returns false when there is a dispute between two geometries', () => {
        const result = nonDisputedBordersMeshFilter(
          disputedTerritory,
          claimingCountry,
          administeringCountry,
        );
        expect(result).to.be.false;
      });

      it('returns true between a geometry and itself (outside border)', () => {
        expect(nonDisputedBordersMeshFilter(disputedTerritory, claimingCountry)).to.be.true;
        expect(nonDisputedBordersMeshFilter(disputedTerritory, administeringCountry)).to.be.true;
        expect(nonDisputedBordersMeshFilter(disputedTerritory, nonClaimingCountry)).to.be.true;
      });
    });

    describe('selectedBordersMeshFilter', () => {
      it('returns true when either geometry is selected and no disputed border is selected', () => {
        const selectedBordersMeshFilter = Map.prototype.getMeshFilter.bind(
          { state: { keysOfSelectedLocations: ['4'] } },
          'selected-non-disputed-borders',
        );

        expect(selectedBordersMeshFilter(disputedTerritory, nonClaimingCountry)).to.be.true;
      });

      it('returns false when either geometry is selected and a disputed border is selected', () => {
        const selectedBordersMeshFilter = Map.prototype.getMeshFilter.bind(
          { state: { keysOfSelectedLocations: ['2'] } },
          'selected-non-disputed-borders',
        );

        const result = selectedBordersMeshFilter(
          disputedTerritory,
          claimingCountry,
          nonClaimingCountry,
        );

        expect(result).to.be.false;
      });

      it('returns false when neither geometry is selected and no disputed border is selected', () => {
        const selectedBordersMeshFilter = Map.prototype.getMeshFilter.bind(
          { state: { keysOfSelectedLocations: ['5'] } },
          'selected-non-disputed-borders',
        );

        const result = selectedBordersMeshFilter(
          disputedTerritory,
          claimingCountry,
          nonClaimingCountry,
        );

        expect(result).to.be.false;
      });
    });
  });

  describe('getGeometryIds', () => {
    const geometryKeyField = 'loc_id';
    const topojson = {
      objects: {
        foo: {
          geometries: [{ [geometryKeyField]: 1 }, { [geometryKeyField]: 2 }],
        },
        bar: {
          geometries: [{ [geometryKeyField]: 3 }, { [geometryKeyField]: 4 }],
        },
      },
    };

    const props = {
      geometryKeyField,
    };

    it('returns identifying ids of geometries in topojson given all layers', () => {
      const layers = [{ name: 'foo' }, { name: 'bar' }];
      expect(Map.prototype.getGeometryIds.call({ props }, topojson, layers))
        .to.have.length(4)
        .and.to.include.members([1, 2, 3, 4]);
    });

    it('returns identifying ids of geometries in topojson given a subset of layers', () => {
      const layers = [{ name: 'bar' }];
      expect(Map.prototype.getGeometryIds.call({ props }, topojson, layers))
        .to.have.length(2)
        .and.to.include.members([3, 4])
        .and.to.not.include.members([1, 2]);
    });
  });

  describe('composition', () => {
    const keyField = 'loc_id';
    const valueField = 'mean';

    // A----DISPUTE----B----C
    const topojson = {
      type: 'Topology',
      objects: {
        collection: {
          type: 'GeometryCollection',
          geometries: [
            {
              type: 'LineString',
              arcs: [0],
              properties: {
                [keyField]: 1
              },
            },
            {
              type: 'LineString',
              arcs: [2],
              properties: {
                [keyField]: 2
              },
            },
            {
              type: 'LineString',
              arcs: [3],
              properties: {
                [keyField]: 3
              },
            },
          ]
        },
        collection_disputes: {
          type: 'GeometryCollection',
          geometries: [
            {
              type: 'LineString',
              arcs: [1],
              properties: {
                claimants: ['1', '2'],
                admins: ['4'],
              },
            },
          ],
        },
      },
      arcs: [
        [[0, 0], [1, 0]],
        [[1, 0], [2, 0]],
        [[3, 0], [4, 0]],
        [[5, 0], [6, 0]],
      ]
    };

    const data = [
      {
        [keyField]: 1,
        [valueField]: 10,
      },
      {
        [keyField]: 2,
        [valueField]: 15,
      },
      {
        [keyField]: 3,
        [valueField]: 20,
      },
    ];

    const noop = () => {};

    it('composes a choropleth and choropleth legend', () => {
      const wrapper = shallow(
        <Map
          data={data}
          domain={[10, 20]}
          geometryKeyField={(f) => `${f.properties[keyField]}`}
          keyField={keyField}
          onSliderMove={noop}
          onResetScale={noop}
          topojsonObjects={['collection']}
          topology={topojson}
          valueField={valueField}
        />
      );

      ['Choropleth', 'ChoroplethLegend'].forEach(component => {
        expect(wrapper.find(component)).to.be.present();
      });
    });

    it('renders a choropleth with a feature layer for all object collections', () => {
      const topoObjects = ['collection', 'collection_disputes'];
      const wrapper = shallow(
        <Map
          data={data}
          domain={[10, 20]}
          geometryKeyField={(f) => `${f.properties[keyField]}`}
          keyField={keyField}
          onSliderMove={noop}
          onResetScale={noop}
          topojsonObjects={topoObjects}
          topology={topojson}
          valueField={valueField}
        />
      );

      expect(wrapper.find('Choropleth').dive().find('FeatureLayer')).to.have.length(topoObjects.length);
    });

    it('renders mesh layers for disputed borders, non-disputed borders, and selected borders', () => {
      const wrapper = shallow(
        <Map
          data={data}
          domain={[10, 20]}
          geometryKeyField={(f) => `${f.properties[keyField]}`}
          keyField={keyField}
          onSliderMove={noop}
          onResetScale={noop}
          topojsonObjects={['collection', 'collection_disputes']}
          topology={topojson}
          valueField={valueField}
        />
      );

      expect(wrapper.find('Choropleth').dive().find('Path')
        .filterWhere(n => n.parent().not('FeatureLayer'))).to.have.length(3);
    });
  });
});
