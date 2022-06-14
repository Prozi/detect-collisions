if (window.location.search.indexOf("?stress") !== -1) {
  const { TestCanvas } = require("./stress");

  document.body.appendChild(new TestCanvas().element);
} else {
  const { Tank } = require("./tank");

  document.body.appendChild(new Tank().element);
}
