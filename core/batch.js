function Batch(capacity, shader){
	this.glbuffer = gl.createBuffer();
	this.buffer = new Float32Array(capacity);
	this.capacity = capacity;
	this.size = 0;
    this.flippedTextures = false;
    this.shader = shader;
	this.lines = false;

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
	
	if (this.lines){
		this.buffer[this.size++] = x;
		this.buffer[this.size++] = y+h;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = r;
		this.buffer[this.size++] = g;
		this.buffer[this.size++] = b;
		this.buffer[this.size++] = a;
	}

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
	
	if (this.lines){
		this.buffer[this.size++] = x+w;
		this.buffer[this.size++] = y+h;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 1;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = r;
		this.buffer[this.size++] = g;
		this.buffer[this.size++] = b;
		this.buffer[this.size++] = a;
	}

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
	
	if (this.lines){
		this.buffer[this.size++] = x;
		this.buffer[this.size++] = y;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 1;
		this.buffer[this.size++] = r;
		this.buffer[this.size++] = g;
		this.buffer[this.size++] = b;
		this.buffer[this.size++] = a;
	}

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
	
	if (this.lines){
		this.buffer[this.size++] = x+w;
		this.buffer[this.size++] = y+h;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 1;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = r;
		this.buffer[this.size++] = g;
		this.buffer[this.size++] = b;
		this.buffer[this.size++] = a;
	}

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = 1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
	
	if (this.lines){
		this.buffer[this.size++] = x;
		this.buffer[this.size++] = y;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 0;
		this.buffer[this.size++] = 1;
		this.buffer[this.size++] = r;
		this.buffer[this.size++] = g;
		this.buffer[this.size++] = b;
		this.buffer[this.size++] = a;
	}
}

Batch.prototype.sprite = function (x,y, w,h, r,g,b,a, index){
	let u = (index % 16)/16.0;
	let v = Math.floor(index / 16)/16.0;
	this.rectUV(x,y,w,h,r,g,b,a, u,v+1.0/16.0, u+1.0/16.0, v)
}

Batch.prototype.rectUV = function (x,y,w,h,r,g,b,a, u1,v1,u2,v2){
    if (this.size + 100 >= this.capacity)
        this.flush(this.shader)
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r;
	this.buffer[this.size++] = g;
	this.buffer[this.size++] = b;
	this.buffer[this.size++] = a;
}

Batch.prototype.rectTile = function (x,y,w,h,
									u1,v1,u2,v2,
									r1,g1,b1,a1,
									r2,g2,b2,a2,
									r3,g3,b3,a3,
									r4,g4,b4,a4){
    if (this.size + 100 >= this.capacity)
        this.flush(this.shader)
	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r1;
	this.buffer[this.size++] = g1;
	this.buffer[this.size++] = b1;
	this.buffer[this.size++] = a1;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r2;
	this.buffer[this.size++] = g2;
	this.buffer[this.size++] = b2;
	this.buffer[this.size++] = a2;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r3;
	this.buffer[this.size++] = g3;
	this.buffer[this.size++] = b3;
	this.buffer[this.size++] = a3;

	this.buffer[this.size++] = x;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u1;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r1;
	this.buffer[this.size++] = g1;
	this.buffer[this.size++] = b1;
	this.buffer[this.size++] = a1;


	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y+h;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v1;
	this.buffer[this.size++] = r3;
	this.buffer[this.size++] = g3;
	this.buffer[this.size++] = b3;
	this.buffer[this.size++] = a3;

	this.buffer[this.size++] = x+w;
	this.buffer[this.size++] = y;
	this.buffer[this.size++] = 0;
	this.buffer[this.size++] = u2;
	this.buffer[this.size++] = v2;
	this.buffer[this.size++] = r4;
	this.buffer[this.size++] = g4;
	this.buffer[this.size++] = b4;
	this.buffer[this.size++] = a4;
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

	var coord = gl.getAttribLocation(shaderProgram.glprogram, "a_coords");
	gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 9*4, 0);
	gl.enableVertexAttribArray(coord);

	var tex = gl.getAttribLocation(shaderProgram.glprogram, "a_texCoord");
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 9*4, 3*4);
	gl.enableVertexAttribArray(tex);

	var color = gl.getAttribLocation(shaderProgram.glprogram, "a_color");
	gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 9*4, 5*4);
	gl.enableVertexAttribArray(color);
 
	gl.drawArrays(this.lines ? gl.LINES : gl.TRIANGLES, 0, this.size / 9);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	this.size = 0;	
}
