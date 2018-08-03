<!--

    Componente: Estrutura

    Responsabilidade: Gerenciar a visão geral da aplicação (Drawer, Toolbar e Conteúdo)

-->

<template>
  <v-container fluid>
    <navigation-drawer/>
    <toolbar/>
    <v-content>
      <router-view/>
    </v-content>
  </v-container>
</template>

<script>

  import Toolbar from '../../components/Toolbar';
  import NavigationDrawer from '../../components/NavigationDrawer';


  export default {
    name: 'Estrutura',
    components: {
      Toolbar,
      NavigationDrawer,
    },

  };

</script>

<style scoped>

</style>
