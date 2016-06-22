import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import forEach from 'lodash/forEach';

import { calcLabelPosition } from '../src/utils';

chai.use(chaiEnzyme());

describe('calcLabelPosition', () => {
  const props = {
    translate: { x: 50, y: 50 },
    padding: { top: 50, bottom: 50, left: 50, right: 50 },
  };
  const center = 25;

  const expectedResults = {
    top: { x: 50, y: 0, dX: 25, dY: '1em' },
    bottom: { x: 50, y: 100, dX: 25, dY: '-0.2em' },
    left: { x: 50, y: 0, dX: -25, dY: '1em', rotate: 270 },
    right: { x: 50, y: -100, dX: 25, dY: '1em', rotate: 90 },
    undefined: { x: 50, y: 50, dX: 0, dY: 0 },
  };

  forEach(['top', 'bottom', 'left', 'right'], (orientation) => {
    it(`calculates a label position for \`${orientation}\` orientation`, () => {
      const labelPosition = calcLabelPosition({ ...props, orientation }, center);

      expect(labelPosition).to.deep.equal(expectedResults[orientation]);
    });
  });

  it('returns the current translate for unsupported orientation', () => {
    const orientation = undefined;
    const labelPosition = calcLabelPosition({ ...props, orientation }, center);

    expect(labelPosition).to.deep.equal(expectedResults[orientation]);
  });
});
