import { ExEvent } from './ExEvent';
export class PointerEvent extends ExEvent {
    constructor(pointerId, coordinates, nativeEvent) {
        super();
        this.pointerId = pointerId;
        this.coordinates = coordinates;
        this.nativeEvent = nativeEvent;
    }
}
export class PointerUp extends PointerEvent {
    constructor() {
        super(...arguments);
        this.type = 'up';
    }
}
export class PointerDown extends PointerEvent {
    constructor() {
        super(...arguments);
        this.type = 'down';
    }
}
export class PointerMove extends PointerEvent {
    constructor() {
        super(...arguments);
        this.type = 'move';
    }
}
export class PointerCancel extends PointerEvent {
    constructor() {
        super(...arguments);
        this.type = 'cancel';
    }
}
export class Wheel extends ExEvent {
    constructor(x, y, pageX, pageY, screenX, screenY, index, deltaX, deltaY, deltaZ, deltaMode, ev) {
        super();
        this.x = x;
        this.y = y;
        this.pageX = pageX;
        this.pageY = pageY;
        this.screenX = screenX;
        this.screenY = screenY;
        this.index = index;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.deltaZ = deltaZ;
        this.deltaMode = deltaMode;
        this.ev = ev;
        this.type = 'wheel';
    }
}
//# sourceMappingURL=PointerEvents.js.map