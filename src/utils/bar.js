/**
 * Created by bdinh on 7/13/17.
 */
import { stack } from 'd3';


/**
 * Determines the orientation of the bars relative to the default orientation
 * of vertical bars.
 * @param orientation
 * @returns {boolean}
 */
export function isVertical(orientation) {
  return (orientation.toLowerCase()  === "vertical".toLowerCase());
}

export function isDefault(type) {
  return (type.toLowerCase() === "default".toLowerCase());
}

export function stackedDataArray(obj, xField, yField, otherField, dataField, xDomain) {
   const categoricalData = obj.map( data => {
      const insertObject = {};
      // insertObject.category = data[otherField];
     insertObject[otherField] = data[otherField];
     data[dataField].map( datum => {
        const year = datum[xField];
        insertObject[year] = datum[yField];
      });
      return insertObject;
    });

  // const spreadData = xDomain.map((key, i) => {
  //   return categoricalData.map((data,j) => {
  //       return {x: data[otherField], y:data[key]};
  //     });
  //   });

   return stack().keys(xDomain)(categoricalData);

}

export function stacked(props) {
  return Object.prototype.hasOwnProperty.call(props, 'stacked');
}

export function grouped(props) {
  return Object.prototype.hasOwnProperty.call(props, 'grouped');
}

// Parameters are all of type bool
// export function getXValue(datum, orientation, grouped, stacked) {
//   if (orientation) { // if vertical since passing in the result of a isVertical Function
//     if (grouped) {
//       return
//     } else if (stacked) {
//
//     } else {
//
//     }
//   } else {
//
//   }
//
// }


