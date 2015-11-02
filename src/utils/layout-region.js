const layoutRegion = (layout) => {
  const layoutLeft = Math.min(0, ...layout.vertices.map(({x, width}) => x - width / 2));
  const layoutRight = Math.max(0, ...layout.vertices.map(({x, width}) => x + width / 2));
  const layoutTop = Math.min(0, ...layout.vertices.map(({y, height}) => y - height / 2));
  const layoutBottom = Math.max(0, ...layout.vertices.map(({y, height}) => y + height / 2));
  return {
    x: layoutLeft,
    y: layoutTop,
    width: layoutRight - layoutLeft,
    height: layoutBottom - layoutTop
  };
};

export default layoutRegion
