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
  let i = 0; // generates unique id number for each datum that binds to each rect
  const categoricalData = obj.map( (data) => {
      const insertObject = {};
     insertObject[otherField] = data[otherField];
     insertObject.id = i;
     i++;
     data[dataField].map( datum => {
        const year = datum[xField];
        insertObject[year] = datum[yField];
      });
      return insertObject;
    });

   return stack().keys(xDomain)(categoricalData);

}

export function stacked(props) {
  return Object.prototype.hasOwnProperty.call(props, 'stacked');
}

export function grouped(props) {
  return Object.prototype.hasOwnProperty.call(props, 'grouped');
}


