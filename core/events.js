var Events = {
	"right":false,
	"left":false,
	"up":false,
	"down":false,
	"mx":0.0,
	"my":0.0,
	"dx":0.0,
	"dy":0.0,
	"locked":false,
	"space":false,
	"shift":false,
	"ctrl":false,
	"lmb":false,
	"rmb":false,
    "keys": [],
    "keys-changes": [],
};

function handleKeyPress(e){
    if (e.code == 'KeyD') Events.right = true;
    if (e.code == 'KeyA') Events.left = true;
    if (e.code == 'KeyW') Events.up = true;
    if (e.code == 'KeyS') Events.down = true;
	if (e.code == 'Space') Events.space = true;
	if (e.code == 'ShiftLeft') Events.shift = true;
	if (e.code == 'ControlLeft') Events.ctrl = true;
	if (e.code == 'KeyF') Events.lmb = true;
	if (e.code == 'KeyP') Events.rmb = true;
	if (e.code == 'KeyT'){
		canvas.requestPointerLock();
	}
	if (e.code == 'Digit0')
		player.selectedSlot = 10;
	for (let i = 1; i < 10; i++)
		if (e.code == 'Digit'+i)
			player.selectedSlot = i-1;
    Events.keys[e.code] = true;
	//if (e.code == 'Escape')
	//	Events.locked = false;
	console.log(e.code);
};

function handleMouseClick(e){
	console.log(e)
	if (e.button == 0)
		Events.lmb = false;
	if (e.button == 2)
		Events.rmb = false;
};

function handleMouseDown(e){
	console.log(e)
	if (e.button == 0)
		Events.lmb = true;
	if (e.button == 2)
		Events.rmb = true;
};

function handleKeyRelease(e){
    if (e.code == 'KeyD') Events.right = false;
    if (e.code == 'KeyA') Events.left = false;
    if (e.code == 'KeyW') Events.up = false;
    if (e.code == 'KeyS') Events.down = false;
	if (e.code == 'Space') Events.space = false;
	if (e.code == 'ShiftLeft') Events.shift = false;
	if (e.code == 'ControlLeft') Events.ctrl = false;
	if (e.code == 'KeyF') Events.lmb = false;
	if (e.code == 'KeyP') Events.rmb = false;
    Events.keys[e.code] = false;
};

function handleScroll(e){
	player.selectedSlot -= Math.sign(e.deltaY);
	if (player.selectedSlot < 0)
		player.selectedSlot += 10;
	if (player.selectedSlot >= 10)
		player.selectedSlot -= 10;
	console.log(e);
}

function handleMouseMove(e){
    var rect = canvas.getBoundingClientRect();
	let mx = e.offsetX;
	let my = e.offsetY;
	if (Core.frameID > 10){
		Events.dx += e.movementX;
		Events.dy += e.movementY;
	}
    Events.mx = mx;
    Events.my = my;
}

Events.pull = function(){
    Events.dx = 0;
    Events.dy = 0;
    //Events.lmb = false;
    //Events.rmb = false;
    if (!document.pointerLockElement){
        Events.locked = false;
    } else {
        Events.locked = true;
    }
}