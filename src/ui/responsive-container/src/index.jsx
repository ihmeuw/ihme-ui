import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';
import { omit } from 'lodash';

const ResponsiveContainerPropTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),

  /** Disable dynamic :height property */
  disableHeight: PropTypes.bool,

  /** Disable dynamic :width property */
  disableWidth: PropTypes.bool,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: PropTypes.func
};

/**
 * This component will remain untestable until either JSDOM supports getBoundingClientRect
 * or until we move tests into a browser environment
 */
export default function ResponsiveContainer(props) {
  /* eslint-disable react/prop-types */

  const autoSizerProps = omit(props, 'children');
  return (
    <AutoSizer {...autoSizerProps}>
      {({ width, height }) => {
        if (!width || !height || width < 0 || height < 0) return null;
        return React.Children.map(props.children, (child) => {
          if (child === undefined || child === null) return child;
          return React.cloneElement(child, { width, height });
        });
      }}
    </AutoSizer>
  );

  /* eslint-enable react/prop-types */
}

ResponsiveContainer.propTypes = ResponsiveContainerPropTypes;
