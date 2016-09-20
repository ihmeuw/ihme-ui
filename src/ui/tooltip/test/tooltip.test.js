/* eslint-disable no-unused-expressions, max-len */
import React from 'react';
import chai, { expect } from 'chai';
import { merge } from 'lodash';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';

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

    it('updates position/style if any properties neceessary for calculating position/style is updated', () => {
      const wrapper = mount(
        <Tooltip
          bounds={{ x: [0, 1000], y: [0, 800] }}
          mouseX={5}
          mouseY={5}
          show
        />
      );
      let style = wrapper.state('style');
      Object.entries({
        bounds: {
          x: [200, 300],
          y: [600, 900],
        },
        mouseX: 20,
        mouseY: 30,
        offsetX: 5,
        offsetY: 6,
        paddingX: 20,
        paddingY: 20,
        style: { backgroundColor: 'red' },
      }).forEach(([key, value]) => {
        expect(wrapper.state('style')).to.equal(style);
        wrapper.setProps({
          [key]: value
        });
        const updatedStyle = wrapper.state('style');
        expect(updatedStyle).to.not.equal(style);
        style = updatedStyle;
      });
    });

    it('does not update style if a property not necessary for calculating styles is updated', () => {
      const wrapper = mount(
        <Tooltip
          bounds={{ x: [0, 1000], y: [0, 800] }}
          mouseX={5}
          mouseY={5}
          show
        />
      );
      const style = wrapper.state('style');
      Object.entries({
        className: 'new-class-name',
        show: false,
      }).forEach(([key, value]) => {
        expect(wrapper.state('style')).to.equal(style);
        wrapper.setProps({
          [key]: value
        });
        const nonUpdatedStyle = wrapper.state('style');
        expect(nonUpdatedStyle).to.equal(style);
      });
    });
  });

  describe('position', () => {
    const baseParams = {
      bounds: {
        x: [0, 1200],
        y: [0, 600],
      },
      height: 100,
      mouseX: 300,
      mouseY: 300,
      offsetX: 0,
      offsetY: 0,
      paddingX: 0,
      paddingY: 0,
      width: 100,
    };

    it('positions the tooltip centered around mouseX', () => {
      const position = Tooltip.getPosition(baseParams);
      const [x] = position;
      expect(position)
        .to.be.an('array')
        .to.have.length(2);
      expect(x).to.equal(250);
    });

    it('positions the tooltip offsetY above/below from mouseY', () => {
      // above
      const [, yAbove] = Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: 25 }));
      expect(yAbove).to.equal(175);

      // below
      const [, yBelow] = Tooltip.getPosition(Object.assign({}, baseParams, { offsetY: -25 }));
      expect(yBelow).to.equal(325);
    });

    it('shifts the tooltip offsetX pixels in the x-direction', () => {
      const assertions = [
        {
          params: {
            offsetX: 10
          },
          expectation: ([x]) => {
            expect(x).to.equal(260);
          },
        },
        {
          params: {
            offsetX: 0
          },
          expectation: ([x]) => {
            expect(x).to.equal(250);
          },
        },
        {
          params: {
            offsetX: -10
          },
          expectation: ([x]) => {
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
          expectation: ([, y]) => {
            expect(y).to.equal(190);
          },
        },
        {
          params: {
            offsetY: 0
          },
          expectation: ([, y]) => {
            expect(y).to.equal(200);
          },
        },
        {
          params: {
            offsetY: -10
          },
          expectation: ([, y]) => {
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

    it('guards placement of the tooltip within x-bounds', () => {
      const assertions = [
        {
          params: {
            mouseX: 25,
          },
          expectation: ([x]) => {
            expect(x).to.equal(0);
          },
        },
        {
          params: {
            mouseX: 25,
            paddingX: 50,
          },
          expectation: ([x]) => {
            expect(x).to.equal(50);
          },
        },
        {
          params: {
            mouseX: 1175,
          },
          expectation: ([x]) => {
            expect(x).to.equal(1100);
          },
        },
        {
          params: {
            mouseX: 1000,
            offsetX: 200,
          },
          expectation: ([x]) => {
            expect(x).to.equal(1100);
          },
        },
        {
          params: {
            bounds: {
              x: [400, 700],
            },
            mouseX: 200,
          },
          expectation: ([x]) => {
            expect(x).to.equal(400);
          },
        },
        {
          params: {
            bounds: {
              x: [400, 700],
            },
            mouseX: 800,
          },
          expectation: ([x]) => {
            expect(x).to.equal(600);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          merge({}, baseParams, assert.params)
        ));
      });
    });

    it('guards placement of the tooltip within y-bounds', () => {
      const assertions = [
        {
          params: {
            mouseY: 25,
            paddingY: 10,
          },
          expectation: ([, y]) => {
            expect(y).to.equal(35);
          },
        },
        {
          params: {
            mouseY: 25,
            offsetY: 10,
            paddingY: 50,
          },
          expectation: ([, y]) => {
            expect(y).to.equal(75);
          },
        },
        {
          params: {
            mouseY: 550,
            offsetY: -10,
          },
          expectation: ([, y]) => {
            expect(y).to.equal(440);
          },
        },
        {
          params: {
            bounds: {
              y: [200, 400],
            },
            mouseY: 100,
          },
          expectation: ([, y]) => {
            expect(y).to.equal(200);
          },
        },
        {
          params: {
            bounds: {
              y: [200, 400],
            },
            mouseY: 600,
          },
          expectation: ([, y]) => {
            expect(y).to.equal(300);
          },
        }
      ];

      assertions.forEach((assert) => {
        assert.expectation(Tooltip.getPosition(
          merge({}, baseParams, assert.params)
        ));
      });
    });
  });
});
