Module.noInitialRun = true

Module.print = function (log) { postMessage({ type: 'log', value: log }) }
Module.printErr = function (err) { postMessage({ type: 'err', value: err }) }
Module.calledRun = true
// we call this in *-post.js
preloadFiles = Module.preRun
Module.preRun = [] // this is going to be overwritten later either way.. for consistency we do it here too

function start (source, options) {
  options = options || {}
  if (options.enableUrls == null) {
    options.enableUrls = true
  }
  if (options.proxy == null) {
    options.proxy = 'https://proxyl2p-yayay.rhcloud.com/'
  }
  options.fileList = options.fileList || []

  // register url files
  if (options.enableUrls) {
    var files = source.match(/\{(https|http):\/\/.*\}/g) || []
    files.forEach(function (f, i) {
      var url = f.slice(1,-1) // remove {}
      var dotPos = url.lastIndexOf('.')
      var extension
      if (dotPos >= 0) {
        extension = url.slice(dotPos)
      } else {
        extension = ''
      }
      var filename = 'remote' + i + extension
      if (url.indexOf(location.origin) !== 0 && options.proxy !== false) {
        url = options.proxy + url
      }
      Module["FS_createLazyFile"]('/', filename, url, true, true)
      source = source.replace(new RegExp(f, 'g'), '{/' + filename + '}')
    })
  }

  // register files in fileList
  options.fileList.forEach(function (f) {
    var from = f[0]
    var url = f[1]
    // ensure path to file exists
    from = from.split('/')
    var filename = from.pop()
    var dir = from.join('/')
    if (dir[0] !== '/') {
      dir = '/' + f
    }
    FS.createPath(dir)
    Module.FS_createLazyFile(dir, filename, url, true, true)
  })

  try {
    shouldRunNow = true
    Module.calledRun = false
    FS.writeFile('/input.tex', source)
    Module.run(['-interaction=nonstopmode', '-output-format', 'pdf', 'input.tex'])
  } catch (err) {
    // log
    uint8Array = FS.readFile('input.log')
    var log = new TextDecoder("utf-8").decode(uint8Array)
    postMessage({ type: 'finish', value: { success: false, message: err + '', url: null, log: log } })
    return
  }
  // pdf
  uint8Array = FS.readFile('input.pdf')
  var blob = new Blob([uint8Array], { type: 'application/pdf' })
  var url = URL.createObjectURL(blob)
  // log
  uint8Array = FS.readFile('input.log')
  var log = new TextDecoder("utf-8").decode(uint8Array)
  postMessage({ type: 'finish', value: {success: true, url: url, log: log }})
}

addEventListener('message', function (event) {
  var m = event.data
  var uint8Array
  if (m.type === 'start') {
    start(m.source, m.options)
  }
})

Module.preInit = function () {
  // Module.FS_createPath('/', '', true, true)
  /*
  texliveFiles.forEach(function (f) {
    if (f.lastIndexOf('/.') === f.length - 2) {
      Module.FS_createPath('/', f.slice(0, f.length - 2), true, true)
    } /* else {
      var split = f.lastIndexOf('/')
      var filename = split >= 0 ? f.slice(split + 1) : f
      var path = f.slice(0, split)
      Module.FS_createLazyFile(path, filename, '/src/texlive' + f, true, true)
    }*/
  // })
}
