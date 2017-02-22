import { expect } from 'chai';

import * as props from '../props';

describe('utils.props', () => {
  describe('stateFromPropUpdates', () => {
    it('returns same state if props are not updated', () => {
      const state = {};

      const propUpdates = {
        dummy: acc => acc,
      };
      const prevProps = {};
      const nextProps = {};

      const newState = props.stateFromPropUpdates(propUpdates, prevProps, nextProps, state);

      expect(newState).to.equal(state);
    });
    it('updates a state object based on new props', () => {
      const propUpdates = {
        value: (state, key, prevProps, nextProps) => {
          if (prevProps[key] !== nextProps[key]) {
            return {
              ...state,
              position: nextProps[key] * 2,
            };
          }
          return state;
        },
      };

      const state = {};
      const expected = {
        position: 20,
      };

      const prevProps = {
        value: 0,
        color: 'red',
      };
      const nextProps = {
        value: 10,
        color: 'red',
      };

      const newState = props.stateFromPropUpdates(propUpdates, prevProps, nextProps, state);

      expect(newState).to.deep.equal(expected);
    });

    it('is called with the proper context', () => {
      const propUpdates = {
        value(accum, key, prevProps, nextProps, context) {
          /* eslint-disable no-param-reassign */
          context.a = 2;
        },
      };

      const obj = {
        a: 1,
      };

      expect(obj.a).to.equal(1);
      props.stateFromPropUpdates(propUpdates, {}, { foo: 1 }, {}, obj);
      expect(obj.a).to.equal(2);
    });

    describe('updateFunc', () => {
      it('helps update a state object based on new props', () => {
        const propUpdates = {
          value: props.updateFunc(nextProp => ({ position: nextProp * 2 })),
          color: props.updateFunc(nextProp => ({ style: { color: nextProp } })),
        };

        let state = {
          style: { color: 'blue' },
        };
        const expected = {
          position: 20,
          style: { color: 'red' },
        };

        const prevProps = {
          value: 0,
          color: 'blue',
        };
        const nextProps = {
          value: 10,
          color: 'red',
        };

        state = props.stateFromPropUpdates(propUpdates, undefined, prevProps, state);
        state = props.stateFromPropUpdates(propUpdates, prevProps, nextProps, state);
        expect(state).to.deep.equal(expected);

        state = props.stateFromPropUpdates(propUpdates, nextProps, nextProps, state);
        expect(state).to.deep.equal(expected);
      });

      it('is called with the proper context', () => {
        const obj = {
          a: 1,
        };

        const updater = props.updateFunc((prop, key, nextProps, state, context) => {
          /* eslint-disable no-param-reassign */
          context.a = 2;
        });

        expect(obj.a).to.equal(1);
        updater({}, 'foo', { }, { foo: 1 }, obj);
        expect(obj.a).to.equal(2);
      });
    });
  });
});
