import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear, scaleBand } from 'd3';

import {
  assign,
  bindAll,
  keyBy,
  flatMap,
  filter,
  get as getValue,
  includes,
  intersection,
  intersectionWith,
  isEqual,
  map,
  toString,
} from 'lodash';

import AxisChart from './../../../axis-chart';
import { XAxis, YAxis } from './../../../axis';
import Bars from './../../../bar/src/bars';
import ResponsiveContainer from '../../../responsive-container';

export default class BarChart extends PureComponent {
  constructor(props) {
    super(props);


  }


  calculateKeyDomain() {

  }

  calculateFieldDomain() {


  }




  // renderBarChart() {
  //   const {
  //     data,
  //     className,
  //
  //
  //
  //   } = this.props;
  //
  //   return (
  //
  //       <ResponsiveContainer>
  //         <AxisChart height="" width=""/>
  //
  //
  //       </ResponsiveContainer>
  //
  //   );
  // }

  render() {
    const {
      data,




    } = this.props;

    return(
      <div className={className(styles['whatever styles goes here'], className)}
           style={style}
      >
        {/*{this.renderTitle()}*/}
        {/*{this.renderBarchart()}*/}
        {/*{this.renderLegden()}*/}
        <ResponsiveContainer>
          <AxisChart
            xDomain={}
            yDomain={}
            xScaleType={}
            yscaletype={}
          >
            <XAxis/>
            <YAxis/>
            <Bars

              data=""
              dataAccessors=""/>


          </AxisChart>
        </ResponsiveContainer>
      </div>
    );
  }
}




// <AxisChart
//   height={300}
//   width={500}
//   xDomain={locationFieldDomain}
//   yDomain={populationFieldDomain}
//   xScaleType="band"
//   yScaleType="linear"
// >
//   <XAxis/>
//   <YAxis/>
//   <MultiBars
//     colorScale={colorScale}
//     data={locationData}
//     innerDomain={yearFieldDomain}
//     dataAccessors={{
//       fill: yearField,
//       key: 'id', // rename to relate to inner grouping
//       x: yearField, // field of nested data
//       y: populationField,
//     }}
//     fieldAccessors={{
//       data: 'values',
//       key: 'location',
//     }}
//     focus={this.state.focus}
//     focusedStyle={{
//       stroke: '#000',
//       strokeWidth: 2,
//     }}
//     onClick={this.onClick}
//     onMouseLeave={this.onMouseLeave}
//     onMouseMove={this.onMouseMove}
//     onMouseOver={this.onMouseOver}
//     selection={this.state.selectedItems}
//     selectedStyle={{
//       stroke: '#000',
//       strokeWidth: 1,
//     }}
//     type="grouped"
//   />
// </AxisChart>
