import { expect } from 'chai';
import { getRandomColor } from '../colors';

describe('getRandomColor()', () => {
  it('generates a random hex color', () => {
    const color = getRandomColor();
    expect(color.length).to.equal(7);
    expect(color).contains('#');
    expect(color).to.match(/^#[0-9A-F]{6}$/);
  });
});
