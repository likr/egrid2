const controller = () => {
  return {
    drawn: false,
  };
};

const view = (ctrl, {children}) => {
  const invalidate = () => {
    ctrl.drawn = false;
  };

  if (ctrl.drawn) {
    return {subtree: 'retain'};
  }
  ctrl.drawn = true;

  return children(invalidate);
};

export default {controller, view}
