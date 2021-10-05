var Core = {
    frameID: 0,
    version: '0.0.4',
};

var tiles = [];
var map_width = 512;
var map_height = 512;

for (let y = 0; y < map_width; y++){
	for (let x = 0; x < map_height; x++){
		let s = 0.6;
		n = noise.simplex2(x*0.025*s,y*0.025*s)+noise.simplex2(x*0.05*s,y*0.05*s)*0.5+noise.simplex2(x*0.1*s,y*0.1*s)*0.25;
		if (n > 0.1)
			tiles.push(3);
		else if (n > -0.1)
			tiles.push(4);
		else
			tiles.push(0);
	}
}

for (let i = 0; i < tiles.length; i++){
	tiles[i] = TILE_DEFS[tiles[i]];
}

function get_texid(x,y){
	if (x < 0 || y < 0 || x >= map_width || y >= map_height)
		return 0;
	return main_atlas[tiles[y*map_width+x].texture]
}

function get_blending_map(x,y,texID,dest){
	let a = get_texid(x,y);
	let b = get_texid(x,y+1);
	let c = get_texid(x+1,y+1);
	let d = get_texid(x+1,y);
	
	dest[0] = (a != texID ? 0 : 1);
	dest[1] = (b != texID ? 0 : 1);
	dest[2] = (c != texID ? 0 : 1);
	dest[3] = (d != texID ? 0 : 1);
}

function draw_tile(x, y, tx,ty, blend_map, sz, index){
	if (x < 0 || y < 0 || x >= map_width || y >= map_height)
		return;
	let yy = map_height - ty - 1;
	//let index = main_atlas[tiles[y*map_width+x].texture];
	
	get_blending_map(x,y, index, blend_map);
	
	let b0 = blend_map[0];
	let b1 = blend_map[1];
	let b2 = blend_map[2];
	let b3 = blend_map[3];
	
	if (!b0 && !b1 && !b2 && !b3)
		return;
	
	let u = (index % 16)*sz;
	let v = Math.floor(index / 16)*sz;
	if (b0 == b2){
		batch.rectTile(tx+1+0.5,yy+0.5,-1,1, 
			u+0.00005,v+0.00005,
			u+sz-0.0001,v+sz-0.0001, 
			1,1,1,b2, 
			1,1,1,b3, 
			1,1,1,b0, 
			1,1,1,b1);

	} else {
		batch.rectTile(tx+0.5,yy+0.5,1,1, 
			u+sz-0.0001,v+0.00005,
			u+0.00005,v+sz-0.0001, 
			1,1,1,b1, 
			1,1,1,b0, 
			1,1,1,b3, 
			1,1,1,b2);
	}
}

var batch = null;
function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
    
	var shader = new Shader(vertCode, fragCode);
	batch = new Batch(4096, shader);
	var texture = new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
    texture.loadFile('atlas.png');
    
	var camera = new Camera(new vec3(10,5,1));
    camera.flipped = true;
    camera.fov = 12;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.fov = Window.height*0.5;
    uicamera.centred = false;
    
    let AR = Window.width / Window.height
	
	// temp values translated out of loop for better performance
	let blend_map = [1,1,1,1];
    
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
		
		gl.clearColor(0.7,0.64,0.6,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.DEPTH_TEST)
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);

		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		batch.flippedTextures = true;
		camera.setupShader(shader, false);
		batch.lines = true;

		// how one tile texture resolution relates to atlas resolution
		let sz = 1.0/16.0;
		for (let id = 0; id < 10; id++){
			for (let x = 0; x < map_width; x++){
				for (let y = 0; y < map_height; y++){
					let yy = map_height - y - 1
					// sort of frustum culling in 2D
					if (x < camera.coords.x-camera.fov*AR-3 || x > camera.coords.x+camera.fov*AR+2)
						continue
					if (yy < camera.coords.y-camera.fov-3 || yy > camera.coords.y+camera.fov+2)
						continue
					draw_tile(x,y, x,y, blend_map, sz, id);
				}
			}
		}
		batch.flush(shader);
		batch.lines = false

		let mx = (Events.mx / Window.width - 0.5) * 2.0 * (Window.width / Window.height)
		let my = -(Events.my / Window.height - 0.5) * 2.0
		
		mx = mx * camera.fov + camera.coords.x;
		my = my * camera.fov + camera.coords.y;
		mx = Math.floor(mx);
		my = Math.floor(my);
		
		if (mx >= 0 && mx < map_width && my >= 0 && my < map_height){
			if (Events.lmb)
				tiles[(map_height-my)*map_width+mx] = TILE_DEFS[4];
			if (Events.rmb)
				tiles[(map_height-my)*map_width+mx] = TILE_DEFS[1];
		}

		batch.rect(mx,my,1,1, 1,1,1,0.5);
		batch.flush(shader);
		
		//uicamera.setupShader(shader);
		//batch.circle(Events.mx,Events.my,50,8, Time.time*0.1, 1,1,1,1, 0.5,0,0,0);
		//batch.flush(shader);

		gl.flush();
		
		Events.pull()
        
		window.requestAnimationFrame(onTick);
	}
	onTick(0.0);
}

window.onload = main;
