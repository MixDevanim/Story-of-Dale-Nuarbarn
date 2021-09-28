var Core = {
    frameID: 0,
};

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
	
	var batch = new Batch(4096);
	var shader = new Shader(vertCode, fragCode);
	var texture = new Texture(from_1bit(8,8, tex_data), 8,8, gl.RGBA);
	texture.load_from('grass.png');
	var camera = new Camera(new vec3(0,0,1));

    var maxDelta = 1e-5;
	var timer = 0.0;
    var fpsTimer = 0.0;
    var dt = 0.0;
    let ar = Window.height / Window.width
    
    camera.update();
    
    const fpsElement = document.querySelector("#fps");
    
	function onTick(now) {
		Core.frameID++;
	 	camera.controls(timer, 0.016);
		camera.update();
        
        dt = now * 0.001 - timer;
        timer = now * 0.001;
        fpsTimer += dt;
        if (dt > maxDelta)
            maxDelta = dt;
        
        if (fpsTimer > 0.25){
            fpsTimer = 0.0;
            
            fpsElement.textContent = ""+(1.0/maxDelta).toFixed(2);
            console.log(""+(1.0/maxDelta).toFixed(2));
            
            maxDelta = 1e-5;
        }
		
		var matrix = camera.getProj(Window.width, Window.height);
        var view = camera.getView();
		
		shader.use();
		shader.uniform1f("u_timer", timer);
		shader.uniformMat4("u_proj", matrix);
		shader.uniformMat4("u_view", view);
		shader.uniformMat4("u_model", mat4.translation(0,0,0));
		
		gl.clearColor(0.0,0.0,0.0,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		batch.circle(0,0,1,8, 0.0, 1,1,1,1, 0,0,0,0);
		batch.flush(shader);
		gl.flush();
		
		Events.pull()
        
		window.requestAnimationFrame(onTick);
	}
	onTick(0.0);
}

window.onload = main;