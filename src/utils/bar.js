import { stack } from 'd3';
import { propResolver } from './';


/**
 * Determines the orientation of the bars relative to the default orientation
 * of vertical bars.
 * @param orientation
 * @returns {boolean}
 */
export function isVertical(orientation) {
  return (orientation.toLowerCase() === 'vertical'.toLowerCase());
}

export function isDefault(type) {
  return (type.toLowerCase() === 'default'.toLowerCase());
}

export function stackedDataArray(obj, xField, yField, otherField, dataField, xDomain) {
  let i = 0; // generates unique id number for each datum that binds to each rect
  const categoricalData = obj.map((data) => {
    const insertObject = {};
    insertObject[otherField] = data[otherField];
    insertObject.id = i;
    i++;

    data[dataField].map(datum => {
      const year = datum[xField];
      insertObject[year] = datum[yField];
    });
    return insertObject;
  });
  return stack().keys(xDomain)(categoricalData);
}

// Logic behind which values to be computed given the configuration of the bar chart
export function getRenderingProps(datum, orientation, stackType, groupType, ordinal, linear,
                                  layerOrdinal, xValue, yValue, height) {
  const result = {};
  const xPosition =
    !isVertical(orientation) && !stackType ? 0 :
      isVertical(orientation) && !groupType ? ordinal(xValue) :
        stackType ? linear(datum[0]) : layerOrdinal(xValue);

  const yPosition =
    isVertical(orientation) && !stackType ? linear(yValue) :
      !isVertical(orientation) && !groupType ? ordinal(xValue) :
        stackType ? linear(datum[1]) : layerOrdinal(yValue);

  const barHeight =
    isVertical(orientation) && !stackType ? height - linear(yValue) :
      !isVertical(orientation) && !groupType ? ordinal.bandwidth() :
        stackType ? linear(datum[0]) - linear(yValue) : layerOrdinal.bandwidth();

  const barWidth =
    (isVertical(orientation) && !groupType ? ordinal.bandwidth() :
      isVertical(orientation) && groupType ? layerOrdinal.bandwidth() :
        !isVertical(orientation) && groupType ? linear(xValue) :
          !isVertical(orientation) && stackType ? linear(yValue) - linear(datum[0]) :
            linear(yValue));

  result.xPosition = xPosition;
  result.yPosition = yPosition;
  result.barHeight = barHeight;
  result.barWidth = barWidth;

  return result;
}

export function getPlotValue(value, groupType, stackType, datum, dataAccessors) {
  if (value === 'X') {
    return groupType ? propResolver(datum, dataAccessors.layer) : stackType ?
      propResolver(datum.data, dataAccessors.stack) : propResolver(datum, dataAccessors.stack);
  } else if (value === 'Y') {
    return propResolver(datum, !stackType ? dataAccessors.value : 1);
  }
  return null;
}

export function stacked(props) {
  return Object.prototype.hasOwnProperty.call(props, 'stacked');
}

export function grouped(props) {
  return Object.prototype.hasOwnProperty.call(props, 'grouped');
}
