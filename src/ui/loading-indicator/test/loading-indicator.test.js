import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import LoadingIndicator from '../';
import styles from '../src/loading-indicator.css';

chai.use(chaiEnzyme());

describe('<LoadingIndicator />', () => {
  it('renders a div with three span elements', () => {
    const wrapper = shallow(<LoadingIndicator />);
    expect(wrapper).to.have.length(1);
    expect(wrapper).to.have.tagName('div');
    expect(wrapper).to.have.exactly(3).descendants('svg');
  });

  it('renders inline', () => {
    const wrapper = shallow(<LoadingIndicator inline />);
    expect(wrapper).to.have.className(styles.spinner);
    expect(wrapper).to.have.className(styles['inline-spinner']);
  });

  it('takes an arbitrary classname', () => {
    const wrapper = shallow(<LoadingIndicator className="foobar" />);
    expect(wrapper).to.have.className('foobar');
  });
});
