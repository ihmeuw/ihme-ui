import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <Path />', () => {
  const path = 'M 100 100 L 300 100 L 200 300 z';
  let clickSpy;
  const clickHandler = (locationId) => {
    clickSpy = sinon.spy(() => { return locationId; });
    return clickSpy;
  };

  afterEach(() => {
    if (typeof clickSpy === 'function' && clickSpy.called) clickSpy.reset();
  });

  it('returns a path', () => {
    const wrapper = shallow(
      <Path
        d={path}
        locationId={6}
      />
    );

    expect(wrapper).to.have.tagName('path');
  });

  it('partially applies locationId to a given clickHandler', () => {
    const wrapper = shallow(
      <Path
        d={path}
        locationId={6}
        clickHandler={clickHandler}
      />
    );

    wrapper.simulate('click');
    expect(clickSpy.calledOnce).to.be.true;
    expect(clickSpy.returnValues[0]).to.equal(6);
  });

  it('sets strokeWidth to 2px when selected, 1px when unselected', () => {
    const wrapper = shallow(
      <Path
        d={path}
        locationId={6}
        selected
      />
    );

    expect(wrapper).to.have.style('stroke-width', '2px');
    wrapper.setProps({ selected: false });
    expect(wrapper).to.have.style('stroke-width', '1px');
  });
});
