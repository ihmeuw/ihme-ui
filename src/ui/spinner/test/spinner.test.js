import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Spinner from '../src/spinner';
import styles from '../src/spinner.css';

chai.use(chaiEnzyme());

describe('<Spinner />', () => {
  it('renders a div with three span elements', () => {
    const wrapper = shallow(<Spinner />);
    expect(wrapper).to.have.length(1);
    expect(wrapper).to.have.tagName('div');
    expect(wrapper).to.have.exactly(3).descendants('svg');
  });

  it('renders inline', () => {
    const wrapper = shallow(<Spinner inline />);
    expect(wrapper).to.have.className(styles.spinner);
    expect(wrapper).to.have.className(styles['inline-spinner']);
  });

  it('takes an arbitrary classname', () => {
    const wrapper = shallow(<Spinner className="foobar" />);
    expect(wrapper).to.have.className('foobar');
  });
});
