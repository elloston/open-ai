<template>
    <div v-if="loading" class="loading">
      <button type="button" class="bg-indigo-500 opacity-70 px-6 py-2" disabled>Processing...</button>
    </div>
  <router-view />
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.state.loading
    }
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}
.loading {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
