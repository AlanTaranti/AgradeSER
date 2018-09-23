<!--

    Componente: Estrutura

    Responsabilidade: Gerenciar a visão geral da aplicação (Drawer, Toolbar e Conteúdo)

-->

<template>
  <v-container fluid>
    <navigation-drawer/>
    <toolbar/>
    <v-content>
      <!-- Telas -->
      <router-view/>
      <!-- Toaster-->
      <toaster/>
    </v-content>
  </v-container>
</template>

<script>

  import Toolbar from '../../components/Toolbar';
  import NavigationDrawer from '../../components/NavigationDrawer';
  import Toaster from '../../components/Toaster';


  export default {
    name: 'Estrutura',
    components: {
      Toolbar,
      NavigationDrawer,
      Toaster,
    },

  };

</script>

<style scoped>

</style>
