/* global document */

export const animate = (element, args) => {
  const {attributeName, to, dur, delay} = args;
  const svg = element.ownerSVGElement;
  const begin = svg.getCurrentTime() + delay;
  const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  anim.setAttribute('attributeName', attributeName);
  anim.setAttribute('dur', `${dur}s`);
  anim.setAttribute('fill', 'freeze');
  anim.setAttribute('to', to);
  anim.setAttribute('begin', begin);
  anim.addEventListener('endEvent', () => {
    element.setAttribute(attributeName, to);
    element.removeChild(anim);
  });
  element.appendChild(anim);
};

export const animateTransform = (element, args) => {
  const {type, to, dur, delay} = args;
  const svg = element.ownerSVGElement;
  const begin = svg.getCurrentTime() + delay;
  const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
  anim.setAttribute('attributeName', 'transform');
  anim.setAttribute('type', type);
  anim.setAttribute('dur', `${dur}s`);
  anim.setAttribute('fill', 'freeze');
  anim.setAttribute('to', to);
  anim.setAttribute('begin', begin);
  anim.addEventListener('endEvent', () => {
    element.setAttribute('transform', `${type}(${to.split().join(',')})`);
    element.removeChild(anim);
  });
  element.appendChild(anim);
};
