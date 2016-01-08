import chai from 'chai';
import { percentOfRange, numFromPercent, domainFromPercent } from '../domain';
const expect = chai.expect;

describe('domain conversion helpers', () => {
  it('should convert a number within a range to a percentage of that range', () => {
    let domain = [10, 20];
    let num;

    // bounds
    num = 10;
    expect(percentOfRange(num, domain)).to.be.equal(0);

    num = 20;
    expect(percentOfRange(num, domain)).to.be.equal(1);

    // within range
    num = 13;
    expect(percentOfRange(num, domain)).to.be.equal(0.3);

    num = 17;
    expect(percentOfRange(num, domain)).to.be.equal(0.7);

    // outside of range
    num = 5;
    expect(percentOfRange(num, domain)).to.be.equal(-0.5);

    num = 25;
    expect(percentOfRange(num, domain)).to.be.equal(1.5);

    // negative nums in domain
    domain = [-100, 100];
    num = 0;
    expect(percentOfRange(num, domain)).to.be.equal(0.5);

    num = 50;
    expect(percentOfRange(num, domain)).to.be.equal(0.75);

    num = -50;
    expect(percentOfRange(num, domain)).to.be.equal(0.25);

  });
});
