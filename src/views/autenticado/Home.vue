<template>
  <v-container fluid>
    <template v-for="relato in relatos">
      <v-flex xs12>
        <relato-card class="mb-3" :id="relato.id" :titulo="relato.titulo" :conteudo="relato.conteudo"
                     :data="relato.data.toDate()" :local="relato.local"/>
      </v-flex>
    </template>
  </v-container>
</template>

<script>
  import RelatoCard from '../../components/RelatoCard'

  import db from '../../main'
  import firebase from 'firebase'

  export default {
    name: "Home",
    components: {
      RelatoCard,
    },
    firestore() {
      return {}
    },
    data: () => ({
      relatos: [],
      relato: {
        id: 1,
        titulo: 'Novas Aventuras',
        conteudo: 'Hoje exploramos a Malásia',
        data: new Date(),
        local: 'Campo Grande'
      },
    }),
    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      const relatosRef = userRef.collection('relatos').orderBy('createdAt');

      this.$bind('relatos', relatosRef);
    }
  }
</script>

<style scoped>

</style>
