import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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
