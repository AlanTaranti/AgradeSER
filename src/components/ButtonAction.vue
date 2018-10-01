<template>
  <v-btn
    fixed
    bottom
    right
    dark
    fab
    color="accent"
    @click="botaoClicado">
    <v-icon v-if="!loading">{{ icone }}</v-icon>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="white">
    </v-progress-circular>
  </v-btn>
</template>

<script>
  export default {
    name: 'button-action',
    props: ['icone', 'loading'],
    methods: {
      botaoClicado() {
        if (!this.loading) {
          this.$emit('botao-clicado');
        }
      },
    },
  };
</script>

<style scoped>
  .v-btn--floating .v-icon {
    height: unset;
    width: inherit;
  }
</style>
