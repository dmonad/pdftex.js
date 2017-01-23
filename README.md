# pdftex.js
> A pure javascript port of pdftex which compiles latex directly in your
> browser! - [Demo](https://dmonad.github.io/pdftex.js)

*pdftex.js* compiles latex code at near-native speed, and does not require a
server. We also provide a custom service worker for caching the dependencies.

### Get Started

Install dependencies using bower, or download a GitHub release.

```
$ bower install --save pdftex.js
```

Include the main js file (also works well with module loaders)

```
<script src="bower_components/pdftex.js/pdftex.js"></script>
```

Start a process

```
var latexSource = '\documentclass[12pt]{article} ..'
var compile = pdftex(latexSource)
compile.on('finish', function (event) {
  if (event.success) {
    console.log('Url to compiled latex document: ', event.url)
  }
})
compile.on('log', function (message) {
  console.log(message)
})

compile.on('err', function (message) {
  console.error(message)
})
```

The [source code for the demo](index.html) is also a good point to start

### API

##### pdftex(latexSource: String, options : Object) : PdfTeXCompilation
Starts a compilation process. Calling it will terminate the previous
compilation. Options may have the following properties:

* **debug : Boolean** - If true, logs all messages to the console

##### PdfTeXCompilation
This is returned when calling `pdftex(latexSource)`. Has the following methods:

* **on(eventName : String, eventHandler : Function)** - Possible values for
  eventName:
  * **'log'**
  * **'err'**
  * **'finish'** - Called when the compilation ends (succes or failure)

### Contribution
This project wouldn't be possible without [emscripten]
(https://github.com/kripken/emscripten). [@manuels](https://github.com/manuels)
did all the pioneering work on porting pdftex. [His project]
(https://github.com/manuels/texlive.js) was very helpful in figuring out how
emscripten works.
