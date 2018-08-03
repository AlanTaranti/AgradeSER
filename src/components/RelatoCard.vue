<template>
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
            <v-btn flat :disabled="botaoRodape.desabilitado" @click="acaoRelato(botaoRodape.id)">
              <v-icon color="iconLight">
                {{ botaoRodape.icone }}
              </v-icon>
            </v-btn>
          </v-flex>
        </template>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>

  import moment from 'moment';

  moment.locale('pt-br');

  export default {
    name: "RelatoCard",
    props: ['id', 'titulo', 'conteudo', 'data', 'local'],
    data: () => ({
      relatoBotoesRodape: [
        {
          icone: 'fas fa-book-open',
          desabilitado: true,
        },
        {
          id: 'EDITAR',
          icone: 'fas fa-edit',
          desabilitado: true,
        },
        {
          id: 'REMOVER',
          icone: 'fas fa-trash-alt',
          desabilitado: true,
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

      acaoRelato(acaoId) {

      }
    },
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
