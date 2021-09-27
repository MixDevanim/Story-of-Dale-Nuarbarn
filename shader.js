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
	this.glprogram = shaderProgram;
}

Shader.prototype.use = function(){
	gl.useProgram(this.glprogram);
}

Shader.prototype.uniform1f = function(name, value){
	gl.uniform1f(gl.getUniformLocation(this.glprogram, name), value);
}

Shader.prototype.uniform3f = function(name, x,y,z){
	gl.uniform3f(gl.getUniformLocation(this.glprogram, name), x,y,z);
}

Shader.prototype.uniformMat4 = function(name, matrix){
	gl.uniformMatrix4fv(gl.getUniformLocation(this.glprogram, name), false, matrix);
}

Shader.prototype.uniformMat3 = function(name, matrix){
    gl.uniformMatrix3fv(gl.getUniformLocation(this.glprogram, name), false, matrix);
}
