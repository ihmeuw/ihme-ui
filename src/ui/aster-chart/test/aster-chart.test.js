import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import { maxBy, minBy, map, uniqBy } from 'lodash';
import { scaleOrdinal, csvParse } from 'd3';
import sinon from 'sinon';

import AsterChart from '../';

chai.use(chaiEnzyme());

describe('<AsterChart />', () => {
  const data = csvParse(`id,upper,order,score,color,label,lower\nFIS,62,1.1,51,#9E0041,Fisheries,50\nMAR,40,1.3,24,#C32F4B,Mariculture,20\nAO,100,2,98,#E1514B,Artisanal Fishing,96\nNP,66,3,60,#F47245,Natural Products,56\nCS,80,4,74,#FB9F59,Carbon Storage,70\nCP,71,5,70,#FEC574,Coastal Protection,68\nTR,49,6,42,#FAE38C,Tourism & Recreation,39\nLIV,90,7.1,77,#EAF195,Livelihoods,60\nECO,90,7.3,88,#C7E89E,Economies,80\nICO,70,8.1,60,#9CD6A4,Iconic Species,55\nLSP,88,8.3,65,#6CC4A4,Lasting Special Places,55\nCW,88,9,71,#4D9DB4,Clean Waters,55\nHAB,91,10.1,88,#4776B4,Habitats,70\nSPP,90,10.3,83,#5E4EA1,Species,80`);
  const labels = [
    'Fisheries',
    'Mariculture',
    'Artisanal Fishing',
    'Natural Products',
    'Carbon Storage',
    'Coastal Protection',
    'Tourism & Recreation',
    'Livelihoods',
    'Economies',
    'Iconic Species',
    'Lasting Special Places',
    'Clean Waters',
    'Habitats',
    'Species'
  ];

  const colors = [
    '#9E0041',
    '#C32F4B',
    '#E1514B',
    '#F47245',
    '#FB9F59',
    '#FEC574',
    '#FAE38C',
    '#EAF195',
    '#C7E89E',
    '#9CD6A4',
    '#6CC4A4',
    '#4D9DB4',
    '#4776B4',
    '#5E4EA1'
  ];

  const colorScale = scaleOrdinal(colors).domain(labels);

  let component;
  let clickHandler;

  before(() => {
    clickHandler = sinon.spy((evt, value) => {
      return value;
    });
    component = (
      <AsterChart
        accessorFields={{
          labels: { outer: 'score', inner: 'label' },
          uncertainty: { lower: 'lower', upper: 'upper' },
          value: 'score',
        }}
        colorScale={colorScale}
        data={data}
        domain={[0, 100]}
        onScoreClick={clickHandler}
        selectedArcs={['I am a selected arc']}
        ticks={5}
      />
    );
  });

  it('renders an svg', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.tagName('svg');
  });

  it('renders child components', () => {
    const wrapper = shallow(component);

    expect(wrapper).to.have.exactly(data.length + 1).descendants('g');
  });

  it('contains selected arcs', () => {
    const { selectedArcs } = component.props;

    expect(selectedArcs[0]).to.equal('I am a selected arc');
  });

  it('handles clicks', () => {
    const wrapper = mount(component);
    const asterScoreCenter = wrapper.find('#aster-score');
    asterScoreCenter.simulate('click');

    expect(clickHandler.called).to.be.true;
  });
});
