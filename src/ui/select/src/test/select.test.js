import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';

import Select from '../select';
import styles from '../select.css';

chai.use(chaiEnzyme());

describe('<Select />', () => {
  const baseProps = {
    labelKey: 'name',
    onChange() {},
    options: [{ name: 'Seattle' }, { name: 'Portland' }],
    valueKey: 'name',
  };

  it('applies single-select classname', () => {
    const wrapper = shallow(
      <Select
        {...baseProps}
        value={null}
      />
    );

    expect(wrapper).to.have.className(styles['single-select']);
  });

  it('uses placeholder text in div element for single select', () => {
    const wrapper = mount(
      <Select
        {...baseProps}
        value={null}
      />
    );

    expect(wrapper.find('.Select-placeholder')).to.have.length(1);
    expect(wrapper.find('.Select-placeholder')
      .at(0).html()).to.equal('<div class="Select-placeholder">Add/Remove...</div>');
  });

  it('applies multi-select classname', () => {
    const wrapper = shallow(
      <Select
        {...baseProps}
        value={[]}
        multi
      />
    );

    expect(wrapper).to.have.className(styles['multi-select']);
  });

  it('uses placeholder text in input element for multi select', () => {
    const wrapper = mount(
      <Select
        {...baseProps}
        value={[]}
        multi
      />
    );

    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('input').at(0).props().placeholder).to.equal('Add/Remove... (0)');
  });
});
