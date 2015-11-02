/* global window */
import React from 'react'
import {findDOMNode} from 'react-dom'

const injectBBox = (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        width: 0,
        height: 0
      };
    }

    componentDidMount() {
      const element = findDOMNode(this).parentNode;
      this.setState({
        width: element.clientWidth,
        height: element.clientHeight
      });
      this.resizeListener = ::this.handleResize;
      window.addEventListener('resize', this.resizeListener);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.resizeListener);
    }

    render() {
      const {styleWidth, styleHeight} = this.props;
      const {width, height} = this.state;
      if (width === 0 && height === 0) {
        return <div style={{width: styleWidth, height: styleHeight}}/>;
      }
      return <Component {...this.props} width={width} height={height}/>;
    }

    handleResize() {
      const element = findDOMNode(this).parentNode;
      this.setState({
        width: element.clientWidth,
        height: element.clientHeight
      });
    }
  }
};

export default injectBBox
