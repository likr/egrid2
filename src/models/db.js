import Kinto from 'kinto'

const db = new Kinto({
  remote: 'http://35.200.8.173:8888/v1/',
  headers: {
    Authorization: `Basic ${window.btoa('user:pass')}`
  }
})

export default db
