module.exports = function() {
  var element = document.createElement('div');

  element.innerHTML = '<div id="container"><div class="innerblock">block1</div><div class="innerblock">block2</div></div>';

  return element;
};

