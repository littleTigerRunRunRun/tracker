pipe的一个用例
```js
// 为了面对需要多次pass传递结果多次处理后得出最终渲染内容的情况，合理的方式是创建一条管道
const geometryPass = new Pass({
  initialize // 加载所有models的初始化函数
  render // 改变uniforms并且渲染models到他的渲染目标
  target // 可以是一个framebuffer，如果它为空，则被认为渲染到屏幕上（目标canvas）
  output // 作为后续输出的内容，可以直接就是target，也可以是数值
})

const txaaPass = new Pass({
  initialize
  render
  target
})

//
const pipe = [
  [
    // pass指出了需要被执行的pas
    // output意味着这个pass的输出被后面组的pass引用时，引用名是"t_geometry"，如果它不会被引用，那么output也是不必要的
    // 在使用MRT时，可能会用到outputs以输出多个name值
    { pass: geometryPass, output: 't_geometry', outputs: null }
  ], // array means it can be parallel
  [
    // input数组指出了这个pass所依赖的前管线output内容，值得注意的是，这个name可能会被设计成同样可以指向后续pass，不过这时就是上一次的渲染内容了（只是一种可能，因为在这个pass渲染时，理论上下个pass的内容仍未清除
    { pass: txaaPass, input: ['t_geometry'] }
  ]
]
pipe.run() // then the pipe will run through
```