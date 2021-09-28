function Batch(capacity, shader){
	this.glbuffer = gl.createBuffer();
	this.buffer = new Float32Array(capacity);
	this.capacity = capacity;
	this.size = 0;
    this.flippedTextures = false;
    this.shader = shader;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.glbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

Batch.prototype.vertex = function (x,y,z,u,v,r,g,b,a) {
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = z;
	this.buffer[this.size++] = u;
	this.buffer[this.size++] = v;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
}

Batch.prototype.rect = function (x,y,w,h,r,g,b,a){
    if (this.size + 100 >= this.capacity)
        this.flush(this.shader)
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
}

Batch.prototype.circle = function (x,y,r,segments, offset, cr,cg,cb,ca, rr,rg,rb,ra){
	let psin = 0.0;
	let pcos = 0.0;
    let flip = (this.flippedTextures ? 1 : -1);
	for (let i = 0; i <= segments; i++){
		let angle = (i / segments + offset) * Math.PI*2.0;
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		if (i != 0){
			this.vertex(x,y,0, 0.5,0.5, cr,cg,cb,ca);
			this.vertex(x+psin*r, y+pcos*r, 0, (1.0+psin)*0.5, (1.0+pcos*flip)*0.5, rr,rg,rb,ra);
			this.vertex(x+sin*r, y+cos*r, 0, (1.0+sin)*0.5, (1.0+cos*flip)*0.5, rr,rg,rb,ra);
		}
		psin = sin;
		pcos = cos;
	}
}

Batch.prototype.flush = function (shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.glbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW, 0, this.size);

	var coord = gl.getAttribLocation(shaderProgram.glprogram, "coords");
	gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 9*4, 0);
	gl.enableVertexAttribArray(coord);

	var tex = gl.getAttribLocation(shaderProgram.glprogram, "texCoord");
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 9*4, 3*4);
	gl.enableVertexAttribArray(tex);

	var color = gl.getAttribLocation(shaderProgram.glprogram, "color");
	gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 9*4, 5*4);
	gl.enableVertexAttribArray(color);
 
	gl.drawArrays(gl.TRIANGLES, 0, this.size / 9);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	this.size = 0;	
}
