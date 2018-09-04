<template>
  <v-container fluid>
    <template v-for="card in cards">
      <v-flex xs12>
        <caderno-card class="mb-3" :titulo="card.titulo" :tipo="tipo"/>
      </v-flex>
    </template>
  </v-container>
</template>

<script>

  import db from '../../main'
  import firebase from 'firebase'
  import CadernoCard from '../../components/CadernoCard'
  import store from '../../vuex/store';

  export default {
    name: "Caderno",
    components: {
      CadernoCard,
    },
    store: store,
    data: () => ({
      dbRefs: {
        relatosRef: null,
        localizacoesRef: null,
        pessoasRef: null,
        tagsRef: null,
      },
      tipo: null,
      cards: [],
    }),

    methods: {

      getPessoas() {
        this.$store.commit('toolbarTitulo', 'Pessoas');
        const self = this;
        this.dbRefs.pessoasRef.orderBy('nome').get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const pessoa = doc.data();
            self.cards.push({
              titulo: pessoa.nome,
            })
          })
        });
      },

      getLocalizacoes() {
        this.$store.commit('toolbarTitulo', 'Localizações');
        const self = this;
        this.dbRefs.localizacoesRef.orderBy('nome').get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const localizacao = doc.data();
            self.cards.push({
              titulo: localizacao.nome,
            })
          })
        });
      },

      loadCadernos(){
        this.cards = [];
        const caderno = this.$route.params.caderno;
        switch (caderno) {
          case 'pessoas':
            this.tipo = 'pessoas';
            this.getPessoas();
            break;
          case 'localizacoes':
            this.tipo = 'local';
            this.getLocalizacoes();
            break;
          case 'tags':
            this.tipo = 'tags';
            break;
          default:
            break;
        }
      }
    },

    watch:{
      $route (to, from){
        if (to.name === 'caderno' && to.params.caderno !== from.params.caderno){
          this.loadCadernos();
        }
      }
    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');
      this.dbRefs.localizacoesRef = userRef.collection('localizacoes');
      this.dbRefs.pessoasRef = userRef.collection('pessoas');
      this.dbRefs.tagsRef = userRef.collection('tags');

      this.loadCadernos();
    },
  }
</script>

<style scoped>
  @media only screen and (max-width: 959px) {
    .container {
      padding: 0;
    }
  }
</style>
