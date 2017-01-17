
class PdfTeXCompilation {
  constructor () {
    this._ready = false
    this.worker = new Worker('./src/pdftex-worker.js') // TODO: move to server
    this.ready = false
    var self = this

    this._eventListener = []

    this.worker.addEventListener('message', function (event) {
      var message = event.data
      if (message.type === 'err' || message.type === 'log') {
        self._fire(message.type, message.value)
      } else if (message.type === 'finish') {
        self._fire('finish', message.value)
      } else if (message.type === 'ready') {
        self._ready = true
        self._fire('ready')
      } else {
        console.warn('Unexpected Worker response..', message)
      }
    })
  }
  _compile (source, options) {
    var self = this
    this.source = source
    this._options = options || {}

    if (options.debug) {
      this.on('err', (err) => {
        console.error(err)
      })
      this.on('log', (out) => {
        console.log(out)
      })
    }
    this.whenReady(function () {
      self.worker.postMessage({ type: 'start', source: source })
    })
  }
  // notifies event listeners
  _fire(event, data) {
    this._eventListener.forEach(l => {
      if (l[0] === event) {
        l[1](data)
      }
    })
  }
  // register an event listener
  on (event, fn) {
    this._eventListener.push([event, fn])
  }
  // stop the compilaten
  terminate () {
    this.worker.terminate()
  }
  whenReady (f) {
    if (this._ready) {
      f()
    } else {
      this.on('ready', f)
    }
  }
}

var currentWorker = null
var nextWorker = new PdfTeXCompilation()

export default function pdftex (source, options) {
  if (currentWorker != null) {
    currentWorker.terminate()
  }
  if (nextWorker != null) {
    currentWorker = nextWorker
  } else {
    currentWorker = new PdfTeXCompilation()
  }
  currentWorker.on('finish', function () {
    nextWorker = new PdfTeXCompilation()
  })

  currentWorker._compile(source, options)
  return currentWorker
}
