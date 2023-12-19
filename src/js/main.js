'use strict';

import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all.js';
import barba from '@barba/core';
import { _q, _qAll, konami, removeClass, get, set, addClass, remove } from './helpers/helper.js';

// Calling konami code 😗
konami();

// removing no-js class
removeClass("html", "nojs");

// Registering scroll to plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

//
//! Calling barba.js
//

barba.init({
  debug: true,
  logLevel: 3,
  transitions: [{
    name: 'default-transition',
    async leave() {
      // Collapse mobile menu
      _qAll("header input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false
      });
      // Collapse desktop menu
      _q("header input#menu-close").checked = true;

      // Scroll to top
      await scrollToTop(window);

      return true;
    },
    enter(data) {
      // Current page indicator for main menu
      _qAll("header nav.menu li > a, header nav.menu li > label a").forEach(a => {
        let parent = a.parentNode
        if (parent.tagName != "LI") parent = parent.parentNode;
        if (a.innerText.toLowerCase().trim() == data.next.namespace) {
          parent.setAttribute("aria-current", "page");
        } else {
          parent.removeAttribute("aria-current");
        }
      });
      // Current page indicator for popup menu
      _qAll("header nav.popup li a:first-child").forEach(a => {
        if (a.getAttribute("href") == data.next.url.path) {
          a.parentNode.setAttribute("aria-current", "page");
        } else {
          a.parentNode.removeAttribute("aria-current");
        }
      });

      // Current page indicator for footer
      _qAll("footer a").forEach(a => {
        if (a.getAttribute("href") == data.next.url.path) {
          a.setAttribute("aria-current", "page");
        } else {
          a.removeAttribute("aria-current");
        }
      });

      return true;
    }
  }]
});

//
//! Scroll to top
//
function scrollToTop(el) {
  return new Promise(resolve => {
    const top = el == window ? el.pageYOffset : el.scrollTop;
    const scroll = top / (window.outerHeight * 2);
    const speed = reduceMotion() ? .24 : 1.28;

    if (scroll > 0) {
      gsap.to(el, {
        scrollTo: 0,
        duration: (scroll > speed) ? speed : scroll,
        ease: "expo.inOut",
        onComplete: resolve
      });
    } else resolve();
  });
}

//
//! Get reduce motion status
//
function reduceMotion() {
  return get(settings[4]) ? true : false;
}