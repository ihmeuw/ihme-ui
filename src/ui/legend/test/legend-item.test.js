/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());

import LegendItem from '../src/legend-item';
import { Shape } from '../../shape';
import itemStyle from '../src/legend-item.css';

describe('<LegendItem />', () => {
  const item = {
    estimateStage: 'GBD final',
    shapeColor: 'red',
    shapeType: 'triangle',
    arbitraryField: 456,
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

  it('accepts a shapeTypeKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} shapeTypeKey="shapeType" />);
    expect(wrapper).to.contain(<Shape shapeType="triangle" />);
  });

  it('accepts a shapeTypeKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.shapeType;
    });
    const wrapper = shallow(<LegendItem item={item} shapeTypeKey={spy} />);

    expect(wrapper).to.contain(<Shape shapeType="triangle" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('accepts a shapeColorKey that is a string', () => {
    const wrapper = shallow(<LegendItem item={item} shapeColorKey="shapeColor" />);
    expect(wrapper).to.contain(<Shape fill="red" />);
  });

  it('accepts a shapeColorKey that is a function that is called with the item', () => {
    const spy = sinon.spy((itemObj) => {
      return itemObj.shapeColor;
    });
    const wrapper = shallow(<LegendItem item={item} shapeColorKey={spy} />);

    expect(wrapper).to.contain(<Shape fill="red" />);
    expect(spy.called).to.be.true;
    expect(spy.calledWith(item)).to.be.true;
  });

  it('renders a custom label component', () => {
    /* eslint-disable react/prop-types */
    // a custom label component is called with the item object
    function CustomComponent(props) {
      return <span id="custom">{props.item.arbitraryField}</span>;
    }

    const wrapper = mount(<LegendItem item={item} LabelComponent={CustomComponent} />);
    const labelNode = wrapper.find('span').first();
    expect(labelNode).to.have.descendants('span');
    expect(labelNode.find('#custom')).to.have.text(String(item.arbitraryField));
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
