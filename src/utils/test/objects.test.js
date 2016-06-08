/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { propResolver, quickMerge } from '../';

describe('object utilities', () => {
  describe('propResolver', () => {
    const obj = {
      foo: 'bar'
    };

    it('calls a function with the given object', () => {
      const resolver = (item) => { return item.foo; };
      expect(propResolver(obj, resolver)).to.equal('bar');
    });

    it('performs basic object access if not given a string', () => {
      expect(propResolver(obj, 'foo')).to.equal('bar');
    });
  });

  describe('quickMerge', () => {
    const source1 = {
      key1: {
        key1_1: 'value1_1',
      },
      key2: {
        key2_1: 'value2_1',
      },
    };

    const source2 = {
      key1: {
        key1_2: 'value1_2',
      },
    };

    const source3 = {
      key2: {
        key2_1: 'value2_X',
      },
    };

    it('merges objects without clobbering the first level keys', () => {
      const target = {};
      const expected = {
        key1: {
          key1_1: 'value1_1',
          key1_2: 'value1_2',
        },
        key2: {
          key2_1: 'value2_1',
        },
      };
      const result = quickMerge(target, source1, source2);
      expect(result).to.deep.equal(expected);
      expect(target).to.deep.equal(expected);
    });

    it('merges objects and overwrites second level keys', () => {
      const target = {};
      const expected = {
        key1: {
          key1_1: 'value1_1',
          key1_2: 'value1_2',
        },
        key2: {
          key2_1: 'value2_X',
        },
      };
      const result = quickMerge(target, source1, source2, source3);
      expect(result).to.deep.equal(expected);
      expect(target).to.deep.equal(expected);
    });
  });
});
