'use strict';

// Helper
import { _q, _qAll, konami, removeClass } from './helpers/helper.js';

// Calling konami code 😗
konami();

// removing no-js class
removeClass(_q("html"), "nojs");