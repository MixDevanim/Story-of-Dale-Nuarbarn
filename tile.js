TILE_void = {
	id: 'void',
	title: 'Void',
	description: 'Empty space, part of universe',
	texture: 'grid',
	zindex: 0,
};

TILE_floor = {
	id: 'floor',
	title: 'Tiled Floor',
	description: 'Old tiled floor. Nothing special',
	texture: 'floor',
	zindex: 2,
};

TILE_wooden_floor = {
	id: 'wooden_floor',
	title: 'Wooden Floor',
	description: 'Floor made of wood. Nothing special',
	texture: 'wooden_floor',
	zindex: 2,
};

TILE_grass = {
	id: 'grass',
	title: 'Grass',
	description: 'Green grass',
	texture: 'grass',
	zindex: 1,
};

TILE_sand = {
	id: 'sand',
	title: 'Sand',
	description: 'Sand',
	texture: 'sand',
	zindex: 2,
};

TILE_stone_path = {
	id: 'stone_path',
	title: 'Stone Path',
	description: 'Stone Path',
	texture: 'stone_path',
	zindex: 2,
};

var TILE_DEFS = [
	TILE_void,
	TILE_floor,
	TILE_wooden_floor,
	TILE_grass,
	TILE_sand,
	TILE_stone_path,
];

function Tile(def){
	this.def = def;
};


var main_atlas = {
	'grid': 0,
	'floor': 1,
	'sand':2,
	'grass': 3,
	'wooden_floor': 4,
	'stone_path': 5,
};
