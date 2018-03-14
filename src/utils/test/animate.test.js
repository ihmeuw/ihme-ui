import { expect } from 'chai';
import noop from 'lodash/noop';
import forEach from 'lodash/forEach';
import intersection from 'lodash/intersection';
import sinon from 'sinon';

import {
  animationStartFactory,
  animationProcessorFactory,
} from '../';

describe('animate factory functions', () => {
  const animatableAttrs = [
    'fill',
    'x',
    'y',
  ];

  const inputDatum = {
    data: {
      fill: 'before fill is computed to #ccc',
      x: 0,
      y: 0,
    },
    state: {
      nonAnimatableProp: 'I should not be tampered with!',
      fill: '#ccc',
      x: 1,
      y: 1,
    },
  };

  const animationMethodNames = [
    'start',
    'enter',
    'update',
    'leave',
  ];

  function runBoilerPlateTests(scenario, animate) {
    describe(`Common tests between 'animate' scenarios (${scenario})`, () => {

      const animationProcessor = animationProcessorFactory.bind(
        null,
        animate,
        animatableAttrs,
      );

      const [
        animationStartMethod,
        animationEnterMethod,
        animationUpdateMethod,
        animationLeaveMethod,
      ] = animationMethodNames.map(animationProcessor);

      const animationMethods = [
        // (animationStartMethod) is an initialization;
        // it does not contain animation properties.
        animationEnterMethod,
        animationUpdateMethod,
        animationLeaveMethod,
      ];

      describe(`defaults of animation \`start\` method (${scenario})`, () => {
        const outputDatum = animationStartMethod(inputDatum);

        it(`outputs an object (start method) equal to input\'s `state` property.`, () => {
          expect(outputDatum).to.deep.equal(inputDatum.state);
        });

        it('does not wrap any values in arrays', () => {
          Object.keys(outputDatum).forEach(key => {
            expect(outputDatum[key]).to.not.be.an('Array');
          });
        });

        it(`'animationStartMethod' should have the same functionality as calling
      'animationStartFactory' directly.`, () => {
          const outputDatumFromAnimationStartFactory = animationStartFactory(animate)(inputDatum);
          expect(outputDatum).to.deep.equal(outputDatumFromAnimationStartFactory);
        });
      });
    });
  }

  describe('Default functionality (`animate` param is boolean):', () => {
    const animate = true;

    const animationProcessor = animationProcessorFactory.bind(
      null,
      animate,
      animatableAttrs,
    );

    const [
      animationStartMethod,
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ] = animationMethodNames.map(animationProcessor);

    const animationMethods = [
      // (animationStartMethod) is an initialization;
      // it does not contain animation properties.
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ];

    describe('defaults of animation `start` method', () => {
      const outputDatum = animationStartMethod(inputDatum);

      it('outputs an object (start method) equal to input\'s `state` property.', () => {
        expect(outputDatum).to.deep.equal(inputDatum.state);
      });

      it('does not wrap any values in arrays', () => {
        Object.keys(outputDatum).forEach(key => {
          expect(outputDatum[key]).to.not.be.an('Array');
        });
      });

      it(`'animationStartMethod' should have the same functionality as calling
      'animationStartFactory' directly.`, () => {
        const outputDatumFromAnimationStartFactory = animationStartFactory(animate)(inputDatum);
        expect(outputDatum).to.deep.equal(outputDatumFromAnimationStartFactory);
      });
    });

    describe('defaults of animation methods `enter`, `update`, `leave`', () => {
      animationMethods.forEach((animationMethod, index) => {
        const outputDatum = animationMethod(inputDatum);
        it(`outputs an array of objects (${animationMethodNames[index + 1]})`, () => {
          expect(outputDatum).to.be.an('Array');
          outputDatum.forEach(outputDatumObject => {
            expect(outputDatumObject).to.be.an('Object');
          });
        });

        it('does not wrap non-animatable props in an array', () => {
          outputDatum.forEach(outputDatumObject => {
            if (outputDatumObject.nonAnimatableProp) {
              expect(outputDatumObject.nonAnimatableProp).not.to.be.an('Array');
              expect(outputDatumObject.nonAnimatableProp).to.be.a('string');
            }
          });
        });

        it('does not assign `events` or `timing` properties as a default', () => {
          outputDatum.forEach(outputDatumObject => {
            expect(outputDatumObject.events).to.be.equal(undefined);
            expect(outputDatumObject.timing).to.equal(undefined);
          });
        });
      });
    });
  });

  describe('Functionality when providing `timing` or `events` to `animate` root:', () => {
    const animate = {
      events: {
        end: noop,
      },
      timing: {
        delay: 3000,
        duration: 1000,
      },
    };

    const animationProcessor = animationProcessorFactory.bind(
      null,
      animate,
      animatableAttrs,
    );

    const [
      animationStartMethod,
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ] = animationMethodNames.map(animationProcessor);

    const animationMethods = [
      // (animationStartMethod) is an initialization;
      // it does not contain animation properties.
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ];

    describe('root `events`, `timing` don\'t affect animation `start` method', () => {
      const outputDatum = animationStartMethod(inputDatum);

      it('outputs an object (start method) equal to input\'s `state` property.', () => {
        expect(outputDatum).to.deep.equal(inputDatum.state);
      });

      it('does not wrap any values in arrays', () => {
        Object.keys(outputDatum).forEach(key => {
          expect(outputDatum[key]).to.not.be.an('Array');
        });
      });

      it(`'animationStartMethod' should have the same functionality as calling
      'animationStartFactory' directly.`, () => {
        const outputDatumFromAnimationStartFactory = animationStartFactory(animate)(inputDatum);
        expect(outputDatum).to.deep.equal(outputDatumFromAnimationStartFactory);
      });
    });

    describe(`'events' and 'timing' properties should be applied to 
    'enter', 'update', 'leave'`, () => {
      animationMethods.forEach((animationMethod, index) => {
        const outputDatum = animationMethod(inputDatum);

        it(`outputs an array of objects (${animationMethodNames[index + 1]})`, () => {
          expect(outputDatum).to.be.an('Array');
          outputDatum.forEach(outputDatumObject => {
            expect(outputDatumObject).to.be.an('Object');
          });
        });

        it(`${animationMethodNames[index + 1]} appropriately applies root 
        'events', 'timing'`, () => {
          outputDatum.forEach(outputDatumObject => {
            if (outputDatumObject.hasOwnProperty('nonAnimatableProp')) {
              it('does not contain `events` or `timing` for non-animatable props.', () => {
                expect(outputDatumObject.events).to.equal(undefined);
                expect(outputDatumObject.timing).to.equal(undefined);
              });
            } else {
              it('overrides `events` and `timing` properties when appropriate', () => {
                expect(outputDatumObject.events).to.deep.equal(animate.events);
                expect(outputDatumObject.timing).to.deep.equal(animate.timing);
              });
            }
          });
        });
      });
    });
  });

  describe('Nested animation instructions should be applied independently of root, peers:', () => {
    const fillUpdateReturnValue = {
      fill: ['I am a nested fill value!'],
      timing: {
        delay: 100,
      }
    };
    const xLeaveReturnValue = {
      x: [100],
      events: {
        end: sinon.spy(),
      }
    };
    const yStartReturnValue = {
      y: [0],
      timing: {
        delay: 100,
      }
    };

    const spyMap = {
      fill: { spy: sinon.spy(() => fillUpdateReturnValue) },
      x: { spy: sinon.spy(() => xLeaveReturnValue) },
      y: { spy: sinon.spy(() => yStartReturnValue) },
    };

    const animate = {
      fill: {
        enter: spyMap.fill.spy,
        timing: {
          duration: 200,
        },
      },
      x: {
        leave: spyMap.x.spy,
        events: {
          interrupt: noop,
        },
      },
      y: {
        start: spyMap.y.spy,
        timing: {
          delay: 500,
        }
      },
      events: {
        end: noop,
      },
      timing: {
        delay: 300,
        duration: 400,
      },
    };

    const animationProcessor = animationProcessorFactory.bind(
      null,
      animate,
      animatableAttrs,
    );

    const [
      animationStartMethod,
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ] = animationMethodNames.map(animationProcessor);

    const animationMethods = [
      // (animationStartMethod) is an initialization;
      // it does not contain animation properties.
      animationEnterMethod,
      animationUpdateMethod,
      animationLeaveMethod,
    ];

    beforeEach(() => {
      forEach(spyMap, (spyConfig) => {
        spyConfig.spy.reset();
      });
    });

    describe('Nested animation properties', () => {
      animationMethods.forEach(animationMethod => {
        const outputDatum = animationMethod(inputDatum);

        it('each output datum only contains one attr.', () => {
          outputDatum.forEach(outputDatumObject => {
            if (outputDatumObject.hasOwnProperty('nonAnimatableProp')) {
              animatableAttrs.forEach(animatableAttr => {
                expect(outputDatumObject[animatableAttr]).to.equal(undefined);
              });
            } else {
              const shouldBeOne = intersection(
                animatableAttrs,
                Object.keys(outputDatumObject)
              );
              expect(shouldBeOne.length).to.equal(1);
            }
          });
        });
      });
    });

    describe('overrides/includes properties (`fill.enter` animation attribute)', () => {
      const outputEnterData = animationEnterMethod(inputDatum, 100);
      const [fillOutputDatum] = outputEnterData.filter(datum => datum.fill);

      it('overrides less-nested animation properties if overridden', () => {
        expect(fillOutputDatum.timing).to.equal(fillUpdateReturnValue.timing);
        expect(fillOutputDatum.fill).to.equal(fillUpdateReturnValue.fill);
      });

      it('includes less-nested animation properties if not overridden', () => {
        expect(fillOutputDatum.timing).to.equal(fillUpdateReturnValue.timing);
        expect(fillOutputDatum.fill).to.equal(fillUpdateReturnValue.fill);
      });
    });

    describe('Confirm given `animate` methods are called with expected args', () => {
      const spyDatum = {
        data: {
          fill: 'before fill is computed to #ccc',
          x: 100,
          y: 100,
        },
        state: {
          nonAnimatableProp: 'I should not be tampered with!',
          fill: '#fff',
          x: 101,
          y: 101,
        },
      };

      const testIndex = 1000;

      it('calls `fill.enter`', () => {
        animationEnterMethod(spyDatum, testIndex);

        const [
          spyCallValue,
          spyCallRawDatum,
          spyCallIndex,
        ] = spyMap.fill.spy.getCall(0).args;

        expect(spyMap.fill.spy.called).to.be.true;
        expect(spyCallValue).to.equal(spyDatum.state.fill);
        expect(spyCallRawDatum).to.deep.equal(spyDatum.data);
        expect(spyCallIndex).to.deep.equal(testIndex);
      });

      it('calls `x.leave`', () => {
        animationLeaveMethod(spyDatum, testIndex);

        const [
          spyCallValue,
          spyCallRawDatum,
          spyCallIndex,
        ] = spyMap.x.spy.getCall(0).args;

        expect(spyMap.x.spy.called).to.be.true;
        expect(spyCallValue).to.equal(spyDatum.state.x);
        expect(spyCallRawDatum).to.deep.equal(spyDatum.data);
        expect(spyCallIndex).to.deep.equal(testIndex);
      });

      it('calls `y.start`', () => {
        animationStartMethod(spyDatum, testIndex);

        const [
          spyCallValue,
          spyCallRawDatum,
          spyCallIndex,
        ] = spyMap.x.spy.getCall(0).args;

        expect(spyMap.x.spy.called).to.be.true;
        expect(spyCallValue).to.equal(spyDatum.state.y);
        expect(spyCallRawDatum).to.deep.equal(spyDatum.data);
        expect(spyCallIndex).to.deep.equal(testIndex);
      });
    });
  });
});
