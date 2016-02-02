import Rx from 'rx-dom'
import {CALC_MORPH} from '../constants'
import {intentSubject} from '../intents/morph-worker'

const subject = Rx.DOM.fromWorker('morph-worker.js');

const calc = (texts) => {
  subject.onNext(texts);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case CALC_MORPH:
      calc(payload.texts);
      break;
  }
});

export default subject.share()
