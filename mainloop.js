var Core = {
    frameID: 0,
    version: '0.0.2',
};

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
	
	var batch = new Batch(4096);
	var shader = new Shader(vertCode, fragCode);
	var texture = new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
	//texture.load_from('grass.png');
	var camera = new Camera(new vec3(0,0,0));
    camera.fov = Window.height*0.5;
    camera.centred = false;
    //camera.flipped = true;
    let ar = Window.height / Window.width
    
    camera.update();
	function onTick(now) {
        const fpsElement = document.querySelector("#fps");
		Core.frameID++;
        Time.update(now, fpsElement);
	 	camera.controls(Time.time, 0.016);
		camera.update();
		
		var matrix = camera.getProj();
        var view = camera.getView();
		
		shader.use();
		shader.uniform1f("u_timer", Time.time);
		shader.uniformMat4("u_proj", matrix);
		shader.uniformMat4("u_view", view);
		shader.uniformMat4("u_model", mat4.translation(0,0,0));
		
		gl.clearColor(0.0,0.0,0.0,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		batch.circle(Events.mx,Events.my,5,8, Time.time*0.1, 1,1,1,1, 1,1,1,0);
		batch.flush(shader);
		gl.flush();
		
		Events.pull()
        
		window.requestAnimationFrame(onTick);
	}
	onTick(0.0);
}

window.onload = main;