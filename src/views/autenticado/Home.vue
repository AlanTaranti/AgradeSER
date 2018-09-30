<template>
  <v-container fluid style="padding: 0;">

    <!-- Dialog -->
    <v-dialog v-model="dialogQuestion.show" max-width="290">
      <v-card raised hover color="white" v-if="dialogQuestion.show">
        <v-card-title primary-title>
          <div v-if="dialogQuestion.titleText" class="headline grey--text text--darken-3">
            {{dialogQuestion.titleText}}
          </div>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat="flat" @click.native="dialogQuestion.actionButtonFunction()">
            {{dialogQuestion.actionButtonText}}
          </v-btn>
          <v-btn color="success" flat="flat" @click.native="dialogQuestion.show = false">
            {{dialogQuestion.cancelButtonText}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template v-for="relato in relatos">
      <v-flex xs12>
        <relato-card class="mb-3" :id="relato.id" :titulo="relato.titulo" :conteudo="relato.conteudo"
                     :data="relato.data.toDate()" :local="relato.local.nome" :relato="relato" :eh-lixeira="ehLixeira"/>
      </v-flex>
    </template>

    <!-- FAB -->
    <button-action
      :icone="fabIcon"
      @botao-clicado="fabFunction"/>
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
      ehLixeira: false,
      dbRefs: {
        relatosRef: null,
      },
      dialogQuestion: {
        show: false,
        titleText: 'Deseja mover o relato para a lixeira?',
        cancelButtonText: 'Cancelar',
        actionButtonText: 'Lixeira',
        actionButtonFunction: this.removerRelato,
      },

    }),

    computed: {
      fabIcon() {
        if (this.$route.path === '/lixeira') {
          return 'fas fa-trash-alt';
        }
        else {
          return 'fas fa-plus';
        }
      },
    },

    methods: {

      fabFunction() {
        if (this.$route.path === '/lixeira') {
          this.dialogQuestion.titleText = 'Deseja esvaziar a lixeira?';
          this.dialogQuestion.actionButtonFunction = this.excluirTodosRelatosPermanentemente;
          this.dialogQuestion.actionButtonText = 'Excluir';
          this.dialogQuestion.show = true;
        }
        else {
          this.criarRelato();
        }
      },

      excluirTodosRelatosPermanentemente() {
        let counter = 0;
        const quantidade = this.relatos.length;
        const self = this;

        this.dialogQuestion.show = false;

        this.relatos.forEach(function (relato) {
          self.dbRefs.relatosRef.doc(relato.id).delete()
            .then(function () {
              counter++;
              if (counter === quantidade) {
                self.$store.commit('toasterMensagem', 'Relatos excluidos permanentemente com sucesso!');
                self.$store.commit('toasterColor', 'success');
                self.$store.commit('toasterMostrar', true);
              }
            })
            .catch(function () {
              self.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
              self.$store.commit('toasterColor', 'error');
              self.$store.commit('toasterMostrar', true);
            })
        })

      },

      criarRelato() {
        this.$router.push({name: 'relato'});
      },

      inicializar() {
        /* Firestore References */
        const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
        this.dbRefs.relatosRef = userRef.collection('relatos');

        this.loadRelatos();
      },

      loadRelatos() {
        this.ehLixeira = false;
        this.relatos = [];
        const caderno = this.$route.params.caderno;
        let ref = null;

        if (!caderno) {
          if (this.$route.path === '/home') {
            this.$store.commit('toolbarTitulo', 'AgradeSER');
            ref = this.dbRefs.relatosRef.where('lixeira', '==', false);
          }
          else if (this.$route.path === '/lixeira') {
            this.$store.commit('toolbarTitulo', 'Lixeira');
            this.ehLixeira = true;
            ref = this.dbRefs.relatosRef.where('lixeira', '==', true);
          }

        }
        else {
          const filtro = this.$route.params.filtro;

          const cadernoCapitalized = caderno.charAt(0).toUpperCase() + caderno.slice(1);

          const filtroDecodificado = atob(filtro);

          ref = this.dbRefs.relatosRef.where('lixeira', '==', false);

          if (caderno === 'pessoas') {
            this.$store.commit('toolbarTitulo', [cadernoCapitalized, filtroDecodificado].join(' - '));

            ref = ref.where([caderno, filtroDecodificado].join('.'), '==', true);
          }
          else if (caderno === 'emocoes') {
            this.$store.commit('toolbarTitulo', [cadernoCapitalized, filtroDecodificado].join(' - '));

            ref = ref.relatosRef.where('emocao.emotion', '==', filtroDecodificado);
          }
          else if (caderno === 'local') {
            this.$store.commit('toolbarTitulo', filtroDecodificado);
            ref = ref.relatosRef.where([caderno, 'nome'].join('.'), '==', filtroDecodificado);
          }
          else if (caderno === 'tags') {
            this.$store.commit('toolbarTitulo', [cadernoCapitalized, filtroDecodificado].join(' - '));
            ref = ref.relatosRef.where(['tags', filtroDecodificado].join('.'), '==', true);
          }
        }

        ref.orderBy('data', 'desc');

        this.$bind('relatos', ref);
      }
    },

    watch: {
      $route(to, from) {
        this.inicializar();
      }
    },

    created() {
      this.inicializar();
    }
  }
</script>

<style scoped>

</style>
