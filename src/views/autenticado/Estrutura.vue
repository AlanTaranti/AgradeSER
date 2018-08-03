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
    data: () => ({
      drawerMostrar: false,
      toast: {
        mostrar: false,
        cor: '',
        texto: '',
      },
    }),
    methods: {

      /* Drawer */

/*      // Retorna true caso a largura da tela for acima de determinado limiar
      // Usado para mostrar o drawer em telas de grande largura
      drawerMostrarPorBreakpoint() {
        return this.$vuetify.breakpoint.width > LayoutProps.biggerScreenBreakpoint;
      },

      // Alterna entre mostrar/esconder o drawer
      drawerAlternar() {
        this.drawerMostrar = this.drawerMostrarPorBreakpoint() || !this.drawerMostrar;
      },

      // Atualiza a varivavel de controle, caso o componente filho altere o status do drawer
      drawerAtualizarDoFilho(value) {
        this.drawerMostrar = this.drawerMostrarPorBreakpoint() || value;
      },*/
    },

  };

</script>

<style scoped>

</style>
