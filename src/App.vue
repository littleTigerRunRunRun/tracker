<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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
