import Rx from 'rx-dom'
import {CALC_LAYOUT} from '../constants'
import {intentSubject} from '../intents/layout-worker'

const subject = Rx.DOM.fromWorker('layout-worker.js');

const calc = (data) => {
  subject.onNext(data);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case CALC_LAYOUT:
      calc(payload.data);
      break;
  }
});

export default subject.share()
