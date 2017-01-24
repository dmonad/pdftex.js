/* eslint-env worker */

class PdfTeXCompilation {
  constructor () {
    this._ready = false
    this.worker = new Worker(pdftex._dir + 'pdftex-worker.js')
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
  _fire (event, data) {
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
var nextWorker = null

export default function pdftex (source, options) {
  if (currentWorker != null) {
    currentWorker.terminate()
  }
  if (nextWorker == null) {
    currentWorker = new PdfTeXCompilation()
  } else {
    currentWorker = nextWorker
    nextWorker = null
  }

  currentWorker.on('finish', function () {
    if (nextWorker == null) {
      // preload when finishid
      nextWorker = new PdfTeXCompilation()
    }
  })

  currentWorker._compile(source, options)
  return currentWorker
}

pdftex.preload = function pdftexPreoad () {
  if (nextWorker == null) {
    nextWorker = new PdfTeXCompilation()
  }
}

pdftex._dir = './'
pdftex.setPdftexDir = function setPdftexDir (dir) {
  if (typeof dir !== 'string') {
    throw new Error('Expect path to be a String!')
  }
  if (dir[dir.length - 1] !== '/') {
    dir += '/'
  }
  pdftex._dir = dir
}
