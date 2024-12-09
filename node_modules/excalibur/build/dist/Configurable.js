/**
 * Configurable helper extends base type and makes all properties available as option bag arguments
 * @internal
 * @param base
 */
export function Configurable(base) {
    return class extends base {
        assign(props) {
            //set the value of every property that was passed in,
            //if the constructor previously set this value, it will be overridden here
            for (const k in props) {
                // eslint-disable-next-line
                if (typeof this[k] !== 'function') {
                    // eslint-disable-next-line
                    this[k] = props[k];
                }
            }
        }
        constructor(...args) {
            super(...args);
            //get the number of arguments that aren't undefined. TS passes a value to all parameters
            //of whatever ctor is the implementation, so args.length doesn't work here.
            const size = args.filter(function (value) {
                return value !== undefined;
            }).length;
            if (size === 1 && args[0] && typeof args[0] === 'object' && !(args[0] instanceof Array)) {
                this.assign(args[0]);
            }
        }
    };
}
//# sourceMappingURL=Configurable.js.map