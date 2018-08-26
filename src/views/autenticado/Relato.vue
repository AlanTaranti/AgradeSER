<template>
  <v-container fluid>

    <!-- Date Picker -->
    <v-flex xs12 sm6 md4>
      <v-menu
        v-model="models.menuDatePicker"
        absolute
        offset-y
        lazy
        origin="center center"
        transition="scale-transition"
        style="width: 100%;">

        <v-card slot="activator" style="width: 100%;">
          <v-layout justify-space-between row fill-height>

            <!-- Dia do Mês -->
            <v-flex xs3>
              <v-card-text align-center class="center-content-vh" style="height: 100%;">
                <span>{{ diaDoRelato }}</span>
              </v-card-text>
            </v-flex>

            <v-flex xs9>
              <v-card-text class="text-xs-left">
                <!-- Dia da Semana-->
                <span class="text-xs-left">{{ diaDaSemanaDoRelato }}</span>
                <br>
                <!-- Mẽs e Ano -->
                <span class="text-xs-left">{{ mesEAnoDoRelato  }}</span>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>

        <v-date-picker v-model="models.datePicker"></v-date-picker>

      </v-menu>
    </v-flex>

    <!-- Título -->
    <v-flex xs12 sm6 md4 style="margin-top: 10px;">
      <v-text-field
        placeholder="Título"
        v-model="relato.titulo"
        single-line/>
    </v-flex>

    <!-- Conteúdo -->
    <v-flex x12 sm6 md4>
      <v-textarea
        placeholder="Conteúdo"
        v-model="relato.conteudo"
      />
    </v-flex>
  </v-container>
</template>

<script>

  import moment from 'moment';

  moment.locale('pt-br');


  export default {
    name: "Relato",
    data: () => ({
      models: {
        datePicker: moment().format('YYYY-MM-DD'),
        menuDatePicker: false,
      relato: {
        titulo: null,
        conteudo: null,
      }
    }),

    computed: {
      diaDoRelato() {
        return moment(this.models.datePicker).format('DD');
      },
      diaDaSemanaDoRelato() {
        return moment(this.models.datePicker).format('dddd');
      },
      mesEAnoDoRelato() {
        return moment(this.models.datePicker).format('MMMM YYYY');
      },
    },
  }
</script>

<style scoped>

  .center-content-vh {
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
