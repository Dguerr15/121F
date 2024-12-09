import 'core-js/es/array/sort';
import 'core-js/es/object/keys';
/**
 * Polyfill adding function
 */
export function polyfill() {
    /* istanbul ignore next */
    if (typeof window === 'undefined') {
        window = {
            audioContext: function () {
                return;
            }
        };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setInterval(callback, 1000 / 60);
                };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.cancelAnimationFrame) {
        window.cancelAnimationFrame =
            window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                function () {
                    return;
                };
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.AudioContext) {
        if (window.webkitAudioContext) {
            const ctx = window.webkitAudioContext;
            const replaceMe = ctx.prototype.decodeAudioData;
            window.webkitAudioContext.prototype.decodeAudioData = function (arrayBuffer) {
                return new Promise((resolve, reject) => {
                    replaceMe.call(this, arrayBuffer, resolve, reject);
                });
            };
        }
        window.AudioContext =
            window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.msAudioContext ||
                window.oAudioContext;
    }
    /* istanbul ignore next */
    if (typeof window !== 'undefined' && !window.devicePixelRatio) {
        window.devicePixelRatio = window.devicePixelRatio || 1;
    }
}
//# sourceMappingURL=Polyfill.js.map