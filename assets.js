var tex_data = [
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,
];

var vertCode = `
	attribute vec2 coords;
	attribute vec2 texCoord;
	attribute vec4 color;

	varying vec4 v_color;
	varying vec2 v_texCoord;
    
    uniform mat3 u_matrix;
    
	void main(void) {
		v_color = color;
		v_texCoord = texCoord;
		gl_Position = vec4(u_matrix * vec3(coords, 1.0), 1.0);
	}`;
	
var fragCode = `
	varying mediump vec4 v_color;
	varying mediump vec2 v_texCoord;

	uniform sampler2D u_texture0;
	void main(void) {
		gl_FragColor = v_color * texture2D(u_texture0, v_texCoord);
	}`;