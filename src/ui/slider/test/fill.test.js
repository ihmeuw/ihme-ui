import React from 'react';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import Fill from '../src/fill';

chai.use(chaiEnzyme());

describe('<Fill />', () => {
  it('renders a div of a given width and height and fill style', () => {
    const wrapper = shallow(
      <Fill
        width={100}
        height={4}
        style={{ backgroundColor: 'blue' }}
      />
    );
    expect(wrapper).to.have.style('width', '100px');
    expect(wrapper).to.have.style('height', '4px');
    expect(wrapper).to.have.style('background-color', 'blue');
  });

  it('renders a div of a given width and height and fill style for "right" orientation', () => {
    const wrapper = shallow(
      <Fill
        direction={'right'}
        width={100}
        height={4}
        style={{ backgroundColor: 'blue' }}
      />
    );
    expect(wrapper).to.have.style('width', 'calc(100% - 100px)');
  });
});
