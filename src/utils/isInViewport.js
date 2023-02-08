const isInViewport = (elem, margin = 0) => {
  const distance = elem.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  let top = window.innerHeight || document.documentElement.clientHeight;
  let width = window.innerWidth || document.documentElement.clientWidth;
  if (ratio === 1.25) {
    top = top * ratio;
    width = width * ratio;
  }

  return {
    boundaries: distance,
    TotallyVisible: distance.top >= 0 && distance.left >= 0 && distance.bottom <= top && distance.right <= width,
    topVisible: distance.top >= 0 && distance.top + 1 <= top,
    visibleByMargin: distance.top + 1 <= top - margin,
  };
};
export default isInViewport;
