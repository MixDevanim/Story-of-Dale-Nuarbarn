var Core = {
    frameID: 0,
    version: '0.0.4',
};

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
    
	var shader = new Shader(vertCode, fragCode);
	var batch = new Batch(4096, shader);
	var texture = new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
    texture.loadFile('grid.png');
    
	var camera = new Camera(new vec3(0,0,1));
    camera.flipped = true;
    camera.fov = 8;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.fov = Window.height*0.5;
    uicamera.centred = false;
    
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
        
        
        
		shader.uniformMat4("u_model", mat4.translation(0,0,0));
		
		gl.clearColor(0.0,0.0,0.0,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
        batch.flippedTextures = true;
        camera.setupShader(shader, false);
        for (let x = 0; x < 32; x++){
            for (let y = 0; y < 32; y++)
            batch.rect(x,y,1,1,1,1,1,1)
        }
        batch.flush(shader);
        
        uicamera.setupShader(shader);
        batch.circle(Events.mx,Events.my,50,8, Time.time*0.1, 1,1,1,1, 0.5,0,0,0);
		batch.flush(shader);
		gl.flush();
		
		Events.pull()
        
		window.requestAnimationFrame(onTick);
	}
	onTick(0.0);
}

window.onload = main;