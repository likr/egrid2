import Rx from 'rxjs/Rx'
import {CALC_LAYOUT} from '../constants'

export const intentSubject = new Rx.Subject()

export const calcLayout = (data, options) => {
  intentSubject.next({
    type: CALC_LAYOUT,
    data,
    options
  })
}
