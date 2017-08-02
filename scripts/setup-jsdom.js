import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  useAgent: 'node.js',
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// needed by interact.js
global.Element = dom.window.Element;

// needed by <Autosizer />
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
