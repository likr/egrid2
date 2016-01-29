import d3 from 'd3'
import textImage from './text-image'

const vertex = ({text, x, y, x0, y0, width, height}) => {
  const r = 3;
  return <g
    transform={`translate(${x0},${y0})`}
    style={{
      cursor: 'pointer',
    }}
    config={(element) => {
      d3.select(element)
        .transition()
        .duration(1000)
        .attr('transform', `translate(${x},${y})`);
    }}
  >
    <rect
      x={-width / 2}
      y={-height / 2}
      rx={r}
      width={width}
      height={height}
      stroke='#888'
      fill='white'
    />
    {textImage(text, width, height)}
  </g>
};

export default vertex
