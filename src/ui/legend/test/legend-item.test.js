/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

chai.use(chaiEnzyme());

import LegendItem from '../src/legend-item';
import { Shape } from '../../shape';

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
    const spy = sinon.spy((itemObj) => itemObj.estimateStage);

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
    const spy = sinon.spy((itemObj) => itemObj.shapeType);
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
    const spy = sinon.spy((itemObj) => itemObj.shapeColor);
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

    const wrapper = shallow(<LegendItem item={item} LabelComponent={CustomComponent} />);
    expect(wrapper).to.contain(<CustomComponent item={item} />);
  });

  it('renders a "clear" icon when given an onClear func', () => {
    const wrapper = shallow(<LegendItem item={item} onClear={() => {}} />);
    expect(wrapper).to.have.descendants('li > svg');
  });

  it('does not render a "clear" icon when not given an onClear func', () => {
    const wrapper = shallow(<LegendItem item={item} />);
    expect(wrapper).to.not.have.descendants('li > svg');
  });

  describe('event handlers', () => {
    const handlers = [
      { name: 'onClick', action: 'click', selector: 'div' },
      { name: 'onClear', action: 'click', selector: 'li > svg' },
      { name: 'onMouseLeave', action: 'mouseLeave', selector: 'li' },
      { name: 'onMouseMove', action: 'mouseMove', selector: 'li' },
      { name: 'onMouseOver', action: 'mouseOver', selector: 'li' },
    ];

    handlers.forEach(handler =>
      it(`calls ${handler.name} with event, item, and instance`, () => {
        const spy = sinon.spy();
        const props = {
          [handler.name]: spy,
        };

        const wrapper = shallow(
          <LegendItem
            item={item}
            {...props}
          />
        );
        expect(spy.called).to.be.false;
        wrapper.find(handler.selector).simulate(handler.action, mockEvent);
        expect(spy.called).to.be.true;
        expect(spy.calledWith(mockEvent, item, wrapper.instance())).to.be.true;
      })
    );
  });
});
