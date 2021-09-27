function Shader(vertCode, fragCode){
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, fragCode);
	gl.compileShader(fragShader);

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling vertex shader: " + gl.getShaderInfoLog(vertShader));
		return;
	}

	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling fragment shader: " + gl.getShaderInfoLog(fragShader));
		return;
	}
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
		return;
	}
	this.shaderProgram = shaderProgram;
}

Shader.prototype.use = function(){
	gl.useProgram(this.shaderProgram);
}