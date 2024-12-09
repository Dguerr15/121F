import { Engine } from '../Engine';
import { Color } from '../Color';
import { Rectangle } from '../Graphics';
import { Transition, TransitionOptions } from './Transition';
export interface FadeOptions {
    duration?: number;
    color?: Color;
}
export declare class FadeInOut extends Transition {
    screenCover: Rectangle;
    color: Color;
    constructor(options: FadeOptions & TransitionOptions);
    onInitialize(engine: Engine): void;
    onReset(): void;
    onStart(progress: number): void;
    onEnd(progress: number): void;
    onUpdate(progress: number): void;
}
