const Tank = require('./examples/Tank').default
const Stress = require('./examples/Stress').default

let example

if (window.location.search.indexOf('?stress') !== -1) {
  example = new Stress()
} else {
  example = new Tank()
}

document.body.appendChild(example.element)
