function Map(tiles, width, height){
	this.tiles = tiles;
	this.width = width;
	this.height = height;
}

Map.prototype.set = function(x,y, id){
	if (x < 0 || y < 0 || x >= this.width || y >= this.height)
		return;
	this.tiles[(this.height-y-1)*this.width+x] = TILE_DEFS[id];
}

Map.prototype.get = function(x,y){
	if (x < 0 || y < 0 || x >= this.width || y >= this.height)
		return null;
	return this.tiles[(this.height-y-1)*this.width+x];
}

function generate_map(width, height, s){
	var tiles = [];
	
	for (let y = 0; y < width; y++){
		for (let x = 0; x < height; x++){
			n = noise.simplex2(x*0.025*s,y*0.025*s)+noise.simplex2(x*0.05*s,y*0.05*s)*0.5+noise.simplex2(x*0.1*s,y*0.1*s)*0.25;
			if (n > 0.1)
				tiles.push('grass');
			else if (n > -0.1)
				tiles.push('sand');
			else
				tiles.push('void');
		}
	}

	for (let i = 0; i < tiles.length; i++){
		tiles[i] = TILE_DEFS[tiles[i]];
	}
	return new Map(tiles, width, height);
}

current_map = generate_map(256,256, 0.6);

function get_texid(x,y){
	if (x < 0 || y < 0 || x >= current_map.width || y >= current_map.height)
		return 0;
	return main_atlas[current_map.tiles[y*current_map.width+x].texture]
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
	if (x < 0 || y < 0 || x >= current_map.width || y >= current_map.height)
		return;
	let yy = current_map.height - ty - 1;
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