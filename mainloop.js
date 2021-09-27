function main() {
	var batch = new Batch(4096);
	var shader = new Shader(vertCode, fragCode);
	var texture = new Texture(from_1bit(8,8, tex_data)/*noise_rgb(16,16, 0.05, 0.2)*/, 8,8, gl.RGBA);

	shader.use();
	var timer = 0.0;
    let ar = Window.height / Window.width
    var scaling = mat3.scaling(ar, 1.0);
    
	function onTick() {
        let matrix = mat3.translation(Math.sin(timer), 0.0);
        matrix = mat3.multiply(scaling, matrix);
        shader.uniformMat3("u_matrix", matrix);
		timer += 0.016;
		// draw everything
		//texture.reload(noise_rgb(16, 0.05, 0.2), 16,16);
		gl.clearColor(0.0,0.0,0.0,0.9);
		//gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		//batch.rect(-0.2,-0.2, 1.1,1.1, 1,1,1,1);
		batch.circle(0,0,1,8, 0.0, 1,1,1,1, 0,0,0,0);
		batch.flush(shader.shaderProgram);
		gl.flush();
	}
	setInterval(onTick, 16);
}

window.onload = main;