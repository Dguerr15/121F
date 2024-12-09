export class RenderSource {
    constructor(_gl, _texture) {
        this._gl = _gl;
        this._texture = _texture;
    }
    use() {
        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }
    disable() {
        const gl = this._gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
//# sourceMappingURL=render-source.js.map