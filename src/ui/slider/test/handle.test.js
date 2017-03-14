import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Handle from '../src/handle';

chai.use(chaiEnzyme());

describe('<Handle />', () => {
  const onMove = sinon.spy();

  it('creates a handle with expected style', () => {
    const wrapper = mount(
      <Handle
        label={1}
        name={'low'}
        onMove={onMove}
        position={0}
        snapTarget={{ x: 1 }}
      />
    );
    expect(wrapper.instance().state.style).to.deep.equal({ left: '0px' });
    wrapper.setProps({ position: 1 });
    expect(wrapper.instance().state.style).to.deep.equal({ left: '1px' });
  });

  it('changes style when passed a new style object', () => {
    const wrapper = mount(
      <Handle
        label={1}
        name={'low'}
        onMove={onMove}
        position={0}
        snapTarget={{ x: 1 }}
        style={{ opacity: 1 }}
      />
    );
    expect(wrapper.instance().state.style).to.have.property('opacity', 1);
    wrapper.setProps({ style: { opacity: 0.5 } });
    expect(wrapper.instance().state.style).to.have.property('opacity', 0.5);
  });
});
