var Core = {
    frameID: 0,
    version: '0.0.4',
};

var tiles = [];
var map_width = 64;
var map_height = 64;

for (let y = 0; y < map_width; y++){
	for (let x = 0; x < map_height; x++){
		if (noise.simplex2(x*0.05,y*0.05) > 0.1)
			tiles.push(3);
		//else if (Math.random() > 0.2)
		//	tiles.push(4);
		else
			tiles.push(0);
	}
}

for (let i = 0; i < tiles.length; i++){
	tiles[i] = TILE_DEFS[tiles[i]];
}

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
    
	var shader = new Shader(vertCode, fragCode);
	var batch = new Batch(4096, shader);
	var texture = new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
    texture.loadFile('atlas.png');
    
	var camera = new Camera(new vec3(10,5,1));
    camera.flipped = true;
    camera.fov = 8;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.fov = Window.height*0.5;
    uicamera.centred = false;
    
    let ar = Window.height / Window.width
	
	var atlas = null;
    
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
			
			let sz = 1.0/16.0;
			for (let id = 0; id < 10; id++){
				for (let x = 0; x < map_width; x++){
					for (let y = 0; y < map_height; y++){
						let index = main_atlas[tiles[y*map_width+x].texture];
						if (tiles[y*map_width+x].zindex != id)
							continue;
						let u = (index % 16)*sz;
						let v = Math.floor(index / 16)*sz;
						batch.rectUV(x,map_height-y-1,1,1, 1,1,1,1, u+0.00005,v+0.00005,u+sz-0.0001,v+sz-0.0001);
						//if (y > 0 && tiles[(y-1)*map_width+x].zindex < id)
							batch.rectUV(x,map_height-y-1-sz*1.2, 1,sz*1.2, 0,0,0,0.5, u+0.00005,v+0.00005,u+sz-0.0001,v+sz-0.0001);
						//batch.rectUV(x,y,1,1, 1,1,1,1, 0,0,1,1);
					}
				}
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