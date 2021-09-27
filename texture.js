function Texture(pixels, w,h, format){
	this.gltexture = gl.createTexture();
	this.width = w;
	this.height = h;
	this.format = format;
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.bindTexture(gl.TEXTURE_2D, this.gltexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, format, w,h, 0, format, gl.UNSIGNED_BYTE, pixels);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}

Texture.prototype.setPixelization = function(flag){
	gl.bindTexture(gl.TEXTURE_2D, this.gltexture);
	if (flag){
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
}

Texture.prototype.reload = function(pixels, w,h){
	this.w = w;
	this.h = h;
	gl.bindTexture(gl.TEXTURE_2D, this.gltexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, this.format, w,h, 0, this.format, gl.UNSIGNED_BYTE, pixels);
}

Texture.prototype.bind = function(){
	gl.bindTexture(gl.TEXTURE_2D, this.gltexture);
}

Texture.prototype.load_from = function(url){
	const texture = this;
	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, texture.format, texture.format, gl.UNSIGNED_BYTE, image);
		texture.width = image.width;
		texture.height = image.height;
	}
	image.src = url;
}

function Atlas(res, textures){
	let sqrt = Math.ceil(Math.sqrt(textures.length));
	sqrt = 16;
	let size = sqrt * res;

	this.size = size;
	this.sqrt = sqrt;
	this.res = res;
	var data = new Uint8Array(size*size*4);
	for (let i = 0; i < textures.length; i++){
		let sub = textures[i];
		let x = i % sqrt;
		let y = Math.floor(i / sqrt);
		x *= res;
		y *= res;
		for (let y0 = 0; y0 < res; y0++){
			for (let x0 = 0; x0 < res; x0++){
				data[((y + y0) * size + (x + x0)) * 4 + 0] = sub[(y0*res+x0) * 4 + 0];
				data[((y + y0) * size + (x + x0)) * 4 + 1] = sub[(y0*res+x0) * 4 + 1];
				data[((y + y0) * size + (x + x0)) * 4 + 2] = sub[(y0*res+x0) * 4 + 2];
				data[((y + y0) * size + (x + x0)) * 4 + 3] = sub[(y0*res+x0) * 4 + 3];
			}
		}
	}
	this.texture = new Texture(data, size,size, gl.RGBA);
}
