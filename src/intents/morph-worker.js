import Rx from 'rxjs/Rx'
import {CALC_MORPH} from '../constants'

export const intentSubject = new Rx.Subject()

export const calcMorph = (texts) => {
  intentSubject.next({
    type: CALC_MORPH,
    texts
  })
}
