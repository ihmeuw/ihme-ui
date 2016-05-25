/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());

import LegendItem from '../src/legend-item';
import { Symbol } from '../../shape';
import itemStyle from '../src/legend-item.css';

describe('<LegendItem />', () => {
  const item = {
    estimateStage: 'GBD final',
    symbolColor: 'red',
    symbolType: 'triangle',
    arbitraryField: 456
  };

  const mockEvent = {
    preventDefault() {},
    stopPropagation() {}
  };

  it('accepts a labelKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} labelKey="estimateStage" />);
    expect(wrapper.find('span')).to.have.text('GBD final');
  });

  it('accepts a labelKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.estimateStage;
    });

    const wrapper = shallow(<LegendItem item={item} labelKey={spy} />);
    expect(wrapper.find('span')).to.have.text('GBD final');
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
      return <span id="custom">{props.item.arbitraryField}</span>;
    }
    /* eslint-enable react/prop-types */

    const wrapper = shallow(<LegendItem item={item} labelRenderer={CustomComponent} />);
    const textNode = wrapper.find('span').first();
    console.log(textNode);
    expect(textNode).to.have.descendants('span');
    console.log(textNode.find('#custom'));
    expect(textNode.find('#custom')).to.have.text(String(item.arbitraryField));
  });

  it('renders a "clear" icon when renderClear is truthy', () => {
    const wrapper = shallow(<LegendItem item={item} renderClear />);
    expect(wrapper).to.have.descendants('span');
  });

  it('does not render a "clear" icon when renderClear is falsey', () => {
    const wrapper = shallow(<LegendItem item={item} />);
    expect(wrapper).to.not.have.descendants(`.${itemStyle.clear}`);
  });

  it('calls onClick with event and item', () => {
    const spy = sinon.spy();

    const wrapper = shallow(<LegendItem item={item} onClick={spy} />);
    expect(spy.called).to.be.false;
    wrapper.find('div').simulate('click', mockEvent);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(mockEvent, item)).to.be.true;
  });

  it('calls onClear with event and item', () => {
    const spy = sinon.spy();

    const wrapper = shallow(<LegendItem item={item} renderClear onClear={spy} />);
    expect(spy.called).to.be.false;
    wrapper.find('svg').first().simulate('click', mockEvent);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(mockEvent, item)).to.be.true;
  });
});
