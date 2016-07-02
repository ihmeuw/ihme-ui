const TRANSPARENT_BACKGROUND = /rgba\(\d+, \d+, \d+, 0\)/i;  // rgba(0, 0, 0, 0)

export function getBackgroundColor(element) {
  // find DOM node with background color
  let el = element;
  while (el.nodeName !== 'BODY') {
    const backgroundColor = window.getComputedStyle(el)
      .getPropertyValue('background-color');
    if (backgroundColor.search(TRANSPARENT_BACKGROUND) === -1) {
      return backgroundColor;
    }
    el = el.parentNode;
  }
  return 'white';
}
