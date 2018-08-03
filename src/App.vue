<!--

    Componente: App

    Responsabilidade: Conter as rotas da tela redirecionar pra ela principal

-->

<template>
  <v-app class="background">
    <router-view/>
  </v-app>
</template>

<script>

  export default {
    name: 'app',
  };

</script>
