var vertCode = `
attribute vec3 coords;
attribute vec2 texCoord;
attribute vec4 color;

varying vec4 v_color;
varying vec2 v_texCoord;

uniform mat4 u_proj;
uniform mat4 u_view;
uniform mat4 u_model;

void main(void) {
	v_color = color;
	v_texCoord = texCoord;
	gl_Position = u_proj * u_view * u_model * vec4(coords, 1.0);
}`;
	
var fragCode = `
precision highp float;
varying vec4 v_color;
varying vec2 v_texCoord;
varying float v_fog;

uniform sampler2D u_texture0;
uniform float u_timer;

void main(void) {
	vec4 texColor = texture2D(u_texture0, v_texCoord);
	if (texColor.a*v_color.a < 0.3){
		gl_FragColor = vec4(0.0);
	} else {
		float l = v_color.a * 0.5 + 0.5;
		texColor.a = 1.0;
		texColor.rgb *= l;
		gl_FragColor = texColor;
	}
}`;

function create_blank_texture(){
	return new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
}