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
    symbolColor: 'red',
    symbolType: 'triangle',
    arbitraryField: 456
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
    const wrapper = shallow(<LegendItem item={item} symbolTypeKey="symbolType" />);
    expect(wrapper).to.contain(<Symbol type="triangle" />);
  });

  it('accepts a symbolTypeKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.symbolType;
    });
    const wrapper = shallow(<LegendItem item={item} symbolTypeKey={spy} />);

    expect(wrapper).to.contain(<Symbol type="triangle" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('accepts a symbolColorKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} symbolColorKey="symbolColor" />);
    expect(wrapper).to.contain(<Symbol color="red" />);
  });

  it('accepts a symbolColorKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.symbolColor;
    });
    const wrapper = shallow(<LegendItem item={item} symbolColorKey={spy} />);

    expect(wrapper).to.contain(<Symbol color="red" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('renders a custom label component', () => {
    /* eslint-disable react/prop-types */
    // a custom label component is called with the item object
    function CustomComponent(props) {
      return <tspan>{props.item.arbitraryField}</tspan>;
    }
    /* eslint-enable react/prop-types */

    const wrapper = shallow(<LegendItem item={item} labelRenderer={CustomComponent} />);
    const textNode = wrapper.find('text');
    expect(textNode).to.have.descendants('tspan');
    expect(textNode.find('tspan')).to.have.text(String(item.arbitraryField));
  });
});
