import { Component } from '../EntityComponentSystem/Component';
import { Vector } from '../Math/vector';
export declare class ParallaxComponent extends Component {
    parallaxFactor: Vector;
    constructor(parallaxFactor?: Vector);
}
