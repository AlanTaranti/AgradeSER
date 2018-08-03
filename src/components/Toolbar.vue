<template>
    <v-toolbar dark color="primary" app absolute clipped-left>
        <v-toolbar-side-icon v-if="iconeMenuMostrar" @click="drawerAlternar()"/>
        <span class="title">AgradeSER</span>
        <div v-if="iconeEsquerda.mostrar" class="d-flex align-center" style="margin-left: auto">
            <v-btn icon @click="iconeEsquerdaClicado()">
                <v-icon>{{ iconeEsquerda.icone }}</v-icon>
            </v-btn>
        </div>
    </v-toolbar>
</template>

<script>

    import store from '../vuex/store';

    export default {
      name: 'toolbar',
      store: store,
      data: () => ({
        iconeEsquerda: {
          icone: 'fas fa-search',
          mostrar: true,
        },
      }),
      computed: {

        /* Show Icon */
        iconeMenuMostrar() {
          return this.$vuetify.breakpoint.width <= this.$store.getters.drawerBreakpointEmTelaGrande;
        },

      },
      methods: {

        /* Drawer */
        drawerAlternar() {
          this.$store.commit('drawerAlternar');
        },

        /* Icone Esquerda */
        iconeEsquerdaClicado() {
          this.$store.commit('toolbarIconeEsquerdaClicado', true);
        }

      },
    };
</script>

<style scoped>

</style>
