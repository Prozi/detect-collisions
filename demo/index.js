if (window.location.search.indexOf("?stress") !== -1) {
    const { Stress } = require("./examples/stress");

    document.body.appendChild(new Stress().element);
} else {
    const { Tank } = require("./examples/tank");

    document.body.appendChild(new Tank().element);
}