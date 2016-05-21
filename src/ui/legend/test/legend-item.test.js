/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());

import LegendItem from '../src/legend-item';
import { Symbol } from '../../shape';

describe('<LegendItem />', () => {
  const item = {
    estimateStage: 'GBD final',
    symbol: {
      color: 'red',
      type: 'circle'
    }
  };

  it('accepts a labelKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} labelKey="estimateStage" />);
    expect(wrapper.find('text')).to.have.text('GBD final');
  });

  it('accepts a labelKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.estimateStage;
    });

    const wrapper = shallow(<LegendItem item={item} labelKey={spy} />);
    expect(wrapper.find('text')).to.have.text('GBD final');
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('accepts a symbolTypeKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} symbolTypeKey="symbol.type" />);
    expect(wrapper).to.contain(<Symbol type="circle" />);
  });

  it('accepts a symbolTypeKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.symbol.type;
    });
    const wrapper = shallow(<LegendItem item={item} symbolTypeKey={spy} />);

    expect(wrapper).to.contain(<Symbol type="circle" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('accepts a symbolColorKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} symbolColorKey="symbol.color" />);
    expect(wrapper).to.contain(<Symbol color="red" />);
  });

  it('accepts a symbolColorKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.symbol.color;
    });
    const wrapper = shallow(<LegendItem item={item} symbolColorKey={spy} />);

    expect(wrapper).to.contain(<Symbol color="red" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });
});
