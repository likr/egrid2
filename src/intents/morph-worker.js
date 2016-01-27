import Rx from 'rx'
import {CALC_MORPH} from '../constants'

export const intentSubject = new Rx.Subject();

export const calcMorph = (texts) => {
  intentSubject.onNext({
    type: CALC_MORPH,
    texts,
  });
};
