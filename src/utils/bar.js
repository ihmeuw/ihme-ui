import { stack } from 'd3';

/**
 * Determines the orientation of the bars relative to the default orientation
 * of vertical bars.
 * @param orientation : A string that represents the orientation of the chart
 * @returns {boolean} : Returns whether the given argument is vertical
 */
export function isVertical(orientation) {
  return (orientation.toLowerCase()  === "vertical".toLowerCase());
}

/**
 * Determines the type of the bars relative to the default orientation
 * of string "default".
 * @param type : A string that represents the type of the chart
 * @returns {boolean} : Returns whether the given argument is default
 */
export function isDefault(type) {
  return (type.toLowerCase() === "default".toLowerCase());
}

/**
 * Converts the data object into the d3 preferred stacked shape in order to position the bars
 * within a stacked bar chart.
 * @param obj : Data object used to convert into a stacked shape
 * @param layerField : Represents the subcategory of the stack field
 * @param valueField : Represents the values typically plotted against
 * @param stackField : Represents the category in which the data should be plotted against
 * @param dataField : Represents the field to access the data object within the obj object
 * @param layerDomain : Represents the domain of the subcategory of the stack field
 * @returns {object} Returns an object that is the d3 preferred stacked shape
 */
export function stackedDataArray(obj, layerField, valueField, stackField, dataField, layerDomain) {
  let i = 0; // generates unique id number for each datum that binds to each rect
  const categoricalData = obj.map( (data) => {
    const insertObject = {};
    insertObject[stackField] = data[stackField];
    insertObject.id = i;
    i++;
    data[dataField].map( datum => {
      const year = datum[layerField];
      insertObject[year] = datum[valueField];
    });
    return insertObject;
  });

  return stack().keys(layerDomain)(categoricalData);
}

/**
 * Logic behind which values are computed given the configuration of the bar chart
 * @param datum : Represents the datum for that corresponding bar
 * @param grouped : Represents whether it is a grouped bar chart
 * @param height : Represents the height of the chart
 * @param layerOrdinal : Represents the scale for the subcategory of the categorical data
 * @param linear : Represents the scale for the data values plotted
 * @param ordinal : Represents the scale for the categorical data
 * @param orientation : Represents the orientation of the chart
 * @param stacked : Represents whether it is a stacked bar chart
 * @param xValue : Represents the xValue for this particular bar component
 * @param yValue Represents the yValue for this particular bar component
 * @returns {object} : Returns an object that contains all the properties used to position and
 * plot the data
 */
export function getRenderingProps(datum, grouped, height, layerOrdinal, linear, ordinal, orientation,
                                  stacked, xValue, yValue) {
  const result = {};

  const xPosition = stacked ? getXPositionStack(datum[0], linear, ordinal, orientation, xValue)
    : getXPosition(grouped, layerOrdinal, ordinal, orientation, xValue);

  const yPosition = stacked ? getYPositionStack(datum[1], linear, ordinal, orientation, xValue)
    : getYPosition(grouped, layerOrdinal, linear, ordinal, orientation, xValue, yValue);

  const barHeight = stacked ? getHeightStack(datum[0], linear, ordinal, orientation, yValue)
    : getHeight(height, grouped, layerOrdinal, linear, ordinal, orientation, yValue);

  const barWidth = stacked ? getWidthStack(datum[0], linear, ordinal, orientation, yValue)
    : getWidth(grouped, layerOrdinal, linear, ordinal, orientation, xValue, yValue);

  result.xPosition = xPosition;
  result.yPosition = yPosition;
  result.barHeight = barHeight;
  result.barWidth = barWidth;

  return result;
}

/**
 * Sets the alignment and band padding for the given chart given the particular arguments
 * @param scale : Represents the ordinal scale for the chart
 * @param align : Represents the alignment properties for the ordinal scale bandwidth
 * @param bandPadding : Represents the bandPadding property for the ordinal scale bandwidth
 * @param bandPaddingInner : Represents the inner band padding property for the ordinal scale bandwidth
 * @param bandPaddingOuter : Represents the outter band padding property for the ordinal scale bandwidth
 * @returns {function} : Returns a function that represents the ordinal scale for chart
 */
export function setBandProps(scale, align, bandPadding, bandPaddingInner, bandPaddingOuter) {
  if (bandPaddingOuter) {
    scale.paddingOuter(bandPaddingOuter);
  } else if (bandPaddingInner) {
    scale.paddingInner(bandPaddingInner);
  } else {
    scale.padding(bandPadding);
  }

  if (align) {
    scale.align(align);
  }
  return scale;
}

