import { HTMLImageSource } from '../ExcaliburGraphicsContext';
import { ExcaliburGraphicsContextWebGL } from '../ExcaliburGraphicsContextWebGL';
import { RendererPlugin } from '../renderer';
export declare class MaterialRenderer implements RendererPlugin {
    readonly type: string;
    priority: number;
    private _context;
    private _gl;
    private _textures;
    private _quads;
    private _buffer;
    private _layout;
    initialize(gl: WebGL2RenderingContext, context: ExcaliburGraphicsContextWebGL): void;
    dispose(): void;
    draw(image: HTMLImageSource, sx: number, sy: number, swidth?: number, sheight?: number, dx?: number, dy?: number, dwidth?: number, dheight?: number): void;
    private _addImageAsTexture;
    hasPendingDraws(): boolean;
    flush(): void;
}
