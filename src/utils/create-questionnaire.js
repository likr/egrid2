/* global gapi */

export const createQuestionnaire = (title, description, items) => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          clientId: '716888465914-esqg6jdhaedhqo6i6i3k5ldup2g23cvm.apps.googleusercontent.com',
          discoveryDocs: ['https://script.googleapis.com/$discovery/rest?version=v1'],
          scope: 'https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/spreadsheets'
        })
        .then(() => {
          return gapi.auth2.getAuthInstance().signIn()
        })
        .then(() => {
          gapi.client.script.scripts
            .run({
              scriptId: 'M7U_mo5wBdJUhrFsGSW2ZiYx0K7729kPW',
              resource: {
                function: 'createQuestionnaire',
                parameters: [title, description, items]
              }
            })
            .then((response) => {
              resolve(response.result.response.result)
            })
        }, (e) => {
          reject(e)
        })
    })
  })
}
