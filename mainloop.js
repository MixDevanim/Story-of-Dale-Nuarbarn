var Core = {
    frameID: 0,
    version: '0.0.4',
};

var tiles = [];
var map_width = 512;
var map_height = 512;

for (let y = 0; y < map_width; y++){
	for (let x = 0; x < map_height; x++){
		n = noise.simplex2(x*0.025,y*0.025);
		if (n > 0.1)
			tiles.push(3);
		//else if (n > 0.0)
		//	tiles.push(5);
		//else if (n > -0.1)
		//	tiles.push(4);
		//else if (Math.random() > 0.2)
		//	tiles.push(4);
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
	
	dest[0] = (a < texID ? 0 : 1);
	dest[1] = (b < texID ? 0 : 1);
	dest[2] = (c < texID ? 0 : 1);
	dest[3] = (d < texID ? 0 : 1);
	
	dest[4] = a;
	dest[5] = b;
	dest[6] = c;
	dest[7] = d;
}

function draw_tile(x, y, tx,ty, blend_map, sz, depth){
	if (x < 0 || y < 0 || x >= map_width || y >= map_height)
		return;
	let yy = map_height - ty - 1;
	let index = main_atlas[tiles[y*map_width+x].texture];
	
	get_blending_map(x,y, index, blend_map);
	
	let b0 = blend_map[0];
	let b1 = blend_map[1];
	let b2 = blend_map[2];
	let b3 = blend_map[3];
	
	let a = blend_map[0] ? -1 : blend_map[3];
	let b = blend_map[1] ? -1 : blend_map[4];
	let c = blend_map[2] ? -1 : blend_map[5];
	let d = blend_map[3] ? -1 : blend_map[6];
	
	let u = (index % 16)*sz;
	let v = Math.floor(index / 16)*sz;
	batch.rectTile(tx,yy,1,1, 
		u+0.00005,v+0.00005,
		u+sz-0.0001,v+sz-0.0001, 
		1,1,1,b1, 
		1,1,1,b0, 
		1,1,1,b3, 
		1,1,1,b2);
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
    camera.fov = 8;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.fov = Window.height*0.5;
    uicamera.centred = false;
    
    let ar = Window.height / Window.width
	
	let blend_map = [1,1,1,1, 0,0,0,0];
    
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
		
		gl.clearColor(0.2,0.2,0.2,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);

			gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
			batch.flippedTextures = true;
			camera.setupShader(shader, false);
			
			let sz = 1.0/16.0;
			for (let id = 0; id < 5; id++){
				for (let x = 0; x < map_width; x++){
					for (let y = 0; y < map_height; y++){
						let yy = map_height - y - 1
						if (x < camera.coords.x-16 || x > camera.coords.x+16)
							continue
						if (yy < camera.coords.y-9 || yy > camera.coords.y+8)
							continue
						draw_tile(x,y, x,y, blend_map, sz, 0);
						/*
						let index = main_atlas[tiles[y*map_width+x].texture];
						if (tiles[y*map_width+x].zindex != id)
							continue;
						let u = (index % 16)*sz;
						let v = Math.floor(index / 16)*sz;
						get_blending_map(x,y, index, blend_map);
						batch.rectTile(x,yy,1,1, u+0.00005,v+0.00005,u+sz-0.0001,v+sz-0.0001, 1,1,1,blend_map[1], 1,1,1,blend_map[0], 1,1,1,blend_map[3], 1,1,1,blend_map[2]);
						if (yy > 0 && tiles[(yy-1)*map_width+x].zindex < id)
							batch.rectUV(x,map_height-y-1-sz*1.2, 1,sz*1.2, 0,0,0,0.5, u+0.00005,v+0.00005,u+sz-0.0001,v+sz-0.0001);
						//batch.rectUV(x,y,1,1, 1,1,1,1, 0,0,1,1);*/
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
