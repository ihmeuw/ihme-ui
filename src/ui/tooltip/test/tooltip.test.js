import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

chai.use(chaiEnzyme());

import Tooltip from '../src/tooltip';

function translateVectorFromTransform(transformString) {
  return transformString.match(/(\d+)/g).map(Number);
}

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
      mouseX: 300,
      mouseY: 300,
      offsetX: 0,
      offsetY: 0,
      paddingX: 0,
      paddingY: 0,
      width: 100,
      windowInnerHeight: 600,
      windowInnerWidth: 1200,
    };

    it('positions the tooltip centered around mouseX', () => {
      const position = Tooltip.getPosition(baseParams);
      const [x] = translateVectorFromTransform(position.transform);
      expect(position)
        .to.be.an('object')
        .with.property('transform');
      expect(x).to.equal(250);
    });

    it('positions the tooltip offsetY above/below from mouseY', () => {
      // above
      const positionAbove = Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: 25 }));
      const [, yAbove] = translateVectorFromTransform(positionAbove.transform);
      expect(positionAbove)
        .to.be.an('object')
        .with.property('transform');
      expect(yAbove).to.equal(175);

      // below
      const positionBelow = Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: -25 }));
      const [, yBelow] = translateVectorFromTransform(positionBelow.transform);
      expect(positionBelow)
        .to.be.an('object')
        .with.property('transform');
      expect(yBelow).to.equal(325);
    });

    it('shifts the tooltip offsetX pixels in the x-direction', () => {
      const assertions = [
        {
          params: {
            offsetX: 10
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(260);
          },
        },
        {
          params: {
            offsetX: 0
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(250);
          },
        },
        {
          params: {
            offsetX: -10
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(240);
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
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(190);
          },
        },
        {
          params: {
            offsetY: 0
          },
          expectation: (position) => {
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(200);
          },
        },
        {
          params: {
            offsetY: -10
          },
          expectation: (position) => {
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(310);
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
            mouseX: 25,
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(25);
          },
        },
        {
          params: {
            mouseX: 25,
            paddingX: 50,
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(75);
          },
        },
        {
          params: {
            mouseX: 1175,
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(1075);
          },
        },
        {
          params: {
            mouseX: 1000,
            offsetX: 200,
          },
          expectation: (position) => {
            const [x] = translateVectorFromTransform(position.transform);
            expect(x).to.equal(700);
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
            mouseY: 25,
            offsetY: 0,
            paddingY: 10,
          },
          expectation: (position) => {
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(35);
          },
        },
        {
          params: {
            mouseY: 25,
            offsetY: 10,
            paddingY: 50,
          },
          expectation: (position) => {
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(65);
          },
        },
        {
          params: {
            mouseY: 550,
            offsetY: -10,
          },
          expectation: (position) => {
            const [, y] = translateVectorFromTransform(position.transform);
            expect(y).to.equal(440);
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
