Module.thisProgram ='/latex'

postMessage({'type': 'ready'})

FS.createDataFile("/", Module['thisProgram'],"dummy for kpathsea",true,true)

var _texliveFiles = {}
texliveFiles.forEach(function (f) {
  _texliveFiles[f] = true
})

function wrap (name) {
  var f = FS[name]
  FS[name] = function (path) {
    var res
    try {
      res = f.apply(this, arguments)
    } catch (err) {
      if (path.indexOf('//') === 0) {
        path = path.slice(1)
      }
      if (_texliveFiles[path] === true) {
        _texliveFiles[path] = false
        var _path = path.split('/')
        var filename = _path.pop()
        var p = _path.join('/')
        if (p[0] !== '/') {
          p = '/' + p
        }
        Module.FS_createLazyFile(p, filename, '/texlive' + path, true, true)
        res = f.apply(this, arguments)
      } else {
        throw err
      }
    }
    return res
  }
}

['lookupPath', 'open'].map(wrap)
