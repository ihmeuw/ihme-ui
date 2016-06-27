/* these propTypes are shared by <Axis />, <XAxis />, and <YAxis /> */
export function calcTranslate(orientation, width = 0, height = 0) {
  if (orientation === 'bottom') {
    return {
      x: 0,
      y: height,
    };
  } else if (orientation === 'right') {
    return {
      x: width,
      y: 0,
    };
  }
  return {
    x: 0,
    y: 0,
  };
}

export function calcLabelPosition(orientation, translate, padding, center) {
  switch (orientation) {
    case 'top':
      return {
        x: translate.x,
        y: translate.y - padding.top,
        dX: center,
        dY: '1em',
      };
    case 'bottom':
      return {
        x: translate.x,
        y: translate.y + padding.bottom,
        dX: center,
        dY: '-0.2em',
      };
    case 'left':
      return {
        x: translate.y,
        y: translate.x - padding.left,
        dX: -center,
        dY: '1em',
        rotate: 270,
      };
    case 'right':
      return {
        x: translate.y,
        y: -(translate.x + padding.right),
        dX: center,
        dY: '1em',
        rotate: 90,
      };
    default:
      return {
        x: translate.x,
        y: translate.y,
        dX: 0,
        dY: 0,
      };
  }
}
