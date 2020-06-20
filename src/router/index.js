import Home from '../views/home'
import Game from '../views/game'
import About from '../views/about'

export { sorter } from './pathSorter'

export const pages = {
  home: {
    name: 'HomeMain',
    component: Home
  },
  game: {
    game: 'GameMain',
    component: Game
  },
  about: {
    name: 'AboutMain',
    component: About
  }
}

class History {

}
