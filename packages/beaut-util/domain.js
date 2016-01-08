import { isNaN, isUndefined } from 'lodash/lang';

export const percentOfRange = function percentOfRange(num, domain) {
  const [min, max] = domain;
  return (1 / ((max - min) / (num - min)));
};

export const numFromPercent = function numFromPercent(percent, domain) {
  const [min, max] = domain;
  return min + ((max - min) * percent);
};

export const domainFromPercent = function domainFromPercent(newDomain, oldDomain, rangeExtent) {
  let x1Pct = percentOfRange(rangeExtent[0], oldDomain);
  let x2Pct = percentOfRange(rangeExtent[1], oldDomain);

  // handle division errors, if any
  if (isNaN(x1Pct) || isUndefined(x1Pct)) x1Pct = 0;
  if (isNaN(x2Pct) || isUndefined(x2Pct)) x2Pct = 1;

  return [numFromPercent(x1Pct, newDomain), numFromPercent(x2Pct, newDomain)];
};
