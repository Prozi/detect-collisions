const Tank = require('./examples/Tank')
const Stress = require('./examples/Stress')

let example;

switch(window.location.search) {
	case '?stress':
		example = new Stress();
		break;

	default:
		example = new Tank();
		break;
}

document.body.appendChild(example.element);
