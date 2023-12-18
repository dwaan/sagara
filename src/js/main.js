'use strict';

// Helper
import { _q, _qAll, konami, removeClass, get, set } from './helpers/helper.js';

document.addEventListener("DOMContentLoaded", function (event) {
  // Calling konami code 😗
  konami();

  // removing no-js class
  removeClass(_q("html"), "nojs");

  // Setting dark mode
  const dark_mode = get("dark-mode") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? true : false;
  if (_q("#dark-mode")) _q("#dark-mode").checked = dark_mode;
  console.log(_q("#dark-mode").checked);
  set("dark-mode", dark_mode);
});
