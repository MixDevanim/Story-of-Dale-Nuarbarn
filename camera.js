function Camera(coords){
	this.coords = coords;
	this.yrotation = 0.0;
	this.xrotation = 0.0;
	this.dir = new vec3(0.0, 0.0, -1.0);
	this.rdir = new vec3(0.0, 0.0, -1.0);
	this.right = new vec3(1.0, 0.0, 0.0);
	this.zoom = 1.0;
    this.centred = false;
    this.fov = 1.0;
    this.flipped = false;
}

Camera.prototype.controls = function(timer, dt){
	let speed = 20.0;
	let zoom = 1.0;
	if (this.body && Events.shift){
		speed *= 1.5;
	}
	let coords = this.coords;
	let front = this.rdir;
	if (this.body){
		coords = this.body.vel;
		//coords.x = 0;
		//coords.z = 0;
		speed *= 10;
		front = this.dir;
	}
	
	if (this.body)
	if (Events.down || Events.up || Events.left || Events.right){
		coords.x = 0.0;
		coords.z = 0.0;
		if (Events.shift)
			zoom = 1.2;
		else
			zoom = 1.05;
		let factor = speed * 0.05;
	}
	
	if (Events.down) {
		coords.x -= front.x*0.016*speed;
		coords.y -= front.y*0.016*speed;
		coords.z -= front.z*0.016*speed;
	}
	if (Events.up){
		coords.x += front.x*0.016*speed;
		coords.y += front.y*0.016*speed;
		coords.z += front.z*0.016*speed;
	}
	if (Events.left){
		coords.x -= this.right.x*0.016*speed;
		coords.z -= this.right.z*0.016*speed;
	}
	if (Events.right){
		coords.x += this.right.x*0.016*speed;
		coords.z += this.right.z*0.016*speed;
	}
	if (Events.space) {
		if (this.body){
			this.body.vel.y = 6.0;
		} else {
			coords.y += 0.016*speed;
		}
	}
	if (!this.body && Events.shift)
		coords.y -= 0.016*speed;
	
	if (Events.locked){
		this.yrotation += Events.dx * 0.005;
		this.xrotation += Events.dy * 0.005;
		this.xrotation = Math.min(Math.max(this.xrotation, -3.141592*0.49), 3.141592*0.49);
	}
	dt *= 5.0;
	dt = Math.min(dt, 1.0);
	this.zoom = zoom * dt + this.zoom * (1.0-dt);
}

Camera.prototype.update = function(){
	this.dir.x = Math.sin(this.yrotation);
	this.dir.z = -Math.cos(this.yrotation);
	
	this.rdir.x = Math.sin(this.yrotation);
	this.rdir.z = -Math.cos(this.yrotation);
	this.rdir.y = -Math.tan(this.xrotation);
	
	let l = Math.sqrt(this.rdir.x * this.rdir.x + this.rdir.y * this.rdir.y + this.rdir.z * this.rdir.z);
	this.rdir.x /= l;
	this.rdir.y /= l;
	this.rdir.z /= l;
	
	this.right.x = Math.sin(this.yrotation + 3.141592 * 0.5);
	this.right.z = -Math.cos(this.yrotation + 3.141592 * 0.5);
}

Camera.prototype.getProj = function(perspective){
    if (perspective){
        return mat4.perspective(1.8*this.zoom, Window.width/Window.height, 0.01,1000.0);
    } else {
        return mat4.projection(this.fov*(Window.width/Window.height)*2, this.fov*2, 10.0, this.flipped);
    }
}

Camera.prototype.getView = function(){
    var view = mat4.translation(0,0,0);
    view = mat4.xRotate(view, this.xrotation);
    view = mat4.yRotate(view, this.yrotation);
    if (this.centred){
        view = mat4.translate(view, -this.coords.x+this.fov*(Window.width/Window.height), -this.coords.y+this.fov, -this.coords.z);
    } else {
        view = mat4.translate(view, -this.coords.x, -this.coords.y, -this.coords.z);
    }
    return view;
}