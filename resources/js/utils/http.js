export default function (method, url, params = {}, body = {}) {
  return new Promise(function (resolve, reject) {
    var http = new XMLHttpRequest()
    var query = Object.keys(params).reduce(function (query, key) {
        var param = [key, params[key]].join('=')
        return [query, param].join('&')
    }, '')
    http.open(method, [url, query].filter(Boolean).join('?'))
    http.addEventListener('load', function(e) {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(this.responseText))
      } else {
        reject({
          status: this.status,
          statusText: this.statusText
        })
      }
    })
    http.addEventListener('error', function(e) {
      reject({
        status: this.status,
        statusText: http.statusText
      })
    })
    http.setRequestHeader('Content-Type', 'application/json')
    http.send(body ? JSON.stringify(body) : null)
  })
}