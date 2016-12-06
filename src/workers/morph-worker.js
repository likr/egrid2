/* eslint-env worker */

import 'babel-polyfill'
import kuromoji from 'kuromoji'

const getTokenizer = () => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
      if (err) {
        reject()
      } else {
        resolve(tokenizer)
      }
    })
  })
}

onmessage = ({data}) => {
  getTokenizer().then((tokenizer) => {
    const words = data.map((text) => {
      return tokenizer.tokenize(text)
    })
    postMessage(words)
  })
}
