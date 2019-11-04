<template>
  <div id="app">
    <page-view @pageTo="handlePageTo">
      <component
        slot="main"
        :is="current.component"
      />
    </page-view>
  </div>
</template>

<script>
import PageView from './views/components/page-view'
import { pages } from './router'

const components = { PageView }
for (const key in pages) {
  let page = pages[key]
  components[page.name] = page.component
}

export default {
  name: 'App',
  components,
  data() {
    return {
      current: {
        name: 'main',
        component: pages.home.name
      }
    }
  },
  methods: {
    handlePageTo(name) {
      let page = pages[name]
      if (this.current.name === page.name) return

      this.current.name = page.name
      this.current.component = page.component
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
