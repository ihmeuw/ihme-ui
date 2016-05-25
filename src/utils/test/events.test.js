/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';

import { eventHandleWrapper } from '../';

describe('events utilties', () => {
  describe('eventHandleWrapper', () => {
    const mockEvent = {
      preventDefault() {}
    };

    it('returns a function', () => {
      expect(eventHandleWrapper()).to.be.a('function');
    });

    it('calls the given callback with an event object as the first arg', () => {
      const onClick = sinon.spy();
      const wrappedOnClick = eventHandleWrapper(onClick);

      expect(onClick.called).to.be.false;
      wrappedOnClick(mockEvent);
      expect(onClick.called).to.be.true;
      expect(onClick.args[0][0]).to.equal(mockEvent);
    });

    it('calls the given callback with arbitrary args after event object', () => {
      const onClick = sinon.spy();
      const obj = { blah: 'hat' };
      const wrappedOnClick = eventHandleWrapper(onClick, 'foo', 2, obj);

      expect(onClick.called).to.be.false;
      wrappedOnClick(mockEvent);
      expect(onClick.called).to.be.true;
      expect(onClick.args[0][0]).to.equal(mockEvent);
      expect(onClick.args[0][1]).to.equal('foo');
      expect(onClick.args[0][2]).to.equal(2);
      expect(onClick.args[0][3]).to.equal(obj);
    });
  });
});
