import { Raster } from './Raster';
/**
 * A Rectangle [[Graphic]] for drawing rectangles to the [[ExcaliburGraphicsContext]]
 */
export class Rectangle extends Raster {
    constructor(options) {
        super(options);
        this.width = options.width;
        this.height = options.height;
        this.rasterize();
    }
    clone() {
        return new Rectangle({
            width: this.width,
            height: this.height,
            ...this.cloneGraphicOptions(),
            ...this.cloneRasterOptions()
        });
    }
    execute(ctx) {
        if (this.color) {
            ctx.fillRect(0, 0, this.width, this.height);
        }
        if (this.strokeColor) {
            ctx.strokeRect(0, 0, this.width, this.height);
        }
    }
}
//# sourceMappingURL=Rectangle.js.map