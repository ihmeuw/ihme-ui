const TRANSPARENT_BACKGROUND = /^(rgba\(\d+, \d+, \d+, 0\)|transparent)$/i; // rgba(0, 0, 0, 0)

export function getBackgroundColor(element) {
  // find DOM node with background color
  let el = element;
  while (el.style) {
    const backgroundColor = window.getComputedStyle(el).backgroundColor;
    if (backgroundColor.search(TRANSPARENT_BACKGROUND) === -1) {
      return backgroundColor;
    }
    el = el.parentNode;
  }
  return 'white';
}
