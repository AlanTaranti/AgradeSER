/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    navigation: {
      drawerMostrar: false
    },
    layout: {
      drawerBreakpointEmTelaGrande: null
    },
    toolbar: {
      toolbarIconeEsquerdaClicado: false
    }
  },

  getters: {
    drawerMostrar: state => state.navigation.drawerMostrar,
    drawerBreakpointEmTelaGrande: state => state.layout.drawerBreakpointEmTelaGrande,
    toolbarIconeEsquerdaClicado: state => state.toolbar.toolbarIconeEsquerdaClicado,
  },

  mutations: {
    drawerMostrar: (state, drawerMostrar) => {
      state.navigation.drawerMostrar = drawerMostrar;
    },
    drawerAlternar: (state) => {
      state.navigation.drawerMostrar = !state.navigation.drawerMostrar;
    },
    drawerBreakpointEmTelaGrande: (state, drawerBreakpointEmTelaGrande) => {
      state.layout.drawerBreakpointEmTelaGrande = drawerBreakpointEmTelaGrande;
    },
    toolbarIconeEsquerdaClicado: (state, toolbarIconeEsquerdaClicado) => {
      state.toolbar.toolbarIconeEsquerdaClicado = toolbarIconeEsquerdaClicado;
    }
  },
});

export default store;
