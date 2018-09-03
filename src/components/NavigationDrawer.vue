<template>
  <v-navigation-drawer
    fixed
    clipped
    app
    v-model="drawerMostrar"
    color="background">
    <v-list
      dense
      color="background">
      <template v-for="item in drawerItens">
        <v-layout
          row
          v-if="item.cabecalho"
          align-center
          :key="item.cabecalho">
          <v-flex xs6>
            <v-subheader v-if="item.cabecalho">
              {{ item.cabecalho }}
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.filhos"
          v-model="item.model"
          append-icon=""
          :key="item.texto"
          :prepend-icon="item.model ? item.icone : item.iconeAlternativo">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title v-text="item.texto"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="filho in item.filhos"
            :key="filho.texto"
            :disabled="filho.desabilitar"
            @click="onClickItemMenu(filho)">
            <v-list-tile-action v-if="filho.icone">
              <v-icon>{{ filho.icone }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="filho.texto"/>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile
          v-else
          :disabled="item.desabilitar"
          :key="item.texto"
          @click="onClickItemMenu(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icone }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.texto }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

  import store from '../vuex/store';
  import firebase from 'firebase';


  export default {
    name: 'drawer',
    store: store,
    data: () => ({
      drawerItens: [
        {cabecalho: 'Relatos'},
        {icone: 'fas fa-book', texto: 'Todos os relatos', rota: {name: 'home'}, desabilitar: false},
        {
          icone: 'fas fa-angle-up',
          iconeAlternativo: 'fas fa-angle-down',
          texto: 'Cadernos',
          model: false,
          filhos: [
            {icone: 'fas fa-user', texto: 'Pessoas', rota: {path: 'cadernos', urlparam: 'pessoas'}, desabilitar: false},
            {icone: 'fas fa-heart', texto: 'Emoções', rota: 'emotions', desabilitar: true},
            {icone: 'place', texto: 'Locais', rota: 'places', desabilitar: true},
          ],
        },
        {
          icone: 'fas fa-angle-up',
          iconeAlternativo: 'fas fa-angle-down',
          texto: 'Tags',
          model: false,
          filhos: [
            {icone: 'add', texto: 'Adicionar', id: 'tag_add', desabilitar: true},
          ],
        },
        {cabecalho: 'AgradeSER'},
        {icone: 'fas fa-cog', texto: 'Configurações', id: 'settings', desabilitar: true},
        {icone: 'fas fa-comment-alt', texto: 'Enviar feedback', id: 'feedback', desabilitar: true},
        {icone: 'fas fa-sign-out-alt', texto: 'Sair', id: 'sair', desabilitar: false, action: 'logout'},
      ],
    }),

    computed: {
      drawerMostrar: {
        set(drawerMostrar) {
          this.$store.commit('drawerMostrar', drawerMostrar);
        },
        get() {
          return this.$store.getters.drawerMostrar;
        }
      }
    },

    methods: {
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.push({'name': 'login'});
        })
      },

      onClickItemMenu(item) {
        if (item.desabilitar) {
          return
        }

        if (item['action']) {
          this[item.action]();
        }

        if (item['rota']) {

          if (item.rota.name) {
            this.$router.push({'name': item.rota.name});
          }
          else if (item.rota.path && item.rota.urlparam) {
            this.$router.push({path: `/${item.rota.path}/${item.rota.urlparam}`});
          }

        }
      }
    },

  };
</script>

<style scoped>

</style>
