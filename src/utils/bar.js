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
      insertObject.category = data[otherField];
      data[dataField].map( datum => {
        const year = datum[xField];
        insertObject[year] = datum[yField];
      });
      return insertObject;
    });

   const stackedResult = stack().keys(xDomain)(categoricalData);
   return stackedResult;
}



