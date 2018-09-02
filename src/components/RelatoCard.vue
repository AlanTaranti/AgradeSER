<!--

    Componente: Relato Card

    Responsabilidade: Mostrar o resumo de um relato em um card

-->

<template>

  <v-container fluid>
    <v-dialog v-model="dialogRemover" max-width="290">
      <v-card raised hover color="white" v-if="dialogRemover">
        <v-card-title primary-title>
          <div v-if="titulo" class="headline grey--text text--darken-3">Tem certeza que você quer excluir o relato?</div>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat="flat" @click.native="removerRelato()">Excluir</v-btn>
          <v-btn color="success" flat="flat" @click.native="dialogRemover = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card raised hover color="white">

      <!-- Dados do Cartão -->
      <v-card-title primary-title>

        <!-- Titulo -->
        <div v-if="titulo" class="headline grey--text text--darken-3">{{titulo}}</div>

        <div class="content">

          <!-- Conteúdo -->
          <p>{{conteudo}}</p>

          <!-- Meta Dados -->
          <v-layout row justify-space-around class="grey--text text--darken-1">
            <v-flex v-if="data" class="text-xs-center xs6">
              <span>{{ data | date }}</span>
            </v-flex>
            <v-flex v-if="local" class="text-xs-center xs6">
              <span>{{ local | location }}</span>
            </v-flex>
          </v-layout>

        </div>
      </v-card-title>

      <!-- Ações do Cartão -->
      <v-card-actions>
        <v-layout row justify-space-around>
          <template v-for="botaoRodape in relatoBotoesRodape">
            <v-flex class="text-xs-center">
              <v-btn flat :disabled="botaoRodape.desabilitado"
                     @click="!botaoRodape.desabilitar ? acaoRelato(botaoRodape.acao) : ''">
                <v-icon color="iconLight">
                  {{ botaoRodape.icone }}
                </v-icon>
              </v-btn>
            </v-flex>
          </template>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>

  import moment from 'moment';
  import firebase from 'firebase'
  import db from '../main'
  import store from '../vuex/store';

  moment.locale('pt-br');

  export default {
    name: "RelatoCard",
    props: ['id', 'titulo', 'conteudo', 'data', 'local'],
    store: store,
    data: () => ({
      dbRefs: {
        relatosRef: null,
      },
      dialogRemover: false,
      relatoBotoesRodape: [
        {
          acao: 'EDITAR',
          icone: 'fas fa-edit',
          desabilitado: false,
        },
        {
          acao: 'EXCLUIR',
          icone: 'fas fa-trash-alt',
          desabilitado: false,
        },
      ],
    }),

    filters: {
      date: function (date) {
        return moment(date).format('ll');
      },

      location: function (local) {
        return local;
      }
    },

    methods: {

      removerRelato(){
        const self = this;
        this.dbRefs.relatosRef.doc(this.id).delete()
          .then(function () {
            self.$store.commit('toasterMensagem', 'Relato removido com sucesso!');
            self.$store.commit('toasterColor', 'success');
            self.$store.commit('toasterMostrar', true);
            self.dialogRemover = false;
          })
          .catch(function () {
            self.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
            self.$store.commit('toasterColor', 'error');
            self.$store.commit('toasterMostrar', true);
            self.dialogRemover = false;
          })
      },

      acaoRelato(acao) {
        switch(acao) {
          case 'LER':
            this.$router.push({ path: `/relato/${this.id}`});
            break;
          case 'EDITAR':
            this.$router.push({ path: `/relato/${this.id}`});
            break;
          case 'EXCLUIR':
            this.dialogRemover = true;
            break;
          default:
            break;
        }
      }

    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');
    }
  }
</script>

<style scoped>

  @import url('https://fonts.googleapis.com/css?family=Montserrat:700|Open+Sans');

  .headline {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 24px !important;
    line-height: 32px !important;
  }

  .content {
    font-family: 'Open Sans', sans-serif !important;
    width: 100%;
  }

</style>
