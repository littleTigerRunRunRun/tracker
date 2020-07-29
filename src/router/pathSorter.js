// 本项目为了追求组件切换效果，并不适用vue-router，但是路由必须得到解析，否则无法传播
// 这里我们约定一下路由
// page级别 / = /home, /game, /about
// 作品 /piece/[CateName]/[PieceName]，例如threejs分类下面的颜色替换项目colorReplace： /piece/threejs/colorReplace
class PathSorter {
  constructor() {
    this._path = location.href
    this.sort()
    this.replace()
  }

  _path = '/'
  get path() { return this._path }

  _paths = []
  get paths() { return this._paths }

  sort() {
    let paths = this._path.split('?')[0].split('#')
    this.origin = location.origin
    if (paths.length === 1) {
      this._paths = ['home']
    } else {
      paths = paths[1].split('/').slice(1)
      if (!paths[0]) paths[0] = 'home'
      this._paths = paths
    }
  }

  replace(paths) {
    if (paths) this._paths = paths
    let href = `${this.origin}/#`
    if (this._paths.length === 0) href += '/'
    else {
      for (const path of this._paths) {
        href += `/${path}`
      }
    }

    location.replace(href)
  }
}

export const sorter = new PathSorter()
