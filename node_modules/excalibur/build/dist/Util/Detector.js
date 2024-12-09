import { Logger } from './Log';
/**
 * This is the list of features that will be used to log the supported
 * features to the console when Detector.logBrowserFeatures() is called.
 */
const REPORTED_FEATURES = {
    webgl: 'WebGL',
    webaudio: 'WebAudio',
    gamepadapi: 'Gamepad API'
};
/**
 * Excalibur internal feature detection helper class
 */
export class Detector {
    constructor() {
        this._features = null;
        this.failedTests = [];
        // critical browser features required for ex to run
        this._criticalTests = {
            // Test canvas/2d context support
            canvasSupport: function () {
                const elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            },
            // Test array buffer support ex uses for downloading binary data
            arrayBufferSupport: function () {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '/');
                try {
                    xhr.responseType = 'arraybuffer';
                }
                catch (e) {
                    return false;
                }
                return xhr.responseType === 'arraybuffer';
            },
            // Test data urls ex uses for sprites
            dataUrlSupport: function () {
                const canvas = document.createElement('canvas');
                return canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
            },
            // Test object url support for loading
            objectUrlSupport: function () {
                return 'URL' in window && 'revokeObjectURL' in URL && 'createObjectURL' in URL;
            },
            // RGBA support for colors
            rgbaSupport: function () {
                const style = document.createElement('a').style;
                style.cssText = 'background-color:rgba(150,255,150,.5)';
                return ('' + style.backgroundColor).indexOf('rgba') > -1;
            }
        };
        // warnings excalibur performance will be degraded
        this._warningTest = {
            webAudioSupport: function () {
                return !!(window.AudioContext ||
                    window.webkitAudioContext ||
                    window.mozAudioContext ||
                    window.msAudioContext ||
                    window.oAudioContext);
            },
            webglSupport: function () {
                const elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('webgl'));
            }
        };
        this._features = this._loadBrowserFeatures();
    }
    /**
     * Returns a map of currently supported browser features. This method
     * treats the features as a singleton and will only calculate feature
     * support if it has not previously been done.
     */
    getBrowserFeatures() {
        if (this._features === null) {
            this._features = this._loadBrowserFeatures();
        }
        return this._features;
    }
    /**
     * Report on non-critical browser support for debugging purposes.
     * Use native browser console colors for visibility.
     */
    logBrowserFeatures() {
        let msg = '%cSUPPORTED BROWSER FEATURES\n==========================%c\n';
        const args = ['font-weight: bold; color: navy', 'font-weight: normal; color: inherit'];
        const supported = this.getBrowserFeatures();
        for (const feature of Object.keys(REPORTED_FEATURES)) {
            if (supported[feature]) {
                msg += '(%c\u2713%c)'; // (✓)
                args.push('font-weight: bold; color: green');
                args.push('font-weight: normal; color: inherit');
            }
            else {
                msg += '(%c\u2717%c)'; // (✗)
                args.push('font-weight: bold; color: red');
                args.push('font-weight: normal; color: inherit');
            }
            msg += ' ' + REPORTED_FEATURES[feature] + '\n';
        }
        args.unshift(msg);
        // eslint-disable-next-line no-console
        console.log.apply(console, args);
    }
    /**
     * Executes several IIFE's to get a constant reference to supported
     * features within the current execution context.
     */
    _loadBrowserFeatures() {
        return {
            // IIFE to check canvas support
            canvas: (() => {
                return this._criticalTests.canvasSupport();
            })(),
            // IIFE to check arraybuffer support
            arraybuffer: (() => {
                return this._criticalTests.arrayBufferSupport();
            })(),
            // IIFE to check dataurl support
            dataurl: (() => {
                return this._criticalTests.dataUrlSupport();
            })(),
            // IIFE to check objecturl support
            objecturl: (() => {
                return this._criticalTests.objectUrlSupport();
            })(),
            // IIFE to check rgba support
            rgba: (() => {
                return this._criticalTests.rgbaSupport();
            })(),
            // IIFE to check webaudio support
            webaudio: (() => {
                return this._warningTest.webAudioSupport();
            })(),
            // IIFE to check webgl support
            webgl: (() => {
                return this._warningTest.webglSupport();
            })(),
            // IIFE to check gamepadapi support
            gamepadapi: (() => {
                return !!navigator.getGamepads;
            })()
        };
    }
    test() {
        // Critical test will for ex not to run
        let failedCritical = false;
        for (const test in this._criticalTests) {
            if (!this._criticalTests[test].call(this)) {
                this.failedTests.push(test);
                Logger.getInstance().error('Critical browser feature missing, Excalibur requires:', test);
                failedCritical = true;
            }
        }
        if (failedCritical) {
            return false;
        }
        // Warning tests do not for ex to return false to compatibility
        for (const warning in this._warningTest) {
            if (!this._warningTest[warning]()) {
                Logger.getInstance().warn('Warning browser feature missing, Excalibur will have reduced performance:', warning);
            }
        }
        return true;
    }
}
//# sourceMappingURL=Detector.js.map