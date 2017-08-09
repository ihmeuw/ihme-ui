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

// Logic behind which values to be computed given the configuration of the bar chart
export function getRenderingProps(datum, orientation, stacked, grouped, ordinal, linear, layerOrdinal,
                                  xValue, yValue, height) {
  const result = {};

  const xPosition =
    !isVertical(orientation) && !stacked ? 0 :
      isVertical(orientation) &&  !grouped ? ordinal(xValue) :
        stacked ? linear(datum[0]) : layerOrdinal(xValue);

  const yPosition =
    isVertical(orientation) && !stacked ? linear(yValue) :
      !isVertical(orientation) && !grouped ? ordinal(xValue) :
        stacked ? linear(datum[1]) : layerOrdinal(yValue);

  const barHeight =
    isVertical(orientation) && !stacked ? height - linear(yValue) :
      !isVertical(orientation) && !grouped ? ordinal.bandwidth() :
        stacked ? linear(datum[0]) - linear(yValue) : layerOrdinal.bandwidth();

  const barWidth =
    isVertical(orientation) && !grouped ? ordinal.bandwidth() :
      isVertical(orientation) && grouped ? layerOrdinal.bandwidth() :
        !isVertical(orientation) && grouped ? linear(xValue) :
          !isVertical(orientation) && stacked ? linear(yValue) - linear(datum[0]) : linear(yValue);

  result.xPosition = xPosition;
  result.yPosition = yPosition;
  result.barHeight = barHeight;
  result.barWidth = barWidth;

  return result;
}

export function stacked(props) {
  return Object.prototype.hasOwnProperty.call(props, 'stacked');
}

export function grouped(props) {
  return Object.prototype.hasOwnProperty.call(props, 'grouped');
}


