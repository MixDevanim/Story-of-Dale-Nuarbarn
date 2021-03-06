var vertCode = `
attribute vec3 a_coords;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec4 v_color;
varying vec2 v_texCoord;

uniform mat4 u_proj;
uniform mat4 u_view;
uniform mat4 u_model;
uniform float u_timer;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

void main(void) {
    v_color = a_color;
    v_texCoord = a_texCoord;
    vec3 coords = a_coords;
    //coords.x += cnoise(vec3(coords.xy, u_timer*5.0))*0.1;
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
        texColor.rgb *= v_color.rgb;
        float mid = (texColor.r+texColor.g+texColor.b)*0.333;
        float influence = 0.0;
        texColor.r = texColor.r * (1.0 - influence) + mid * influence * 0.5;
        texColor.g = texColor.g * (1.0 - influence) + mid * influence * 0.55;
        texColor.b = texColor.b * (1.0 - influence) + mid * influence * 0.65;
        gl_FragColor = texColor;
    }
}`;

var uiVertCode = `
precision highp float;
attribute vec3 a_coords;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec4 v_color;
varying vec2 v_texCoord;

uniform mat4 u_proj;
uniform mat4 u_view;
uniform float u_timer;

void main(void) {
    v_color = a_color;
    v_texCoord = a_texCoord;
    gl_Position = u_proj * u_view * vec4(a_coords, 1.0);
}`;
    
var uiFragCode = `
precision highp float;
varying vec4 v_color;
varying vec2 v_texCoord;

uniform sampler2D u_texture0;
uniform float u_timer;

void main(void) {
    gl_FragColor = v_color * texture2D(u_texture0, v_texCoord);
}`;

fragCode = uiFragCode;

var Assets = {
    blankTexture: null,
    tilesTexture: null,
    shader: null,
    uiShader: null,
};

function load_assets(){
    Assets.shader = new Shader(vertCode, fragCode);
    Assets.uiShader = new Shader(uiVertCode, uiFragCode);
    Assets.tilesTexture = new Texture(noise_rgb(8,8, 0.0, 0.0), 8,8, gl.RGB);
    Assets.tilesTexture.loadFile('atlas.png');
    
    Assets.blankTexture = new Texture(solid_rgb(8,8, 255,255,255), 8,8, gl.RGB);
}
