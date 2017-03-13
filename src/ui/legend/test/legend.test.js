import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';

chai.use(chaiEnzyme());

import Legend from '../';

describe('<Legend />', () => {
  const labelKey = 'label';
  const shapeColorKey = 'shapeColor';
  const shapeTypeKey = 'shapeType';
  const items = Array(5).fill(1).map((_, idx) => {
    return {
      [labelKey]: idx,
      [shapeColorKey]: 'red',
      [shapeTypeKey]: 'square'
    };
  });

  it('renders an empty ul if given no legend items', () => {
    [{ items: [], }, { items: (void 0) }, { items: {} }].forEach((test) => {
      const wrapper = shallow(<Legend items={test.items} />);
      expect(wrapper.find('ul')).to.be.blank();
    });
  });

  it('renders a title given a string title', () => {
    const title = 'A random title';
    const wrapper = mount(<Legend items={items} labelKey={labelKey} title={title} />);
    expect(wrapper).to.have.descendants('h3');
    expect(wrapper.find('h3')).to.have.text(title);
  });

  it('renders a title given a custom renderer', () => {
    /* eslint-disable react/prop-types */
    const title = 'Asdf';

    function CustomComponent(props) {
      return (<h1>{props.title}!</h1>);
    }

    const wrapper = mount(
      <Legend
        items={items}
        labelKey={labelKey}
        title={title}
        TitleComponent={CustomComponent}
      />
    );
    expect(wrapper.find('h1')).to.have.text(`${title}!`);
    expect(wrapper).to.not.have.descendants('h3');
  });

  it('renders a title element with a class name supplied as a string', () => {
    /* eslint-disable react/prop-types */
    const title = 'Some title';
    const className = 'legend__title--classy';
    const wrapper = mount(
      <Legend
        items={items}
        labelKey={labelKey}
        title={title}
        titleClassName={className}
      />
    );
    expect(wrapper.find('h3')).to.have.className(className);
  });

  it('renders a title element with one or more class names supplied as an array', () => {
    /* eslint-disable react/prop-types */
    const title = 'Some title';
    const classNames = ['legend__title--classy', 'legend__title--unclassy'];
    const wrapper = mount(
      <Legend
        items={items}
        labelKey={labelKey}
        title={title}
        titleClassName={classNames}
      />
    );
    for (const name of classNames) {
      expect(wrapper.find('h3')).to.have.className(name);
    }
  });

  it('renders a title element with one or more class names supplied as keys in an object', () => {
    /* eslint-disable react/prop-types */
    const title = 'Some title';
    const classNames = {
      'legend__title--classy': true,
      'legend__title--unclassy': true,
    };
    const wrapper = mount(
      <Legend
        items={items}
        labelKey={labelKey}
        title={title}
        titleClassName={classNames}
      />
    );
    for (const name of Object.keys(classNames)) {
      expect(wrapper.find('h3')).to.have.className(name);
    }
  });

  it('renders a list of items with the default LegendItem', () => {
    const wrapper = mount(<Legend items={items} labelKey={labelKey} />);
    expect(wrapper.find('ul')).to.have.exactly(items.length).descendants('li');
  });

  it('renders a list of items with a custom item renderer', () => {
    /* eslint-disable react/prop-types */
    function Item(props) {
      return <li key={Math.random()}>{props.item[props.labelKey]}!</li>;
    }

    const wrapper = mount(<Legend items={items} ItemComponent={Item} labelKey={labelKey} />);
    expect(wrapper.find('ul')).to.have.exactly(items.length).descendants('li');
  });

  it('adds an additional class to the outer most wrapper', () => {
    const wrapper = shallow(<Legend items={items} wrapperClassName="foobar" labelKey={labelKey} />);
    expect(wrapper).to.have.className('foobar');
  });

  it('adds an additional class to the ul', () => {
    const wrapper = shallow(<Legend items={items} ulClassName="barfoo" labelKey={labelKey} />);
    expect(wrapper.find('ul')).to.have.className('barfoo');
  });
});
