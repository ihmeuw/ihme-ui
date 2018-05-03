/* eslint-disable no-unused-expressions, max-len */
import { expect } from 'chai';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import identity from 'lodash/identity';
import intersection from 'lodash/intersection';
import partial from 'lodash/partial';
import noop from 'lodash/noop';
import sinon from 'sinon';

import {
  animationStartFactory,
  animationProcessorFactory,
  getMethodIfExists,
} from '../';

describe('animate factory functions', () => {
  const animatableAttrs = [
    'fill',
    'x',
    'y',
  ];

  const inputDatum = {
    nonAnimatableProp: 'I should not be tampered with!',
    fill: '#ccc',
    x: 1,
    y: 1,
  };

  const animationMethodNames = [
    'start',
    'enter',
    'update',
    'leave',
  ];

  const processor = identity;

  function getAnimationMethods(animationProp) {
    const animationProcessor = partial(
      animationProcessorFactory,
      animationProp,
      animatableAttrs,
      processor,
    );

    const [
      animationStartMethod,     // `start` is a bit different than
      ...otherAnimationMethods  // `enter`, `update`, `leave`, so its ideal to keep them separate.
    ] = animationMethodNames.map(animationProcessor);

    return [animationStartMethod, otherAnimationMethods];
  }

  function runBoilerPlateStartTest(scenario, animate) {
    describe(`defaults of animation \`start\` method (${scenario})`, () => {
      const outputDatum = animationProcessorFactory(
        animate,
        animatableAttrs,
        processor,
        'start',
      )(inputDatum);

      it('outputs an object (start method) equal to input\'s processed data', () => {
        expect(outputDatum).to.deep.equal(inputDatum);
      });

      it('does not wrap any values in arrays', () => {
        Object.keys(outputDatum).forEach(key => {
          expect(outputDatum[key]).to.not.be.an('Array');
        });
      });

      it(`'animationStartMethod' should have the same functionality as calling
        'animationStartFactory' directly.`, () => {
        const outputDatumFromAnimationStartFactory = animationStartFactory(
          animate,
          processor
        )(inputDatum);
        expect(outputDatum).to.deep.equal(outputDatumFromAnimationStartFactory);
      });
    });
  }

  function runBoilerPlateTests(scenario, animationMethods) {
    describe(`Common tests between 'animate' scenarios (${scenario})`, () => {
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
        });
      });

      describe('Nested animation properties', () => {
        animationMethods.forEach(animationMethod => {
          const outputData = animationMethod(inputDatum);

          it('each output datum only contains one attr.', () => {
            outputData.forEach(datum => {
              // if datum is for a non-animatable attribute,
              // animatable properties should not be on the datum.
              if (datum.hasOwnProperty('nonAnimatableProp')) {
                animatableAttrs.forEach(attr => {
                  expect(datum[attr]).to.equal(undefined);
                });

                // datum is for exactly one animatable attribute.
              } else {
                const shouldBeExactlyOne = intersection(
                  animatableAttrs,
                  Object.keys(datum)
                );
                expect(shouldBeExactlyOne.length).to.equal(1);
              }
            });
          });
        });
      });
    });
  }

  describe('getMethodIfExists', () => {
    const methodMap = {
      fill: noop,
      stroke: {},
    };

    const foreseeableInputs = [false, true, undefined];
    const unexpectedButPossibleInputs = [1, 2, 3, 'a', 'b', 'c'];

    it('returns property when it is a function', () => {
      const method = getMethodIfExists(methodMap, 'fill');
      expect(method).to.be.a('function');
    });

    it('returns `null` when property is not a function', () => {
      const method = getMethodIfExists(methodMap, 'stroke');
      expect(method).to.equal(null);
    });

    it('gracefully handles unexpected inputs', () => {
      unexpectedButPossibleInputs.forEach((unexpectedInput) => {
        function shouldNotThrow() {
          getMethodIfExists(unexpectedInput, 'key');
        }
        expect(shouldNotThrow).to.not.throw();
      });
    });

    it('returns `null` when input is not an object', () => {
      [...foreseeableInputs, ...unexpectedButPossibleInputs].forEach((nonObjectInput) => {
        const method = getMethodIfExists(nonObjectInput, 'key');
        expect(method).to.equal(null);
      });
    });
  });

  describe('Default functionality (`animate` param is boolean):', () => {
    const animate = true;

    const [
      animationStartMethod,
      animationMethods,
    ] = getAnimationMethods(animate);

    runBoilerPlateStartTest('`animate` param is boolean', animationStartMethod);

    runBoilerPlateTests('`animate` param is boolean', animationMethods);

    animationMethods.forEach(animationMethod => {
      it('does not assign `events` or `timing` properties as a default', () => {
        const outputDatum = animationMethod(inputDatum);

        outputDatum.forEach(outputDatumObject => {
          expect(outputDatumObject.events).to.be.equal(undefined);
          expect(outputDatumObject.timing).to.equal(undefined);
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

    const [
      animationStartMethod,
      animationMethods,
    ] = getAnimationMethods(animate);

    runBoilerPlateStartTest('Complex animation configuration', animationStartMethod);

    runBoilerPlateTests(
      'Simple customized animate: `timing`, `events` defined at root.',
      animationMethods,
    );

    describe('`events` and `timing` properties should be applied to return value of: `enter`, `update`, `leave`', () => {
      animationMethods.forEach((animationMethod, index) => {
        const outputDatum = animationMethod(inputDatum);
        const methodName = animationMethodNames[index + 1]; // one is start

        describe(`${methodName} appropriately applies root 'events', 'timing'`, () => {
          outputDatum.forEach(outputDatumObject => {
            if (outputDatumObject.hasOwnProperty('nonAnimatableProp')) {
              it('does not contain `events` or `timing` for non-animatable props.', () => {
                expect(outputDatumObject.events).to.equal(undefined);
                expect(outputDatumObject.timing).to.equal(undefined);
              });
            } else {
              it('overrides `events` and `timing` properties when appropriate', () => {
                expect(outputDatumObject.events).to.equal(animate.events);
                expect(outputDatumObject.timing).to.equal(animate.timing);
              });
            }
          });
        });
      });
    });
  });

  describe('Nested animation instructions should be applied independently of root, peers:', () => {
    // Store `returnValue` in nested structure to access in assertion loops.
    const returnValues = {
      fill: {
        enter: {
          fill: ['I am a nested fill value!'],
          timing: {
            delay: 100,
          },
        },
      },
      x: {
        leave: {
          x: [100],
          events: {
            end: sinon.spy(),
          },
        },
      },
      y: {
        start: {
          y: [0],
          timing: {
            delay: 10000,
          },
        },
      },
    };

    // Store spies in nested structure to be able to traverse in assertion loops,
    // reset in before clause.
    const methodMap = {
      fill: {
        methodName: 'enter',
        spy: sinon.spy(() => returnValues.fill.enter)
      },
      x: {
        methodName: 'leave',
        spy: sinon.spy(() => returnValues.x.leave)
      },
      y: {
        methodName: 'start',
        spy: sinon.spy(() => returnValues.y.start)
      },
    };

    // Mock the `animate` prop.
    const animate = {
      fill: {
        enter: methodMap.fill.spy,
        timing: {
          duration: 2000,
        },
      },
      x: {
        leave: methodMap.x.spy,
        events: {
          interrupt: sinon.spy(),
        },
      },
      y: {
        start: methodMap.y.spy,
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

    beforeEach(() => {
      forEach(methodMap, (spyConfig) => {
        spyConfig.spy.reset();
      });
    });

    runBoilerPlateTests(
      'Complex animation configuration',
      getAnimationMethods(animate)[1],
    );

    describe('overrides/includes properties correctly', () => {
      const assertion = ({ methodName }, attr) => {
        const outputData = animationProcessorFactory(
          animate,
          animatableAttrs,
          processor,
          methodName
        )(inputDatum);

        // allow for `start` method not being in an array
        const [outputDatum] = methodName === 'start'
          ? [outputData]
          : outputData.filter(datum => datum[attr]);

        it(`overrides less-nested animation properties:
        ${attr} if overridden in ${methodName}`, () => {
          forEach(outputDatum, (value, key) => {
            // If the value was to be overridden by method's return value,
            // ie, `animate.x.leave => { timing, events, <attr> }
            if (get(returnValues, [attr, methodName, key])) {
              expect(value).to.equal(returnValues[attr][methodName][key]);

            // if the value was assigned at animate[attr],
            // ie, `animate.y.timing` or `animate.fill.events`
            } else if (get(animate, [attr, key])) {
              expect(value).to.equal(animate[attr][key]);

            // the original data value was never overridden.
            // ie, `inputDatum.fill`
            } else if (get(inputDatum, [key])) {
              expect(value).to.equal(inputDatum[key]);

            // the root animate[key] was never overridden.
            // ie, `animate.timing`
            } else {
              expect(value).to.equal(animate[key]);
            }
          });
        });
      };

      forEach(methodMap, assertion);
    });

    describe('Confirm given `animate` methods are called with expected args', () => {
      const spyInputDatum = {
        nonAnimatableProp: 'I should not be tampered with!',
        fill: '#fff',
        x: 101,
        y: 101,
      };

      const testIndex = 1000;

      const assertion = ({ methodName, spy }, attr) => {
        it(`calls ${attr}.${methodName} with expected arguments`, () => {
          // call `start`, `enter`, or `leave` animationProcessor to check
          // if spy is called during execution of animationProcessor.
          animationProcessorFactory(
            animate,
            animatableAttrs,
            processor,
            methodName
          )(spyInputDatum, testIndex);

          expect(spy.called).to.be.true;

          const [
            spyCallValue,
            spyCallRawDatum,
            spyCallIndex,
          ] = spy.getCall(0).args;

          expect(spyCallValue).to.equal(spyInputDatum[attr]);
          expect(spyCallRawDatum).to.deep.equal(spyInputDatum);
          expect(spyCallIndex).to.deep.equal(testIndex);
        });
      };

      forEach(methodMap, assertion);
    });
  });
});
