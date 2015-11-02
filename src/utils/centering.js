const centering = (w, h, W, H) => {
  const xScale = w > 0 ? W / w : 1;
  const yScale = h > 0 ? H / h : 1;
  const scale = Math.min(1, xScale, yScale);
  return {
    x: (W - w * scale) / 2,
    y: (H - h * scale) / 2,
    scale: scale
  };
};

export default centering
