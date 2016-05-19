import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';

chai.use(chaiEnzyme());

import ResponsiveContainer from '../';

/**
 * Until either JSDOM supports getBoundingClientRect or
 * until we move tests into a browser environment, further tests are impossible
 */
describe('<ResponsiveContainer />', () => {
  function ChildComponent() {
    return <div></div>;
  }

  it('does not render child component when its parent\'s width and/or height are 0', () => {
    const wrapper = mount(
      <div style={{ width: 0, height: 0 }}>
        <ResponsiveContainer>
          <ChildComponent />
        </ResponsiveContainer>
      </div>
    );

    expect(wrapper).to.not.contain(<ChildComponent />);
  });
});
