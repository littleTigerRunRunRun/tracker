<template>
  <tracker-view>
    <md-app slot="main">
      <md-app-drawer class="navigator" md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item>
            <span class="md-list-item-text">
              <md-button class="md-primary">Inbox</md-button>
            </span>  
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text">
              <md-button class="md-primary">Sent Mail</md-button>
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
    </md-app>
  </tracker-view>
</template>

<script>
  import trackerView from '@/components/page/tracker-view'

  export default {
    name: "Home",
    components: {
      trackerView
    }
  }
</script>

<style lang="scss">
  
</style>
