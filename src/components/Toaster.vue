<template>
  <v-snackbar
    :timeout=3000
    :color="toasterColor"
    v-model="toasterMostrar">
    <b>{{ toasterMensagem }}</b>
  </v-snackbar>
</template>

<script>

  import store from '../vuex/store';

  export default {
    name: 'toaster',
    store: store,
    computed: {
      toasterMostrar: {
        set(toasterMostrar) {
          this.$store.commit('toasterMostrar', toasterMostrar);
        },
        get() {
          return this.$store.getters.toasterMostrar;
        }
      },
      toasterMensagem: {
        set(toasterMensagem) {
          this.$store.commit('toasterMensagem', toasterMensagem);
        },
        get() {
          return this.$store.getters.toasterMensagem;
        }
      },
      toasterColor: {
        set(toasterColor) {
          this.$store.commit('toasterColor', toasterColor);
        },
        get() {
          return this.$store.getters.toasterColor;
        }
      },
    },
  };
</script>

<style scoped>
</style>
