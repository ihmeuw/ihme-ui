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

  describe('disabled', () => {
    it('props are present for children', (done) => {
      sinon.stub(Slider.prototype, 'receiveTrackWidth', (state) => ({
        ...state,
        render: true,
        scale: state.scale.range([0, 100]),
        snapTarget: { x: 100 / (state.range.length - 1) },
      }));

      const wrapper = mount(
        <Slider
          disabled
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

      setImmediate(() => {
        expect(wrapper.find('Handle').everyWhere(t => t.prop('disabled'))).to.equal(true);
        expect(wrapper.find('Track').everyWhere(t => t.prop('disabled'))).to.equal(true);
        Slider.prototype.receiveTrackWidth.restore();
        done();
      });
    });
  });
});
