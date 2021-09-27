var events = {
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
};

var frameID = 0;

function handleKeyPress(e){
    if (e.code == 'KeyD') events.right = true;
    if (e.code == 'KeyA') events.left = true;
    if (e.code == 'KeyW') events.up = true;
    if (e.code == 'KeyS') events.down = true;
	if (e.code == 'Space') events.space = true;
	if (e.code == 'ShiftLeft') events.shift = true;
	if (e.code == 'ControlLeft') events.ctrl = true;
	if (e.code == 'KeyF') events.lmb = true;
	if (e.code == 'KeyP') events.rmb = true;
	if (e.code == 'KeyT'){
		canvas.requestPointerLock();
		events.locked = true;
	}
	if (e.code == 'Escape')
		events.locked = false;
	console.log(e.code);
};

function handleMouseClick(e){
	if (e.button == 0)
		events.lmb = true;
	if (e.button == 2)
		events.rmb = true;
};

function handleKeyRelease(e){
    if (e.code == 'KeyD') events.right = false;
    if (e.code == 'KeyA') events.left = false;
    if (e.code == 'KeyW') events.up = false;
    if (e.code == 'KeyS') events.down = false;
	if (e.code == 'Space') events.space = false;
	if (e.code == 'ShiftLeft') events.shift = false;
	if (e.code == 'ControlLeft') events.ctrl = false;
	if (e.code == 'KeyF') events.lmb = false;
	if (e.code == 'KeyP') events.rmb = false;
};

function handleMouseMove(e){
    var rect = canvas.getBoundingClientRect();
	let mx = e.clientX - rect.left
	let my = e.clientY - rect.top;
	if (frameID > 10){
		events.dx += e.movementX;
		events.dy += e.movementY;
	}
    events.mx = mx;
    events.my = my;
}

function main() {
	canvas.addEventListener('keydown', handleKeyPress);
	canvas.addEventListener('keyup', handleKeyRelease);
	canvas.addEventListener('mousemove', handleMouseMove);
	canvas.addEventListener('click', handleMouseClick);
	canvas.focus();
	
	function getUnmaskedInfo(gl) {
		var unMaskedInfo = {
			renderer: '',
			vendor: ''
		};

		var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
			if (dbgRenderInfo != null) {
			unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
			unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
		}

		return unMaskedInfo;
    }
	console.log("GPU Info:");
    console.log("  vendor:", getUnmaskedInfo(gl).vendor);
    console.log("  renderer:", getUnmaskedInfo(gl).renderer);
	
	var batch = new Batch(4096);
	var shader = new Shader(vertCode, fragCode);
	var texture = new Texture(from_1bit(8,8, tex_data), 8,8, gl.RGBA);
	texture.load_from('grass.png');
	var camera = new Camera(new vec3(0,0,1));

	var timer = 0.0;
    let ar = Window.height / Window.width
    
    camera.update();
    
	function onTick() {
		frameID++;
	 	camera.controls(timer, 0.016);
		camera.update();
		
		var matrix = mat4.perspective(1.8*camera.zoom, canvas.width/canvas.height, 0.01,1000.0);
		var view = mat4.translation(0,0,0);
		view = mat4.xRotate(view, camera.xrotation);
		view = mat4.yRotate(view, camera.yrotation);
		view = mat4.translate(view, -camera.coords.x, -camera.coords.y, -camera.coords.z);
		
		shader.use();
		shader.uniform1f("u_timer", timer);
		shader.uniformMat4("u_proj", matrix);
		shader.uniformMat4("u_view", view);
		shader.uniformMat4("u_model", mat4.translation(0,0,0));
		
		timer += 0.016;
		gl.clearColor(0.0,0.0,0.0,0.9);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0, canvas.width, canvas.height);
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		batch.circle(0,0,1,8, 0.0, 1,1,1,1, 0,0,0,0);
		batch.flush(shader);
		gl.flush();
		
		events.dx = 0;
		events.dy = 0;
		events.lmb = false;
		events.rmb = false;
		
		window.requestAnimationFrame(onTick);
	}
	onTick();
}

window.onload = main;
