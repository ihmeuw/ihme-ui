import React from 'react';
import { render } from 'react-dom';
import { scaleOrdinal, csvParse } from 'd3';

import ResponsiveContainer from 'ihme-ui/ui/responsive-container';
import AsterChart from './aster-chart';

const inputData = csvParse(`id,upper,order,score,color,label,lower\nFIS,62,1.1,59,#9E0041,Fisheries,50\nMAR,40,1.3,24,#C32F4B,Mariculture,20\nAO,100,2,98,#E1514B,Artisanal Fishing,96\nNP,66,3,60,#F47245,Natural Products,56\nCS,80,4,74,#FB9F59,Carbon Storage,70\nCP,71,5,70,#FEC574,Coastal Protection,68\nTR,49,6,42,#FAE38C,Tourism & Recreation,39\nLIV,90,7.1,77,#EAF195,Livelihoods,60\nECO,90,7.3,88,#C7E89E,Economies,80\nICO,70,8.1,60,#9CD6A4,Iconic Species,55\nLSP,88,8.3,65,#6CC4A4,Lasting Special Places,55\nCW,88,9,71,#4D9DB4,Clean Waters,55\nHAB,91,10.1,88,#4776B4,Habitats,70\nSPP,90,10.3,83,#5E4EA1,Species,80`);

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

class App extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', flex: '1 0 auto' }}>
        <div style={{ display: 'flex', flex: '1 0 auto' }}>
          <ResponsiveContainer>
            <AsterChart
              colorScale={colorScale}
              inputData={inputData}
              domain={[0, 100]}
            />
          </ ResponsiveContainer>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
