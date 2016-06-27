import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import forEach from 'lodash/forEach';

import { calcLabelPosition, calcTranslate } from '../src/utils';

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
    it(`calculates label position for \`${orientation}\` orientation`, () => {
      expect(calcLabelPosition(orientation, props.translate, props.padding, center))
        .to.deep.equal(expectedResults[orientation]);
    });
  });

  it('returns the current translate for unsupported orientation', () => {
    const orientation = undefined;
    expect(calcLabelPosition(orientation, props.translate, props.padding, center))
      .to.deep.equal(expectedResults[orientation]);
  });
});

describe('calcTranslate', () => {
  const width = 50;
  const height = 50;

  const expectedResults = {
    top: { x: 0, y: 0 },
    bottom: { x: 0, y: 50 },
    left: { x: 0, y: 0 },
    right: { x: 50, y: 0 },
  };

  forEach(['top', 'bottom', 'left', 'right'], (orientation) => {
    it(`calculates translate for \`${orientation}\` orientation`, () => {
      expect(calcTranslate(orientation, width, height))
        .to.deep.equal(expectedResults[orientation]);
    });
  });
});
