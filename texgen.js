function noise_rgb(w,h,colorize,intencity){
	var data = new Uint8Array(w*h*3);
	for (let y = 0; y < h; y++){
		for (let x = 0; x < w; x++){
			let r = 255-Math.random()*255*intencity;
			let g = 255-Math.random()*255*intencity;
			let b = 255-Math.random()*255*intencity;

			let m = (r+g+b)/3;
			data[(y*w+x)*3] = r * colorize + m * (1.0-colorize);
			data[(y*w+x)*3+1] = g * colorize + m * (1.0-colorize);
			data[(y*w+x)*3+2] = b * colorize + m * (1.0-colorize);
		}
	}
	return data;
}

function from_1bit(w,h, bits){
	var data = new Uint8Array(w*h*4);
	let i = 0;
	for (let y = 0; y < h; y++){
		for (let x = 0; x < w; x++, i++){
			let bit = bits[(h-y-1)*w+x];
			let r = 0;
			let g = 0;
			let b = 0;
			let a = 0;
			if (bit == 1){
				r = 255;
				g = 255;
				b = 255;
				a = 255;
			}
			data[i * 4 + 0] = r;
			data[i * 4 + 1] = g;
			data[i * 4 + 2] = b;
			data[i * 4 + 3] = a;
		}
	}
	return data;
}