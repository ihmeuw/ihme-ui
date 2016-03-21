import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import HtmlLabel from '../src/html-label';

chai.use(chaiEnzyme());

describe('<HtmlLabel/>', () => {
  it('renders a label', () => {
    const text = 'A label';
    const wrapper = shallow(<HtmlLabel text={text}><input /></HtmlLabel>);
    expect(wrapper).to.have.length(1);
    expect(wrapper).to.have.tagName('label');
    expect(wrapper).to.have.text(text);
  });

  it('renders its contained control element', () => {
    const wrapper = shallow(<HtmlLabel text="A label"><input /></HtmlLabel>);
    expect(wrapper).to.have.exactly(1).descendants('input');
  });
});
