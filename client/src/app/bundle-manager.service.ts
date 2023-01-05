import { Injectable } from '@angular/core';

declare var chaosHook: Function;

/**
 * Manages loading bundles dynamically, and caches bundles that are already loaded, and
 * calls into their hook function if necessary to reboot the bundle
 */
@Injectable({
  providedIn: 'root'
})
export class BundleManagerService {
  chaosLoaded:boolean;  

  constructor() { 
    this.chaosLoaded = false;
  }

  loadChaos() {
    if (!this.chaosLoaded) {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'chaos-bundle.js';
      document.body.appendChild(scriptElement);
      this.chaosLoaded = true;
    } else {
      chaosHook();
    }
  }
}
