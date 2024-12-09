import { Sprite } from '../Graphics';
import { Engine } from '../Engine';
import { Scene } from '../Scene';
import { Transition, TransitionOptions } from './Transition';
export interface CrossFadeOptions {
    duration: number;
}
/**
 * CrossFades between the previous scene and the destination scene
 *
 * Note: CrossFade only works as an "in" transition
 */
export declare class CrossFade extends Transition {
    engine: Engine;
    image: HTMLImageElement;
    screenCover: Sprite;
    constructor(options: TransitionOptions & CrossFadeOptions);
    onPreviousSceneDeactivate(scene: Scene<unknown>): Promise<void>;
    onInitialize(engine: Engine): void;
    onStart(_progress: number): void;
    onReset(): void;
    onEnd(progress: number): void;
    onUpdate(progress: number): void;
}
