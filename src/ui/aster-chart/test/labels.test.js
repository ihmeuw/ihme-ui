import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { arc } from 'd3';
import { shallow } from 'enzyme';
import {
  NINETY_DEGREES,
  NEG_NINETY_DEGREES,
} from '../src/constants';

import AsterLabels from '../src/labels';

chai.use(chaiEnzyme());

describe('<AsterLabels />', () => {
  const angleDatum = {
    startAngle: Math.PI / 2,
    endAngle: Math.PI / 2,
  };
  let component;
  /* eslint-disable max-len */
  const datum = JSON.parse('{"data":{"id":"AO","upper":"100","order":"2","score":"98","color":"#E1514B","label":"Artisanal Fishing","lower":"96"},"index":2,"value":1,"startAngle":0.8975979010256552,"endAngle":1.3463968515384828,"padAngle":0}');
  /* eslint-enable max-len */
  const mockOutlineFunc = arc().innerRadius(1).outerRadius(2);


  before(() => {
    component = (
      <AsterLabels
        datum={datum}
        formatOuterLabel={(n) => n}
        outlineFunction={arc().innerRadius(3).outerRadius(7)}
        keyField="id"
        labelField="label"
        labelOuterField="score"
        radius={7}
      />
    );
  });

  it('renders an g', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('g');
  });

  it('calculates the correct angle with static method: calculateAngle', () => {
    // making the startAngle and endAngle half of pi should result in this calculation being zero
    // ((startAngle + endAngle) * (NINETY_DEGREES / Math.PI)) + NINETY_DEGREES
    const angle = AsterLabels.calculateAngle(angleDatum, NEG_NINETY_DEGREES, NINETY_DEGREES);

    expect(angle).to.equal(0);
  });

  it('calculates the correct transform with static method: determineLabelTransform', () => {
    const transform = AsterLabels.determineLabelTransform(angleDatum, mockOutlineFunc);

    expect(transform).to.equal('translate(1.5,0) rotate(0)');
  });

  it('calculates the correct outer arc d attr: outerArcFunction', () => {
    const d = AsterLabels.outerArcFunction(angleDatum, mockOutlineFunc);

    expect(d).to.equal('M2 0');
  });
});
