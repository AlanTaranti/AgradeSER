<template>
  <v-btn
    fixed
    bottom
    right
    dark
    fab
    color="accent"
    @click="botaoClicado">
    <v-icon>{{ icone }}</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'button-action',
    props: ['icone'],
    methods: {
      botaoClicado() {
        this.$emit('botao-clicado');
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
