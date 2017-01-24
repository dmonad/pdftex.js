Module.thisProgram ='/latex'

FS.createDataFile("/", Module['thisProgram'],"dummy for kpathsea",true,true)

preloadFiles.forEach(function (f) { f() })

// This is called when all files are preloaded
dependenciesFulfilled = function allFilesPreloaded () {
  postMessage({'type': 'ready'})
}
