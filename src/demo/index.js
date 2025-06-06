const { TestCanvas } = require('./canvas')

const isStressTest = window.location.search.indexOf('?stress') !== -1
const Test = isStressTest ? require('./stress') : require('./tank')

const test = new Test()
const canvas = new TestCanvas(test)

document.body.appendChild(canvas.element)

if (test.start) {
  test.start()
}
