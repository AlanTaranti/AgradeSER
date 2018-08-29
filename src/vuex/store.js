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
    },
    toaster: {
      toasterMostrar: false,
      toasterMensagem: '',
      toasterColor: 'primary',
    }
  },

  getters: {
    drawerMostrar: state => state.navigation.drawerMostrar,
    drawerBreakpointEmTelaGrande: state => state.layout.drawerBreakpointEmTelaGrande,
    toolbarIconeEsquerdaClicado: state => state.toolbar.toolbarIconeEsquerdaClicado,
    toasterMostrar: state => state.toaster.toasterMostrar,
    toasterMensagem: state => state.toaster.toasterMensagem,
    toasterColor: state => state.toaster.toasterColor,
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
    },
    toasterMostrar: (state, toasterMostrar) => {
      state.toaster.toasterMostrar = toasterMostrar;
    },
    toasterMensagem: (state, toasterMensagem) => {
      state.toaster.toasterMensagem = toasterMensagem;
    },
    toasterColor: (state, toasterColor) => {
      state.toaster.toasterColor = toasterColor;
    },
  },
});

export default store;
