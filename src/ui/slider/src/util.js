import interact from 'interact.js';

export function getSnapTargetFunc(snapTarget, snapGridArgs = {}) {
  if (typeof snapTarget === 'function') {
    return snapTarget;
  } else if (typeof snapTarget === 'object') {
    return interact.createSnapGrid({
      ...snapGridArgs,
      ...snapTarget,
    });
  }
  return null;
}

export function getDimension(value) {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
}
