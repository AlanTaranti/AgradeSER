<!--

    Componente: Relato Card

    Responsabilidade: Mostrar o resumo de um relato em um card

-->

<template>

  <v-container fluid>
    <v-dialog v-model="dialogQuestion.show" max-width="290">
      <v-card raised hover color="white" v-if="dialogQuestion.show">
        <v-card-title primary-title>
          <div v-if="titulo" class="headline grey--text text--darken-3">
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

    <v-card raised hover
            style="border-left: 5px solid !important;"
            :style="{
              boxShadow: '0 3px 3px -2px rgba('+redEmoctionColor+', '+greenEmoctionColor+', '+blueEmoctionColor+', 0.2), 0 3px 4px 0 rgba('+0+', '+0+', '+0+', 0.14), 0 1px 8px 0 rgba('+redEmoctionColor+', '+greenEmoctionColor+', '+blueEmoctionColor+', 0.12)',
              borderLeftColor: emotionColor,
            }">

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
    props: ['id', 'titulo', 'conteudo', 'data', 'local', 'relato', 'ehLixeira'],
    store: store,
    data: () => ({
      relatoCopia: null,
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

    computed: {
      emotionColor() {
        return this.relato.emocao ? this.relato.emocao.color : '#9E9E9E';
      },

      redEmoctionColor() {
        const color = this.emotionColor;
        return parseInt(color[1] + color[2], 16);
      },

      greenEmoctionColor() {
        const color = this.emotionColor;
        return parseInt(color[3] + color[4], 16);
      },

      blueEmoctionColor() {
        const color = this.emotionColor;
        return parseInt(color[5] + color[6], 16);
      },
    },

    methods: {

      removerRelato() {
        const self = this;
        this.relatoCopia['lixeira'] = true;
        this.dialogQuestion.show = false;
        this.dbRefs.relatosRef.doc(this.relato.id).update(this.relatoCopia)
          .then(function () {
            self.$store.commit('toasterMensagem', 'Relato movido para a lixeira com sucesso!');
            self.$store.commit('toasterColor', 'success');
            self.$store.commit('toasterMostrar', true);
          })
          .catch(function () {
            self.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
            self.$store.commit('toasterColor', 'error');
            self.$store.commit('toasterMostrar', true);
          })
      },

      restaurarRelato() {
        const self = this;
        this.relatoCopia['lixeira'] = false;
        this.dialogQuestion.show = false;
        this.dbRefs.relatosRef.doc(this.relato.id).update(this.relatoCopia)
          .then(function () {
            self.$store.commit('toasterMensagem', 'Relato restaurado com sucesso!');
            self.$store.commit('toasterColor', 'success');
            self.$store.commit('toasterMostrar', true);
          })
          .catch(function () {
            self.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
            self.$store.commit('toasterColor', 'error');
            self.$store.commit('toasterMostrar', true);
          })
      },

      acaoRelato(acao) {
        switch (acao) {
          case 'LER':
            this.$router.push({path: `/relato/${this.id}`});
            break;
          case 'EDITAR':
            this.$router.push({path: `/relato/${this.id}`});
            break;
          case 'EXCLUIR':
            this.dialogQuestion.titleText = 'Deseja mover o relato para a lixeira?';
            this.dialogQuestion.actionButtonText = 'Lixeira';
            this.dialogQuestion.actionButtonFunction = this.removerRelato;
            this.dialogQuestion.show = true;
            break;
          case 'RESTAURAR':
            this.dialogQuestion.titleText = 'Deseja restaurar o relato?';
            this.dialogQuestion.actionButtonText = 'Restaurar';
            this.dialogQuestion.actionButtonFunction = this.restaurarRelato;
            this.dialogQuestion.show = true;
            break;
          default:
            break;
        }
      }

    },

    mounted() {
      this.relatoCopia = this.relato;
    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');

      if (this.ehLixeira) {
        this.relatoBotoesRodape = [
          {
            acao: 'RESTAURAR',
            icone: 'fas fa-undo',
            desabilitado: false,
          },
        ]
      }
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

  @media only screen and (max-width: 959px) {
    .container {
      padding: 0;
    }
  }

</style>
