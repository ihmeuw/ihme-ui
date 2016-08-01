import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

chai.use(chaiEnzyme());

import Tooltip from '../src/tooltip';

describe('<Tooltip />', () => {
  describe('basic behavior', () => {
    it('does not render if props.show is false', () => {
      const wrapper = shallow(<Tooltip show={false} />);
      expect(wrapper.type()).to.equal(null);
    });

    it('renders if props.show is true', () => {
      const wrapper = shallow(<Tooltip show />);
      expect(wrapper.type()).to.equal('div');
    });
  });

  describe('position', () => {
    const baseParams = {
      height: 100,
      mouseClientX: 300,
      mouseClientY: 300,
      offsetX: 0,
      offsetY: 0,
      paddingX: 10,
      paddingY: 10,
      width: 100,
      windowInnerHeight: 600,
      windowInnerWidth: 1200,
    };

    it('positions the tooltip centered around mouseClientX', () => {
      expect(Tooltip.getPosition(baseParams))
        .to.be.an('object')
        .with.property('left', 250);
    });

    it('positions the tooltip offsetY above/below from mouseClientY', () => {
      // above
      expect(Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: 25 })))
        .to.be.an('object')
        .with.property('top', 175);

      // below
      expect(Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: -25 })))
        .to.be.an('object')
        .with.property('top', 325);
    });

    it('shifts the tooltip offsetX pixels in the x-direction', () => {
      const assertions = [
        {
          params: {
            offsetX: 10
          },
          expectation: (position) => {
            expect(position.left).to.equal(260);
          },
        },
        {
          params: {
            offsetX: 0
          },
          expectation: (position) => {
            expect(position.left).to.equal(250);
          },
        },
        {
          params: {
            offsetX: -10
          },
          expectation: (position) => {
            expect(position.left).to.equal(240);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          Object.assign({}, baseParams, assert.params)
        ));
      });
    });

    it('shifts the tooltip offsetY pixels in the y-direction', () => {
      const assertions = [
        {
          params: {
            offsetY: 10
          },
          expectation: (position) => {
            expect(position.top).to.equal(190);
          },
        },
        {
          params: {
            offsetY: 0
          },
          expectation: (position) => {
            expect(position.top).to.equal(200);
          },
        },
        {
          params: {
            offsetY: -10
          },
          expectation: (position) => {
            expect(position.top).to.equal(310);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          Object.assign({}, baseParams, assert.params)
        ));
      });
    });

    it('guards placement of the tooltip within the bounds of the window (x-direction)', () => {
      const assertions = [
        {
          params: {
            mouseClientX: 25,
          },
          expectation: (position) => {
            expect(position.left).to.equal(10);
          },
        },
        {
          params: {
            mouseClientX: 25,
            paddingX: 50,
          },
          expectation: (position) => {
            expect(position.left).to.equal(50);
          },
        },
        {
          params: {
            mouseClientX: 1175,
          },
          expectation: (position) => {
            expect(position.left).to.equal(1125);
          },
        },
        {
          params: {
            mouseClientX: 1000,
            offsetX: 200,
          },
          expectation: (position) => {
            expect(position.left).to.equal(1090);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          Object.assign({}, baseParams, assert.params)
        ));
      });
    });

    it('guards placement of the tooltip within the bounds of the window (y-direction)', () => {
      const assertions = [
        {
          params: {
            mouseClientY: 25,
            offsetY: 0,
            paddingY: 10,
          },
          expectation: (position) => {
            expect(position.top).to.equal(10);
          },
        },
        {
          params: {
            mouseClientY: 25,
            offsetY: 0,
            paddingY: 50,
          },
          expectation: (position) => {
            expect(position.top).to.equal(50);
          },
        },
        {
          params: {
            mouseClientY: 550,
            offsetY: -10,
          },
          expectation: (position) => {
            expect(position.top).to.equal(490);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          Object.assign({}, baseParams, assert.params)
        ));
      });
    });
  });
});
