Module.thisProgram ='/latex'

FS.createDataFile("/", Module['thisProgram'],"dummy for kpathsea",true,true)

preloadFiles.forEach(function (f) { f() })
postMessage({'type': 'ready'})
