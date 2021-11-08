if (window.location.search.indexOf("?stress") !== -1) {
    const { Stress } = require("../source/examples/stress");

    document.body.appendChild(new Stress().element);
} else {
    const { Tank } = require("../source/examples/tank");

    document.body.appendChild(new Tank().element);
}