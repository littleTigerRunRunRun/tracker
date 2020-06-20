// 本项目为了追求组件切换效果，并不适用vue-router，但是路由必须得到解析，否则无法传播
// 这里我们约定一下路由
// page级别 / = /home, /game, /about
// 作品 /piece/[CateName]/[PieceName]，例如threejs分类下面的颜色替换项目colorReplace： /piece/threejs/colorReplace
class PathSorter {
  _path = '/'
  get path() { return this._path }
  set path(path) {
    this._path = path
    this.sort()
  }

  _paths = []
  get paths() { return this._paths }

  sort() {
    const paths = this._path.split('?')[0].split('/').slice(1)
    if (!paths[0]) paths[0] = 'home'
    this._paths = paths
  }
}

export const sorter = new PathSorter()
