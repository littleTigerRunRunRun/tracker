#define SMOOTH_V(V,R)  { float p = vUv.y - 0.2; if(p < (V)) { float a = p / (V); R *= a * a; } }

uniform float u_time;

varying vec2 vUv;

// 常用变量定义，这些定义是为了减少重复数值的使用
const float fp5 = 0.5; // fp5 = float point 5
const float f0 = 0.0;
const float f1 = 1.0;
const float f2 = 2.0;
const float f3 = 3.0;
const float PI = 3.1415926;
const float TWO_PI = 6.2831852;

// 项目内常亮定义
const vec3 starColor = vec3(.43, .57, .97);

// 可以认为在以(0.5, 0.5)为中心在调整 f(x) = x 这条直线的斜率，contrast值即是斜率的结果
float contrast(float valImg, float contrast) { 
  return clamp(contrast * (valImg - fp5) + fp5, f0, f1);
}
// 对三位向量的格式复写上面方法
vec3 contrast(vec3 valImg, float contrast)  { 
  return clamp(contrast * (valImg - fp5) + fp5, f0, f1);
}

// gamma校正
float gammaCorrection(float imgVal, float gVal) {
  return pow(imgVal, gVal);
}
vec3 gammaCorrection(vec3 imgVal, float gVal) {
  return pow(imgVal, vec3(gVal));
}

// 获取颜色的强度
// Gray = 0.299R + 0.587G + 0.114B 灰度公式
float getIntensity(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

// 一种常见的一维伪随机数
float hash( float n ) { return fract(sin(n) * 758.5453); }
// 一种常见的二维伪随机向量，出来的结果类似于白噪声
highp float rand(vec2 p) { return fract(sin(dot(p ,vec2(1552.9898, 78.233))) * 43758.5453); }
// 类似于perlin的一种三维噪声
float noise(vec3 x) {
  vec3 p = floor(x); // 整数部分，用于求晶格
  vec3 f = fract(x); // 小数部分，用于求晶格内位置
  float wx = 1.0;
  float wy = 57.0;
  float wz = 400.0;
  float n = p.x * wx + p.y * wy + p.z * wz;
  float res = mix(
    mix(
      mix(hash(n), hash(n + wx), f.x),
      mix(hash(n + wy), hash(n + wx + wy), f.x),
      f.y
    ),
    mix(
      mix(hash(n + wz), hash(n + wz + wx), f.x),
      mix(hash(n + wz + wy), hash(n + wz + wx + wy), f.x),
      f.y
    ),
  f.z);
  return res;
}
// fract brownian motion
float fbm(vec3 p) {
  float f  = 0.50000*noise(p); p *= 2.02;
        f += 0.25000*noise(p); p *= 2.03;
        f += 0.12500*noise(p); p *= 2.01;
        f += 0.06250*noise(p); p *= 2.04;
        f += 0.03125*noise(p);
  return f * 1.032258;
}
// 
float fbm2(vec3 p){
  float f  = 0.50000 * noise(p); p *= 2.021;
        f += 0.25000 * noise(p); p *= 2.027;
        f += 0.12500 * noise(p); p *= 2.01;
        f += 0.06250 * noise(p); p *= 2.03;
        f += 0.03125 * noise(p); p *= 4.01;
        f += 0.015625 * noise(p);p *= 8.04;
        f += 0.00753125 * noise(p);
  return f * 1.05;
}

// 通过叠加fbm，形成一个扭曲云雾状的贴图
float borealCloud(vec3 p) {
	p += fbm(vec3(p.x, p.y, f0) * fp5) * 2.25;
	float a = smoothstep(f0, 0.9, fbm(p * f2) * 2.2 - 1.1);
    
	return a < f0 ? f0 : a;
}

vec3 smoothCloud(vec3 c, vec2 pos) {
	c *= 0.75 - length(pos - 0.5) * 0.75;
  float w = length(c);

	// 这个vec3(w) * vec3(f1, 1.2, f1)可以说是从屏幕中心的一个径向渐变（偏绿色），然后和偏蓝色的原始值做了一个插值
	c = mix(c * vec3(1.0, 1.2, 1.6), vec3(w) * vec3(f1, 1.2, f1), w * 1.25 - 0.25);
	return clamp(c, f0, f1);
}

void main() {
  vec2 coord = vec2((vUv.x - fp5) / vUv.y, f1 / (vUv.y + 0.2));
	vec2 coord1 = coord - u_time * 0.0275;

  vec3 boreal = vec3(
    // 此处的三维向量是颜色                扭曲过的坐标值作为初始值，导致borealCloud的结果也被扭曲了
    vec3(0.1, f1, fp5) * borealCloud(vec3(coord * vec2(1.2, f1), u_time * 0.22)) * 0.9 +
    //vec3(.0,.7,.7 ) * borealCloud(vec3(coord1*vec2(.6,.6)  , tm*0.23)) * .5 +
    vec3(0.1, 0.9, 0.7) * borealCloud(vec3(coord * vec2(f1, 0.7), u_time * 0.27)) * 0.9 +
    vec3(0.75, 0.3, 0.99) * borealCloud(vec3(coord * vec2(0.8, 0.6), u_time * 0.29)) * 0.5 +
    vec3(f0, 0.99, 0.99) * borealCloud(vec3(coord1 * vec2(0.9, 0.5), u_time * 0.20)) * 0.57
  );
  
  boreal = clamp(boreal + 0.1, f0, f1); // 提亮0.1
  SMOOTH_V(0.5, boreal);
  SMOOTH_V(0.35, boreal);
  SMOOTH_V(0.27, boreal);

  boreal = smoothCloud(boreal, vUv);
  boreal = gammaCorrection(boreal, 1.3);
  
  gl_FragColor = vec4(
    boreal, f1
  );
}