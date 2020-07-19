<template>
  <div id="app">
    <page-view @pageTo="handlePageTo">
      <component
        :is="current.component"
        slot="main"
      />
    </page-view>
    <view-piece
      :piece.sync="piece"
      :straight-path.sync="straightPath"
      @pieceRefresh="handlePieceRefresh"
    />
  </div>
</template>

<script>
import PageView from './views/components/page-view'
import ViewPiece from './views/piece'
import { pages, sorter } from './router/index.js'

const components = { PageView, ViewPiece }
for (const key in pages) {
  const page = pages[key]
  components[page.name] = page.component
}

export default {
  name: 'App',
  components,
  provide() {
    return {
      handleViewPiece: this.handleViewPiece,
      piecesRefreshEvent: this.piecesRefreshEvent
    }
  },
  data() {
    return {
      current: {
        name: 'main',
        component: pages.home.name
      },
      piecesRefreshEvent: [],
      piece: null,
      straightPath: []
    }
  },
  created() {
    sorter.path = window.location.pathname
    this.checkRouter()
  },
  mounted() {
  },
  methods: {
    checkRouter() {
      if (sorter.paths[0] === 'piece') {
        this.straightPath = sorter.paths
      }
    },
    handlePageTo(name) {
      const page = pages[name]
      if (this.current.name === page.name) return

      this.current.name = page.name
      this.current.component = page.component
    },
    handleViewPiece(data, target) {
      if (data.type === 'gather') {
        console.log(data, target)
      } else {
        this.piece = {
          data,
          target
        }
      }
    },
    handlePieceRefresh() {
      this.piecesRefreshEvent.map((item) => { item() })
    }
  }
}
</script>

<style lang="scss">
/* webkit, opera, IE9 */
::selection {
  background:lightblue;
  background:rgb(95, 202, 252);
  color: #fff;
}
/* mozilla firefox */
::-moz-selection {
  background:rgb(0, 173, 253);
  color: #fff;
}
#app {
  font-family: 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
