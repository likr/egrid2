import {Subject} from 'rxjs'
import {CALC_LAYOUT} from '../constants'

export const intentSubject = new Subject()

export const calcLayout = (data, options) => {
  intentSubject.next({
    type: CALC_LAYOUT,
    data,
    options
  })
}
