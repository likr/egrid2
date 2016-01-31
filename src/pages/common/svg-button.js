import m from 'mithril'

const view = (ctrl, {ref, x, y, onclick}) => {
  return <g className="cursor-pointer" transform={`translate(${x},${y})`} onclick={onclick}>
    <circle r="10" fill="#e0e1e2"/>
    <text
        font-family="Icons"
        fill="black"
        opacity="0.6"
        text-anchor="middle"
        y={5}>
      {ref}
    </text>
  </g>
};

export default {view}
