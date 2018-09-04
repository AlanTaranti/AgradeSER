<template>
  <v-container fluid style="padding: 0;">
    <template v-for="relato in relatos">
      <v-flex xs12>
        <relato-card class="mb-3" :id="relato.id" :titulo="relato.titulo" :conteudo="relato.conteudo"
                     :data="relato.data.toDate()" :local="relato.local.nome"/>
      </v-flex>
    </template>

    <!-- FAB -->
    <button-action
      icone="fas fa-plus"
      @botao-clicado="criarRelato"/>
  </v-container>
</template>

<script>
  import RelatoCard from '../../components/RelatoCard'
  import ButtonAction from '../../components/ButtonAction'

  import db from '../../main'
  import firebase from 'firebase'

  export default {
    name: "Home",
    components: {
      RelatoCard,
      ButtonAction,
    },
    firestore() {
      return {}
    },
    data: () => ({
      relatos: [],
      dbRefs: {
        relatosRef: null,
      },
    }),

    methods: {
      criarRelato() {
        this.$router.push({name: 'relato'});
      },

      loadRelatos() {
        this.relatos = [];
        const caderno = this.$route.params.caderno;
        let ref = null;

        if (!caderno) {
          this.$store.commit('toolbarTitulo', 'AgradeSER');
          ref = this.dbRefs.relatosRef;
        }
        else {
          const filtro = this.$route.params.filtro;

          const cadernoCapitalized = caderno.charAt(0).toUpperCase() + caderno.slice(1);

          const filtroDecodificado = atob(filtro);

          if (caderno !== 'local') {
            this.$store.commit('toolbarTitulo', [cadernoCapitalized, filtroDecodificado].join(' - '));

            ref = this.dbRefs.relatosRef.where([caderno, filtroDecodificado].join('.'), '==', true);
          }
          else {
            this.$store.commit('toolbarTitulo', filtroDecodificado);
            ref = this.dbRefs.relatosRef.where([caderno, 'nome'].join('.'), '==', filtroDecodificado);
          }
        }

        ref.orderBy('createdAt', 'desc');

        this.$bind('relatos', ref);
      }
    },

    watch: {
      $route(to, from) {
        if (from.name === 'home') {
          this.loadRelatos();
        }
      }
    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');

      this.loadRelatos();
    }
  }
</script>

<style scoped>

</style>
