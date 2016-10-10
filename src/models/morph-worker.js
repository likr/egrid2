import Rx from 'rxjs/Rx'
import {CALC_MORPH} from '../constants'
import {intentSubject} from '../intents/morph-worker'

const morph = (data) => {
  return Rx.Observable.create((observer) => {
    const worker = new window.Worker('morph-worker.js')
    worker.onmessage = (result) => {
      observer.next(result)
      observer.complete()
    }
    worker.postMessage(data)
    return () => {
      worker.terminate()
    }
  })
}

const subject = new Rx.Subject()

const calc = (texts) => {
  morph(texts).subscribe((result) => {
    subject.next(result)
  })
}

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case CALC_MORPH:
      calc(payload.texts)
      break
  }
})

export default subject.share()
