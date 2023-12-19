'use strict';

// Helper
import { _q, _qAll, konami, removeClass, get, set, addClass, remove } from './helpers/helper.js';

document.addEventListener("DOMContentLoaded", _ => {
  // Calling konami code 😗
  konami();

  // removing no-js class
  removeClass("html", "nojs");


  //
  //! Accessibility settings
  //

  // All settings
  const settings = ["dark-mode", "high-contrast", "underline-links", "reduce-motion"];
  settings.forEach(name => {
    const checkbox = _q("#" + name);

    if (get(name)) {
      addClass("html", name);
      checkbox.checked = true;
    } else {
      removeClass("html", name);
      checkbox.checked = false;
    }
  });

  // Set color of the browser
  const set_browser_color = _ => {
    const color = get(settings[0]) ? get(settings[1]) ? "#000" : "#191A1B" : get(settings[1]) ? "#FFF" : "#F9FAFC";
    _q("meta[name=theme-color]").setAttribute("content", color);
  }
  set_browser_color();

  // Setting accesibility
  const accessibility_name = "accessibility";
  const accessibility_checkbox = _q("#" + accessibility_name);
  // Listen to checkbox change
  accessibility_checkbox.addEventListener('change', _ => {
    settings.forEach(name => {
      const checkbox = _q("#" + name);

      if (checkbox.checked) {
        set(name, true);
        addClass("html", name);
      } else {
        remove(name);
        removeClass("html", name);
      }
    });

    // Set browser color
    set_browser_color();
  });
});
