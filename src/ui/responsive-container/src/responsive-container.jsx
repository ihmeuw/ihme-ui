import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';
import { omit } from 'lodash';

/**
 * `import { ResponsiveContainer } from 'ihme-ui'`
 *
 *
 * A container which provides its children with props `width` and `height` (in pixels).
 * Perfect for when using components that require explicit dimensions.
 * This is a simple wrapper around [react-virtualized's `<AutoSizer />`](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md),
 * which provides the core functionality.
 */
export default function ResponsiveContainer(props) {
  const autoSizerProps = omit(props, 'children');
  return (
    <AutoSizer {...autoSizerProps}>
      {({ width, height }) => {
        if (!width || !height) return null;
        return React.Children.map(props.children, (child) => {
          if (child === undefined || child === null) return child;
          return React.cloneElement(child, { width, height });
        });
      }}
    </AutoSizer>
  );
}

ResponsiveContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),

  /**
   * Disable dynamic :height property
   */
  disableHeight: PropTypes.bool,

  /**
   * Disable dynamic :width property
   */
  disableWidth: PropTypes.bool,

  /**
   * Callback to be invoked on-resize.
   * Signature: ({ height, width }) => {...}
   */
  onResize: PropTypes.func,
};
