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
  float wy = 108.0;
  float wz = 1.0;
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

float borealCloud(vec3 p) {
	p += fbm(vec3(p.x, p.y, 0.0) * 0.5) * 2.25;
	float a = smoothstep(0.0, 0.9, fbm(p * 2.0) * 2.2 - 1.1);
    
	return a < 0.0 ? 0.0 : a;
}

float myDeal(vec3 p) {
  p += fbm(vec3((p.xy + vec2(u_time)), 0.0) * 0.5) * 2.25;
  float a = smoothstep(0.0, 0.9, fbm(p) * 2.2 - 1.1);
	return a < 0.0 ? 0.0 : a;
}

void main() {
  gl_FragColor = vec4(
    vec3(myDeal(vec3(vUv * 16.0, 0.0))), 1.0
  );
}