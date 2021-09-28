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
	gl_FragColor = v_color * texture2D(u_texture0, v_texCoord);
}`;
