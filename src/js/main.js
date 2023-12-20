'use strict';

import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all.js';
import barba from '@barba/core';
import { _q, _qAll, konami, removeClass, get, set, addClass, remove } from './helpers/helper.js';


// Registering scroll to plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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


//
//! Calling barba.js
//

barba.init({
  debug: true,
  logLevel: 3,
  transitions: [{
    name: 'default-transition',
    once() {
      gsap.set("#loader", {
        opacity: 0,
        pointerEvents: "none"
      });
    },
    async leave() {
      // Collapse mobile menu
      _qAll("header nav.menu menu input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false
      });
      // Collapse desktop menu
      _q("header input#menu-close").checked = true;

      // Scroll to top
      await scrollToTop(window);

      // Show loader
      if (reduceMotion()) return true;
      let tl = gsap.timeline();
      return tl
        .set("#loader", {
          pointerEvents: "all"
        })
        .set("#loader .logo .gradient", {
          className: "gradient plain hover"
        })
        .fromTo("#loader", {
          opacity: 0,
        }, {
          opacity: 1,
          duration: reduceMotion() ? 0 : .48,
          ease: "power3.out"
        });
    },
    enter(data) {
      // Display menu and footer indicator
      currentPageIndicator(data.next);

      return true;
    },
    afterEnter() {
      // Hide loader
      if (reduceMotion()) return true;
      let tl = gsap.timeline();
      tl
        .to("#loader", {
          duration: .24,
        })
        .fromTo("#loader", {
          opacity: 1,
        }, {
          pointerEvents: "none",
          duration: .48,
          opacity: 0,
          ease: "power3.in"
        })
        .set("#loader .logo .gradient", {
          className: "gradient plain"
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
    const speed = reduceMotion() ? 0 : 1.28;

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
//! Current page indicator in menu and footer
//

function currentPageIndicator(el) {
  // Current page indicator for main menu
  _qAll("header nav.menu li > a, header nav.menu li > label a").forEach(a => {
    let parent = a.parentNode
    if (parent.tagName != "LI") parent = parent.parentNode;
    if (a.innerText.toLowerCase().trim() == el.namespace) {
      parent.setAttribute("aria-current", "page");
    } else {
      parent.removeAttribute("aria-current");
    }
  });

  // Current page indicator for popup menu
  _qAll("header nav.popup li a:first-child").forEach(a => {
    if (a.getAttribute("href") == el.url.path) {
      a.parentNode.setAttribute("aria-current", "page");
    } else {
      a.parentNode.removeAttribute("aria-current");
    }
  });

  // Current page indicator for footer
  _qAll("footer a").forEach(a => {
    if (a.getAttribute("href") == el.url.path) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}


//
//! Get reduce motion status
//

function reduceMotion() {
  return get(settings[3]) ? true : false;
}