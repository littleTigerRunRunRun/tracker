class AnimePlayer {
  constructor() {
    this.storyboard = null
  }

  setTarget(target) {
    this.target = target
  }

  run() {
    if (!this.target) return
  }
}

export default new AnimePlayer()
