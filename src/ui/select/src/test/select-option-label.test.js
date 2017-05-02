import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

chai.use(chaiEnzyme());

import { FlatOptionLabel, HierarchicalOptionLabel } from '../select-option-label';

describe('<SelectOptionLabel', () => {
  describe('<FlatOptionLabel />', () => {
    it('returns the label for an option', () => {
      const props = {
        option: {
          name: 'Seattle',
        },
        labelKey: 'name',
      };
      const wrapper = shallow(<FlatOptionLabel {...props} />);

      expect(wrapper).to.have.text('Seattle');
    });

    it('returns an empty string if option[labelKey] is undefined', () => {
      const props = {
        option: {
          name: 'Seattle',
        },
        labelKey: 'other'
      };
      const wrapper = shallow(<FlatOptionLabel {...props} />);

      expect(wrapper).to.have.text('');
    });

    it('returns proper label if option[labelKey] is falsey but not undefined', () => {
      const spec = [
        { props: { option: { name: 0 }, labelKey: 'name' }, expectation: '0' },
        { props: { option: { name: false }, labelKey: 'name' }, expectation: 'false' },
        { props: { option: { name: null }, labelKey: 'name' }, expectation: 'null' },
        { props: { option: { name: '' }, labelKey: 'name' }, expectation: '' },
      ];
      spec.forEach(test => {
        const wrapper = shallow(<FlatOptionLabel {...test.props} />);
        expect(wrapper).to.have.text(test.expectation);
      });
    });
  });

  describe('<HierarchicalOptionLabel />', () => {
    it('adds marginLeft as a function of level', () => {
      const spec = [
        { expectation: `${15}px`, props: { option: { level: 3 } } },
        { expectation: `${0}px`, props: { option: { level: 0 } } },
        { expectation: `${0}px`, props: { option: { } } },
      ];

      spec.forEach((test) => {
        const wrapper = shallow(<HierarchicalOptionLabel {...test.props} />);
        expect(wrapper).to.have.style('margin-left', test.expectation);
      });
    });

    it('is bolded if option.bold is true', () => {
      const spec = [
        { expectation: 'bold', props: { option: { bold: true } } },
        { expectation: 'normal', props: { option: { bold: false } } },
        { expectation: 'normal', props: { option: { } } },
      ];

      spec.forEach((test) => {
        const wrapper = shallow(<HierarchicalOptionLabel {...test.props} />);
        expect(wrapper).to.have.style('font-weight', test.expectation);
      });
    });
  });
});
