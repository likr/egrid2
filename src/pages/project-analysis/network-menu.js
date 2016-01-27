/* global document */
import m from 'mithril'
import Wordcloud from './wordcloud'

const controller = () => {
  return {
    x0: 0,
    y0: 0,
    dx: 0,
    dy: 0,
  };
};

const view = (ctrl, {show}) => {
  const mouseMove = (event) => {
    m.startComputation();
    ctrl.dx += event.clientX - ctrl.x0;
    ctrl.dy += event.clientY - ctrl.y0;
    ctrl.x0 = event.clientX;
    ctrl.y0 = event.clientY;
    m.endComputation();
  };
  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  };

  return <div
    className='ui card'
    style={{
      transition: 'opacity .5s ease',
      opacity: show ? 1 : 0,
      width: '428px',
      position: 'absolute',
      top: '60px',
      right: '20px',
      transform: `translate(${ctrl.dx}px,${ctrl.dy}px)`,
    }}
  >
    <div
        className="content"
        style={{
          cursor: 'move',
        }}
        onmousedown={(event) => {
          ctrl.x0 = event.clientX;
          ctrl.y0 = event.clientY;
          document.addEventListener('mousemove', mouseMove);
          document.addEventListener('mouseup', mouseUp);
        }}>
      <div className='header unselectable'>Word Cloud</div>
    </div>
    <div className='content'>
      <svg width='400' height='400'>
        <Wordcloud/>
      </svg>
    </div>
  </div>
};

export default {controller, view}
