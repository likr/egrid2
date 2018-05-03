import {Subject} from 'rxjs'
import {CALC_MORPH} from '../constants'

export const intentSubject = new Subject()

export const calcMorph = (texts) => {
  intentSubject.next({
    type: CALC_MORPH,
    texts
  })
}
