if (window.location.search.indexOf("?stress") !== -1) {
  const { Stress } = require("./stress");

  document.body.appendChild(new Stress().element);
} else {
  const { Tank } = require("./tank");

  document.body.appendChild(new Tank().element);
}
