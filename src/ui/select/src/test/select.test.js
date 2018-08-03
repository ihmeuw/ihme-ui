import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';

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

  let singleSelectWrapper;
  let multiSelectWrapper;

  beforeEach(() => {
    singleSelectWrapper = mount(
      <Select
        {...baseProps}
        value={null}
      />
    );

    multiSelectWrapper = mount(
      <Select
        {...baseProps}
        value={[]}
        multi
      />
    );
  });

  it('applies single-select classname', () => {
    expect(singleSelectWrapper).to.have.className(styles['single-select']);
  });

  it('uses placeholder text in div element for single select', () => {
    expect(singleSelectWrapper.find('.Select-placeholder')).to.have.length(1);
    expect(singleSelectWrapper.find('.Select-placeholder')
      .at(0).html()).to.equal('<div class="Select-placeholder">Add/Remove...</div>');
  });

  it('applies multi-select classname', () => {
    expect(multiSelectWrapper).to.have.className(styles['multi-select']);
  });

  it('uses placeholder text in input element for multi select', () => {
    expect(multiSelectWrapper.find('input')).to.have.length(1);
    expect(multiSelectWrapper.find('input')
      .at(0).props().placeholder).to.equal('Add/Remove... (0)');
  });
});
