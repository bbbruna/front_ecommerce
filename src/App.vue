<template>
  <div id="app">
    <NavBarComponent />
    <router-view />
  </div>
</template>

<script>

import NavBarComponent from './components/widgets/NavBarComponent.vue';


export default {
  name: 'App',
  components: {
    NavBarComponent
  }
}
</script>
