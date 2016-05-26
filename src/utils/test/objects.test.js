/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { propResolver } from '../';

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
});
