import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Slider from '../src/slider';

chai.use(chaiEnzyme());

describe('<Slider />', () => {
  const onChange = sinon.spy();

  it('creates expected backing list', () => {
    const wrapper = mount(
      <Slider
        range={{
          low: 1,
          high: 10,
        }}
        value={{
          low: 1,
          high: 10,
        }}
        onChange={onChange}
        fill
      />
    );
    expect(wrapper.instance().state.range).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(wrapper.instance().state.indexes).to.deep.equal({ low: 0, high: 9 });
    wrapper.setProps({ value: { low: 2, high: 10 } });
    expect(wrapper.instance().state.indexes).to.deep.equal({ low: 1, high: 9 });
  });
});
