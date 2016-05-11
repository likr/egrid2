/* global $ */

const popup = (element, init) => {
  if (!init) {
    $(element).popup({
      position: 'bottom left',
    })
  }
}

export default popup
