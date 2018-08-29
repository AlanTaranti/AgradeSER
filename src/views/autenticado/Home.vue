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
    }),

    methods: {
      criarRelato(){
        this.$router.push({name: 'relato'});
      }
    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      const relatosRef = userRef.collection('relatos').orderBy('createdAt', 'desc');

      this.$bind('relatos', relatosRef);
    }
  }
</script>

<style scoped>

</style>
