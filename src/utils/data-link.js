export const dataLink = (jsonString) => {
  const data = window.btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
  return `data:text/json;charset=utf-8;base64,${data}`
}
