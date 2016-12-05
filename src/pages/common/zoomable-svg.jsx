/* global $ */
import React from 'react'
import d3 from 'd3'

const clamp = (x, min, max) => {
  if (x < min) {
    return min
  }
  if (x > max) {
    return max
  }
  return x
}

const minScale = 0.1
const maxScale = 2

class ZoomableSvg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      scale: 1
    }
  }

  componentDidMount () {
    this.zoom = d3.behavior.zoom()
      .scaleExtent([minScale, maxScale])
      .on('zoom', () => {
        const {translate, scale} = d3.event
        this.setState({
          x: translate[0],
          y: translate[1],
          scale: scale
        })
      })
    d3.select(this.refs.svg)
      .call(this.zoom)
      .on('dblclick.zoom', null)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.contentWidth === 0 && this.props.contentHeight === 0) {
      const {contentWidth, contentHeight} = nextProps
      const displayWidth = $(this.refs.svg).width()
      const displayHeight = $(this.refs.svg).height()
      const scale = clamp(Math.min(displayWidth / contentWidth, displayHeight / contentHeight), minScale, maxScale)
      const x = (displayWidth - contentWidth * scale) / 2
      const y = (displayHeight - contentHeight * scale) / 2
      this.zoom.translate([x, y])
      this.zoom.scale(scale)
      this.setState({x, y, scale})
    }
  }

  render () {
    const {children} = this.props
    const {x, y, scale} = this.state
    const svgAttrs = Object.assign({}, this.props)
    for (const attr of ['children', 'contentWidth', 'contentHeight']) {
      delete svgAttrs[attr]
    }
    return <svg ref='svg' {...svgAttrs} style={{backgroundColor: '#f3f9fd'}}>
      {children({x, y, scale, center: this.center.bind(this)})}
    </svg>
  }

  center (width, height) {
    const displayWidth = $(this.refs.svg).width()
    const displayHeight = $(this.refs.svg).height()
    const scale = clamp(Math.min(displayWidth / width, displayHeight / height), minScale, maxScale)
    const x = (displayWidth - width * scale) / 2
    const y = (displayHeight - height * scale) / 2
    this.zoom.translate([x, y])
    this.zoom.scale(scale)
    this.setState({x, y, scale})
  }
}

export default ZoomableSvg
