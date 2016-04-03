import React from 'react'
import {updateEdge, updateVertex, removeVertex} from '../../intents/graph'
import SvgButton from '../common/svg-button'
import ZoomableSvg from '../common/zoomable-svg'
import Vertex from '../common/vertex'
import Edge from '../common/edge'
import TextInputModal from '../common/text-input-modal'

class Network extends React.Component {
  render() {
    const {vertices, edges, contentWidth, contentHeight} = this.props;
    const content = (
      <g>
        <g>{edges.map(({u, v, points, d}) => {
          return <Edge key={`${u}:${v}`} points={points} {...d}/>
        })}</g>
        <g>{vertices.map(({u, x, y, d}) => {
          return (
            <Vertex key={u} x={x} y={y} {...d}>
              <g transform="translate(0,22)">
                <SvgButton code="&#61536;" x="-45" y="0" onClick={this.handleClickLadderUpButton.bind(this, u)}/>
                <SvgButton code="&#61453;" x="-15" y="0" onClick={this.handleClickRemoveButton.bind(this, u)}/>
                <SvgButton code="&#61508;" x="15" y="0" onClick={this.handleClickEditButton.bind(this, u)}/>
                <SvgButton code="&#61537;" x="45" y="0" onClick={this.handleClickLadderDownButton.bind(this, u)}/>
              </g>
            </Vertex>
          );
        })}</g>
      </g>
    );
    return (
      <div style={{width: '100%', height: '100%'}}>
        <ZoomableSvg
            className="cursor-move"
            width="100%"
            height="100%"
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            children={({x, y, scale}) => {
              return <g transform={`translate(${x},${y})scale(${scale})`}>{content}</g>
            }}
        />
        <TextInputModal
            ref="ladderUpModal"
            title="Ladder Up"
            onApprove={this.handleApproveLadderUpModal.bind(this)}/>
        <TextInputModal
            ref="ladderDownModal"
            title="Ladder Down"
            onApprove={this.handleApproveLadderDownModal.bind(this)}/>
        <TextInputModal
            ref="editModal"
            title="Edit"
            onApprove={this.handleApproveEditModal.bind(this)}/>
      </div>
    );
  }

  handleClickLadderUpButton(v) {
    this.refs.ladderUpModal.show('', {v});
  }

  handleApproveLadderUpModal(u, {v}) {
    const {graph, participantId} = this.props;
    const d = graph.edge(u, v) || {
      participants: [],
    };
    if (d.participants.indexOf(participantId) < 0) {
      d.participants = Array.from(d.participants);
      d.participants.push(participantId);
    }
    const ud = graph.vertex(u) ? Object.assign({}, graph.vertex(u)) : {text: u, participants: []};
    if (ud.participants.indexOf(participantId) < 0) {
      ud.participants = Array.from(ud.participants);
      ud.participants.push(participantId);
    }
    const vd = graph.vertex(v);
    updateEdge(u, v, ud, vd, d);
  }

  handleClickLadderDownButton(u) {
    this.refs.ladderDownModal.show('', {u});
  }

  handleApproveLadderDownModal(v, {u}) {
    const {graph, participantId} = this.props;
    const d = graph.edge(u, v) || {
      participants: [],
    };
    if (d.participants.indexOf(participantId) < 0) {
      d.participants = Array.from(d.participants);
      d.participants.push(participantId);
    }
    const ud = graph.vertex(u);
    const vd = graph.vertex(v) ? Object.assign({}, graph.vertex(v)) : {text: v, participants: []};
    if (vd.participants.indexOf(participantId) < 0) {
      vd.participants = Array.from(vd.participants);
      vd.participants.push(participantId);
    }
    updateEdge(u, v, ud, vd, d);
  }

  handleClickEditButton(u) {
    const {graph} = this.props;
    const d = graph.vertex(u);
    this.refs.editModal.show(d.text, {u});
  }

  handleApproveEditModal(text, {u}) {
    const {graph} = this.props;
    const d = graph.vertex(u);
    updateVertex(u, Object.assign({}, d, {text}));
  }

  handleClickRemoveButton(u) {
    removeVertex(u);
  }
}

export default Network