/**
 * Checks whether the current prop contains the stacked property
 * @param props : Object that represents the properties for a component
 * @returns {boolean} : Returns whether the prop stacked is in the current prop object
 */
export function stacked(props) {
  return Object.prototype.hasOwnProperty.call(props, 'stacked');
}

/**
 * Checks whether the current prop contains the grouped property
 * @param props : Object that represents the properties for a component
 * @returns {boolean} : Returns whether the prop grouped is in the current prop object
 */
export function grouped(props) {
  return Object.prototype.hasOwnProperty.call(props, 'grouped');
}

/**
 * Returns the x position used to render the svg rect element of a normal and grouped bar chart
 * @param isGrouped : Boolean that represents whether the chart is grouped
 * @param layerOrdinal : Ordinal scale for the sub-categorical data within a grouped/stacked bar chart
 * @param ordinal : Ordinal scale for the categorical data with a grouped/stacked bar chart
 * @param orientation : String that represents the orientation of the chart
 * @param xValue : Value that corresponds to the X Axis used to calculate positioning from scales
 * @returns {number} : Value that represents the x position for the svg rect element
 */
export function getXPosition(isGrouped, layerOrdinal, ordinal, orientation, xValue) {
  if(!isVertical(orientation)) {
    return 0;
  }
  if(isGrouped) {
    return layerOrdinal(xValue);
  }
  return ordinal(xValue);
}

/**
 *
 * @param datum
 * @param linear
 * @param ordinal
 * @param orientation
 * @param xValue
 * @returns {*}
 */
export function getXPositionStack(datum, linear, ordinal, orientation, xValue) {
  if(isVertical(orientation)) {
    return ordinal(xValue);
  }
  return linear(datum);
}


/**
 *
 * @param grouped
 * @param layerOrdinal
 * @param linear
 * @param ordinal
 * @param orientation
 * @param xValue
 * @param yValue
 * @returns {*}
 */
export function getYPosition(grouped, layerOrdinal, linear, ordinal, orientation, xValue, yValue) {
  if (isVertical(orientation)) {
    return linear(yValue);
  }
  if (grouped) {
    return layerOrdinal(yValue);
  }
  return ordinal(xValue);
}

/**
 *
 * @param datum
 * @param linear
 * @param ordinal
 * @param orientation
 * @param xValue
 * @returns {*}
 */
export function getYPositionStack(datum, linear, ordinal, orientation, xValue) {
  if(isVertical(orientation)) {
    return linear(datum);
  }
  return ordinal(xValue);
}

/**
 *
 * @param height
 * @param isGrouped
 * @param layerOrdinal
 * @param linear
 * @param ordinal
 * @param orientation
 * @param yValue
 * @returns {number}
 */
export function getHeight(height, isGrouped, layerOrdinal, linear, ordinal, orientation, yValue) {
  if(isVertical(orientation)) {
    return height - linear(yValue);
  }

  if (isGrouped) {
    return layerOrdinal.bandwidth();
  }
  return ordinal.bandwidth();
}

/**
 *
 * @param datum
 * @param linear
 * @param ordinal
 * @param orientation
 * @param yValue
 * @returns {number}
 */
export function getHeightStack(datum, linear, ordinal, orientation, yValue) {
  if (isVertical(orientation)) {
    return linear(datum) - linear(yValue);
  }
  return ordinal.bandwidth();
}

/**
 *
 * @param isGrouped
 * @param layerOrdinal
 * @param linear
 * @param ordinal
 * @param orientation
 * @param xValue
 * @param yValue
 * @returns {*}
 */
export function getWidth(isGrouped, layerOrdinal, linear, ordinal, orientation, xValue, yValue) {
  if (!isGrouped) {
    if (isVertical(orientation)) {
      return ordinal.bandwidth();
    }
    return linear(yValue);
  } else {
    if (isVertical(orientation)) {
      return layerOrdinal.bandwidth();
    }
    return linear(xValue);
  }
}

/**
 *
 * @param datum
 * @param linear
 * @param ordinal
 * @param orientation
 * @param yValue
 * @returns {number}
 */
export function getWidthStack(datum, linear, ordinal, orientation, yValue) {
  if (isVertical(orientation)) {
    return ordinal.bandwidth();
  }
  return linear(yValue) - linear(datum);
}

