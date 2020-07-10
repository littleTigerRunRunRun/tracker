// 没有脏值树的osc
class EasyOsc {
  constructor({ config, width = 100, height = 100 }) {
    this.config = config

    this.init()
  }

  init() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  refreshSize(width, height) {
    this.width = this.canvas.width = width
    this.height = this.canvas.height = height
  }

  render() {}
}

export default class {
  constructor({ container, config }) {
    this.setConfig(config)
    this.initCanvas(container)
    this.initParts()
    this.refreshSize()

    this.onResize = this.refreshSize.bind(this)
    window.addEventListener('resize', this.onResize)
  }

  initCanvas(container) {
    this.container = container
    this.buffer = new EasyOsc({ config: this.config })
    this.buffer.render = this.render.bind(this)
    this.canvas = this.buffer.canvas
    this.ctx = this.buffer.ctx
    this.container.appendChild(this.canvas)
  }

  initParts() {
    // 上方的指针部分
    this.partScales = new EasyOsc({ config: this.config.scales })
    this.partScales.render = this.renderScales.bind(this.partScales)
  }

  refreshSize() {
    const bound = this.container.getBoundingClientRect()

    this.canvas.style.width = bound.width + 'px'
    this.canvas.style.height = bound.height + 'px'

    this.partScales.refreshSize(bound.width, bound.height)
    this.partScales.render()

    this.buffer.refreshSize(bound.width, bound.height)
    this.buffer.render()
  }

  setConfig(config) {
    this.config = config
  }

  refreshClips() {

  }

  renderScales() {
    // console.log(this.width, this.height, this.config)
    this.ctx.clearRect(0, 0, this.width, this.height)
    const config = this.config
    const height = this.config.height

    // 绘制时间轴刻度
    this.ctx.textAlign = 'center'
    for (let i = 0; i < this.width; i += config.unitInterval) {
      for (let j = 0; j < config.layers.length; j++) {
        const layer = config.layers[j]
        if (i % layer.interval === 0) {
          this.ctx.beginPath()
          this.ctx.fillStyle = layer.color
          this.ctx.rect(i + config.indent, height - layer.height, layer.width, layer.height)
          this.ctx.fill()
          this.ctx.closePath()

          if (layer.number) {
            this.ctx.fillText(i / config.unitInterval * config.unitFrame + config.unitText, i + config.indent, height - layer.height - 7)
          }

          j = config.layers.length
        }
      }
    }
    this.ctx.fillStyle = config.layers[config.layers.length - 1].color
    this.ctx.rect(0, height - 1, this.width, 1)
    this.ctx.fill()

    // 绘制刻度单位对应的grid
    this.ctx.fillStyle = config.scaleLineColor
    for (let i = 0; i < this.width; i += config.unitInterval) {
      this.ctx.rect(i + config.indent, height, 1, this.height - height)
      this.ctx.fill()
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.drawImage(this.partScales.canvas, 0, 0, this.partScales.width, this.partScales.height)
  }

  destroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
