'use strict';

import { gsap, ScrollTrigger, ScrollToPlugin } from 'gsap/all.js';
import barba from '@barba/core';
import { settings, _q, _qAll, konami, removeClass, get, set, addClass, remove, reduceMotion, isDarkMode, isHighContrast } from './helpers/helper.js';
import { scroll, scrollto } from './helpers/scroll.js';

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
const set_browser_color = (animate = true) => {
  const color = isDarkMode() ? isHighContrast() ? "#111" : "#191A1B" : isHighContrast() ? "#FFF" : "#F9FAFC";
  gsap.to("meta[name=theme-color], body", {
    attr: { content: color },
    background: color,
    duration: reduceMotion() || !animate ? 0 : .48,
    ease: "expo"
  })
}
set_browser_color(false);


// Setting accesibility
const accessibility_name = "accessibility";
const accessibility_checkbox = _q("#" + accessibility_name);
// Listen to checkbox change
accessibility_checkbox.addEventListener('change', _ => {
  settings.forEach(name => {
    const checkbox = _q("#" + name);

    if (name == settings[4]) {
      if (checkbox.checked) {
        set(name, "id-ID");
      } else {
        set(name, "en-US");
      }
    } else {
      if (checkbox.checked) {
        set(name, true);
        addClass("html", name);
      } else {
        remove(name);
        removeClass("html", name);
      }
    }
  });

  // Call parallax to see if it need to be destroy when
  // reduce motion is activated or deactivated
  parallaxImage();

  // Set browser color
  set_browser_color();
});
// Languange changer
_q("#lang-id").addEventListener("click", _ => {
  set(settings[4], "id-ID");
  _q("#" + settings[4]).checked = true;
});
_q("#lang-en").addEventListener("click", _ => {
  set(settings[4], "en-US");
  _q("#" + settings[4]).checked = false;
});


//
//! barba.js - where all events happening
//

const duration = .72;
barba.init({
  debug: false,
  logLevel: 0,
  transitions: [{
    name: 'default-transition',
    once() {
      // Hide loader
      gsap.set("#loader", {
        opacity: 0,
        pointerEvents: "none"
      });

      // Call parallax image
      parallaxImage();

      // Scroll to hash
      scrollToId();
      // Scroll to top
      scrollto("#scrollTop");
    },
    async leave(data) {
      // Collapse sub menu and mobile menu
      _qAll("header nav.menu menu input[type='checkbox'], header input#menu-show").forEach(checkbox => {
        checkbox.checked = false
      });
      // Collapse desktop menu
      _q("header input#menu-close").checked = true;

      // Scroll to top
      await scrollToTop(window);

      // Display menu and footer indicator
      currentPageIndicator(data.next);

      // Show loader
      if (reduceMotion()) return true;
      let tl = gsap.timeline();
      return tl
        .set("#loader", {
          pointerEvents: "all"
        }, 0)
        .fromTo(data.current.container, {
          y: 0,
          opacity: 1
        }, {
          y: "10vh",
          opacity: 0,
          duration: duration / 2,
          ease: "power2.in"
        }, 0)
        .fromTo("#loader", {
          opacity: 0,
        }, {
          opacity: 1,
          duration: duration,
          ease: "power2.out"
        }, duration / 4)
        .set("#loader .logo .gradient", {
          className: "gradient plain hover"
        }, duration / 4);
    },
    afterLeave() {
      // Clear up previous scroll for smaller memory
      scroll.destroy();
    },
    enter(data) {
      // Call parallax image
      parallaxImage();

      // Scroll to hash
      scrollToId();
    },
    afterEnter(data) {
      // Hide loader
      if (reduceMotion()) return true;
      let tl = gsap.timeline();
      tl
        // Fix for parallax container position
        .set(data.next.container, {
          y: "0",
          opacity: 0
        }, 0)
        .fromTo("#loader", {
          opacity: 1,
        }, {
          opacity: 0,
          duration: duration,
          ease: "power2.out"
        }, 0)
        // Fix for parallax container position
        .set(data.next.container, {
          y: "10vh"
        }, duration / 4)
        .to(data.next.container, {
          y: 0,
          opacity: 1,
          duration: duration,
          ease: "expo.out"
        }, duration / 4)
        .set("#loader .logo .gradient", {
          className: "gradient plain"
        }).set("#loader", {
          pointerEvents: "none"
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
//! Scroll to id
//

function scrollToId() {
  _qAll("main a[href]").forEach(el => {
    if (el.getAttribute("href")[0] == "#") {
      scrollto(el);
    }
  })
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
//! Running scroll trigger on clipped image
//

function parallaxImage() {
  const triggers = _qAll(".img.clip, section.image .img, section.background .img");

  if (reduceMotion()) {
    scroll.destroy();
    triggers.forEach(trigger => {
      const imgs = trigger.querySelectorAll("img");
      gsap.set(imgs, {
        y: 0
      });
    });
    return;
  }

  // Only run when it's not reduce motion
  triggers.forEach(trigger => {
    const imgs = trigger.querySelectorAll("img");
    scroll.push(tl => {
      imgs.forEach(img => {
        tl.fromTo(img, {
          y: "-25%"
        }, {
          y: "25%",
          ease: 'linear'
        }, 0);
      });
      return tl;
    }, tl => {
      return ScrollTrigger.create({
        trigger: trigger,
        start: "0% 100%",
        end: "100% 0%",
        animation: tl,
        scrub: true,
        markers: false
      });
    });
  });
}