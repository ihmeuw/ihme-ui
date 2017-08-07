import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import interact from 'interact.js';

import Track from '../src/track';
import style from '../src/slider.css';

chai.use(chaiEnzyme());

describe('<Track />', () => {
  it('looks like a track', () => {
    const wrapper = shallow(
      <Track
        snapTarget={{ x: 10 }}
      />
    );

    expect(wrapper).to.have.className(style.track);
    expect(wrapper.find('button').last()).to.have.className(style['track-click-target']);
    expect(wrapper.children()).to.have.length(1);
  });

  it('renders ticks', () => {
    const widthGetterStub = sinon.stub(Track.prototype, 'width').get(() => 50);
    const wrapper = mount(
      <Track
        ticks
      />
    );

    // ticks!
    const firstSnapTarget = { x: 10 };
    wrapper.setProps({ snapTarget: firstSnapTarget });
    const firstTicks = wrapper.state('ticks');
    expect(firstTicks).to.deep.equal([10, 20, 30, 40]);
    expect(wrapper.find('line')).to.have.length(4);

    // ticks should not change
    wrapper.setProps({ snapTarget: firstSnapTarget });
    expect(wrapper.state('ticks')).to.equal(firstTicks);

    // should get new ticks
    wrapper.setProps({ snapTarget: { x: 5 } });
    expect(wrapper.state('ticks')).to.deep.equal([5, 10, 15, 20, 25, 30, 35, 40, 45]);
    expect(wrapper.find('line')).to.have.length(9);

    wrapper.unmount();
    widthGetterStub.restore();
  });

  it('handles click events', () => {
    const onClick = sinon.spy();
    const wrapper = mount(
      <Track
        onClick={onClick}
      />
    );

    wrapper.setProps({ snapTarget: { x: 10 } });

    const target = wrapper.instance()._track;
    interact(target).fire({
      target,
      type: 'tap',
      layerX: 9,
    });
    expect(onClick.called).to.be.true;
    expect(onClick.args[0][0].snap.x).to.equal(10); // 9 snaps to 10
  });
});
