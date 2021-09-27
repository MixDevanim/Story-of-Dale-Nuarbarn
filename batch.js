function Batch(capacity){
	this.glbuffer = gl.createBuffer();
	this.buffer = new Float32Array(capacity);
	this.capacity = capacity;
	this.size = 0;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.glbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

Batch.prototype.vertex = function (x,y,u,v,r,g,b,a) {
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = u;
	this.buffer[this.size++] = v;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
}

Batch.prototype.rect = function (x,y,w,h,r,g,b,a){
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
}

Batch.prototype.circle = function (x,y,r,segments, offset, cr,cg,cb,ca, rr,rg,rb,ra){
	let psin = 0.0;
	let pcos = 0.0;
	for (let i = 0; i <= segments; i++){
		let angle = (i / segments + offset) * Math.PI*2.0;
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		if (i != 0){
			this.vertex(x,y, 0.5,0.5, cr,cg,cb,ca);
			this.vertex(x+psin*r, y+pcos*r, (1.0+psin)*0.5, (1.0+pcos)*0.5, rr,rg,rb,ra);
			this.vertex(x+sin*r, y+cos*r, (1.0+sin)*0.5, (1.0+cos)*0.5, rr,rg,rb,ra);
		}
		psin = sin;
		pcos = cos;
	}
}

Batch.prototype.flush = function (shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.glbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.buffer, gl.STATIC_DRAW, 0, this.size);

	var coord = gl.getAttribLocation(shaderProgram, "coords");
	gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 8*4, 0);
	gl.enableVertexAttribArray(coord);

	var tex = gl.getAttribLocation(shaderProgram, "texCoord");
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 8*4, 2*4);
	gl.enableVertexAttribArray(tex);

	var color = gl.getAttribLocation(shaderProgram, "color");
	gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 8*4, 4*4);
	gl.enableVertexAttribArray(color);
 
	gl.drawArrays(gl.TRIANGLES, 0, this.size / 8);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	this.size = 0;	
}