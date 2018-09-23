<template>
  <v-container fluid>

    <div class="text-xs-center" v-show="!relatoCarregado">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate>
      </v-progress-circular>
    </div>

    <div v-show="relatoCarregado">
      <!-- Date Picker -->
      <v-flex xs12 sm6 md4>

        <v-card slot="activator" style="width: 100%;">
          <v-layout justify-space-between row fill-height>

            <!-- Dia do Mês -->
            <v-flex xs3>
              <v-card-text align-center class="center-content-vh" style="height: 100%;">
                <span>{{ diaDoRelato }}</span>
              </v-card-text>
            </v-flex>

            <v-flex xs7>
              <v-card-text class="text-xs-left">
                <!-- Dia da Semana-->
                <span class="text-xs-left">{{ diaDaSemanaDoRelato }}</span>
                <br>
                <!-- Mẽs e Ano -->
                <span class="text-xs-left">{{ mesEAnoDoRelato  }}</span>
              </v-card-text>
            </v-flex>

            <v-flex xs2>
              <v-menu
                v-model="models.menuDatePicker"
                absolute
                offset-y
                lazy
                origin="center center"
                transition="scale-transition"
                style="width: 100%; height: 100%;">

                <v-date-picker v-model="models.datePicker"></v-date-picker>

                <v-card-text class="center-content-vh" style="height: 100%;" slot="activator">
                  <v-icon v-if="!models.menuDatePicker">fas fa-angle-down</v-icon>
                  <v-icon v-if="models.menuDatePicker">fas fa-angle-up</v-icon>
                </v-card-text>

              </v-menu>

            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>

      <!-- Título -->
      <v-flex xs12 sm6 md4 style="margin-top: 10px;">
        <v-text-field
          placeholder="Título"
          v-model="relato.titulo"
          single-line></v-text-field>
      </v-flex>

      <!-- Conteúdo -->
      <v-flex x12 sm6 md4>
        <v-textarea
          placeholder="Conteúdo"
          v-model="relato.conteudo"></v-textarea>
      </v-flex>

      <!-- Emotion Picker -->
      <v-flex xs12 sm6 md4>

        <v-card flat :color="models.emotionPicker.color" style="width: 100%;">
          <v-layout justify-space-between row fill-height>

            <!-- Dia do Mês -->
            <v-flex xs10>

              <v-card-text class="center-content-vh" style="height: 100%; padding: 5px;">
                <h3 class="font-weight-medium"
                    :style="{color: ['Alegria', 'Ansiedade'].indexOf(models.emotionPicker.emotion) === -1 ? 'white' : '#404040'}">
                  {{models.emotionPicker.emotion}}</h3>
              </v-card-text>
            </v-flex>

            <v-flex xs2>
              <emotion-picker v-model="models.emotionPicker"></emotion-picker>

              <v-card-text class="center-content-vh" style="height: 100%; padding: 5px;"
                           @click="models.emotionPicker.show = true">
                <v-icon v-if="!models.menuDatePicker" color="white">fas fa-angle-down</v-icon>
                <v-icon v-if="models.menuDatePicker" color="white">fas fa-angle-up</v-icon>
              </v-card-text>

            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>

      <!-- Localização -->
      <v-flex x12 sm6 md4>
        <v-text-field
          v-model="models.localizacao"
          placeholder="Local"
          prepend-icon="fas fa-map-marker-alt"
          ref="autocompleteLocation"></v-text-field>
      </v-flex>

      <!-- Selecionar Pessoas -->
      <v-flex xs12 sm6 md4>
        <v-combobox
          placeholder="Quem estava com você?"
          chips
          multiple
          prepend-icon="fas fa-user"
          append-icon=""
          v-model="models.pessoas"
          style="text-transform: capitalize;">
          <template slot="selection" slot-scope="data">
            <v-chip
              @input="pessoaRemover(data.item)"
              :selected="data.selected">
              <v-avatar
                class="accent white--text"
                v-text="data.item.slice(0, 1).toUpperCase()">
              </v-avatar>
              <strong>{{ data.item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-flex>

      <!-- Selecionar Tags -->
      <v-flex xs12 sm6 md4>
        <v-combobox
          placeholder="Tags"
          chips
          multiple
          prepend-icon="fas fa-tag"
          append-icon=""
          v-model="models.tags">
          <template slot="selection" slot-scope="data">
            <v-chip
              @input="tagRemover(data.item)"
              :selected="data.selected">
              <v-avatar
                class="accent white--text"
                v-text="data.item.slice(0, 1).toUpperCase()">
              </v-avatar>
              <strong>{{ data.item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-flex>

      <!-- FAB -->
      <button-action
        icone="fas fa-save"
        @botao-clicado="salvarRelato"/>

    </div>

  </v-container>
</template>

<script>

  import moment from 'moment';
  import md5 from 'blueimp-md5'
  import db from '../../main'
  import firebase from 'firebase'
  import store from '../../vuex/store';
  import ButtonAction from '../../components/ButtonAction'
  import EmotionPicker from '../../components/EmotionPicker'

  moment.locale('pt-br');

  export default {
    name: "Relato",
    store: store,
    components: {
      ButtonAction,
      EmotionPicker
    },
    data: () => ({
      dbRefs: {
        relatosRef: null,
        localizacoesRef: null,
        pessoasRef: null,
        tagsRef: null,
      },
      relatoCarregado: false,
      models: {
        datePicker: moment().format('YYYY-MM-DD'),
        emotionPicker: {
          emotion: 'Neutro',
          color: '#9E9E9E',
          show: false,
        },
        menuDatePicker: false,
        menuEmotionPicker: null,
        localizacao: '',
        pessoas: [],
        tags: [],
      },
      localizacaoUsuario: '',
      relato: {
        id: null,
        data: null,
        titulo: null,
        conteudo: null,
        pessoas: null,
        tags: null,
        lixeira: false,
        local: {
          id: null,
          nome: null,
          lat: null,
          lon: null,
        },
        emocao: {
          emotion: null,
          color: null,
        },
      }
    }),

    computed: {
      dataParaSalvar() {
        return firebase.firestore.Timestamp.fromDate(moment(this.models.datePicker).toDate());
      },
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

    methods: {

      pessoaRemover(item) {
        this.relato.pessoas.splice(this.relato.pessoas.indexOf(item), 1);
        this.relato.pessoas = [...this.relato.pessoas];
      },

      tagRemover(item) {
        this.relato.tags.splice(this.relato.tags.indexOf(item), 1);
        this.relato.tags = [...this.relato.tags];
      },

      setPlace(place) {
        this.models.localizacao = place.name;
        this.relato.local.id = place.place_id;
        this.relato.local.nome = place.name;
        this.relato.local.lat = place.geometry.location.lat();
        this.relato.local.lon = place.geometry.location.lng();
      },

      setRelato(relato) {
        const self = this;
        // Set Relato
        this.relato.id = relato.id;
        this.relato.data = relato.data().data;
        this.relato.titulo = relato.data().titulo;
        this.relato.conteudo = relato.data().conteudo;
        this.relato.local = relato.data().local;
        this.relato.createdAt = relato.data().createdAt;
        this.relato.pessoas = relato.data().pessoas;
        this.relato.tags = relato.data().tags;

        // Ajustes models
        this.models.emotionPicker.emotion = relato.data().emocao ? relato.data().emocao.emotion : 'Neutro';
        this.models.emotionPicker.color = relato.data().emocao ? relato.data().emocao.color : '#9E9E9E';
        this.models.localizacao = this.relato.local.nome;
        this.models.datePicker = moment(this.relato.data.toDate()).format('YYYY-MM-DD');
        Object.keys(this.relato.pessoas).forEach(function (pessoa) {
          self.models.pessoas.push(pessoa);
        });
        Object.keys(this.relato.tags).forEach(function (tag) {
          self.models.tags.push(tag);
        });

        // Mostrar relato
        this.relatoCarregado = true;
      },

      coletarLocalizacaoUsuario() {
        const self = this;
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function (location) {
            self.localizacaoUsuario = location.coords.latitude + ',' + location.coords.longitude;
          });
        }
      },

      mostrarToasterSalvarERedirectHome() {
        this.$store.commit('toasterMensagem', 'Relato salvo com sucesso!');
        this.$store.commit('toasterColor', 'success');
        this.$store.commit('toasterMostrar', true);
        this.$router.push({name: 'home'});
      },

      mostrarToasterErro() {
        this.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
        this.$store.commit('toasterColor', 'error');
        this.$store.commit('toasterMostrar', true);
        this.$router.push({name: 'home'});
      },

      aguardarEmostrarToasterSalvarERedirectHome(iteracao, quantidade) {
        if (iteracao === quantidade) {
          this.mostrarToasterSalvarERedirectHome()
        }
      },

      salvarMetadadosEMostrarMensagem() {

        const quantidadeLocal = this.relato.local.id ? 1 : 0;

        const quantidade = this.models.pessoas.length + this.models.tags.length + quantidadeLocal;
        let iteracao = 0;

        const self = this;

        if (quantidade === 0) {
          self.aguardarEmostrarToasterSalvarERedirectHome(iteracao, quantidade);
        }

        if (self.relato.local.id) {
          self.dbRefs.localizacoesRef.doc(self.relato.local.id).set(self.relato.local)
            .then(function () {
              iteracao++;
              self.aguardarEmostrarToasterSalvarERedirectHome(iteracao, quantidade);
            })
        }

        if (self.models.pessoas.length) {
          Object.keys(self.relato.pessoas).forEach(function (key) {
            self.dbRefs.pessoasRef.doc(md5(key)).set({nome: key})
              .then(function () {
                iteracao++;
                self.aguardarEmostrarToasterSalvarERedirectHome(iteracao, quantidade);
              });
          });
        }

        if (self.models.tags.length) {
          Object.keys(self.relato.tags).forEach(function (key) {
            self.dbRefs.tagsRef.doc(md5(key)).set({nome: key})
              .then(function () {
                iteracao++;
                self.aguardarEmostrarToasterSalvarERedirectHome(iteracao, quantidade);
              });
          });
        }
      },

      salvarRelato() {

        this.relato.data = this.dataParaSalvar;
        this.relato.pessoas = this.pessoasFormatadasParaFirebase();
        this.relato.tags = this.tagsFormatadasParaFirebase();
        this.relato.emocao.color = this.models.emotionPicker.color;
        this.relato.emocao.emotion = this.models.emotionPicker.emotion;
        const self = this;

        const relatoId = this.$route.params.id;
        // Novo Relato
        if (!relatoId) {
          this.relato.createdAt = new Date();
          this.dbRefs.relatosRef.add(this.relato)
            .then(function () {
              self.salvarMetadadosEMostrarMensagem();
            })
            .catch((error) => {
              console.error('Erro ao adicionar um novo relato', error);
              self.mostrarToasterErro();
            });
        }
        // Update de Relato
        else {
          this.dbRefs.relatosRef.doc(relatoId).update(this.relato)
            .then(function () {
              self.salvarMetadadosEMostrarMensagem();
            })
            .catch(function (error) {
              console.error('Erro ao adicionar um novo relato', error);
              self.mostrarToasterErro();
            });
        }

      },

      inicializarEscrita() {
        // Adicionado autocompletar de Localização
        let autocompleteLocation = this.$refs.autocompleteLocation.$refs.input;
        const google = window.google;
        this.autocompleteLocation = new google.maps.places.Autocomplete(
          (autocompleteLocation),
          {
            types: ['geocode'],
            language: ['pt-BR'],
            radius: 1000
          }
        );

        // Listener de local
        this.autocompleteLocation.addListener('place_changed', () => {
          this.setPlace(this.autocompleteLocation.getPlace());
        });
      },

      getRelato(relatoId) {
        this.dbRefs.relatosRef.doc(relatoId).get()
          .then(this.setRelato)
          .catch(function (error) {
            console.error('Falha em obter relato:', error);
          });
      },

      pessoasFormatadasParaFirebase() {
        let formatado = {};

        this.models.pessoas.forEach(function (pessoa) {
          const pessoaSplited = pessoa.split(' ');
          pessoaSplited.forEach(function (value, index) {
            pessoaSplited[index] = value.charAt(0).toUpperCase() + value.slice(1);
          });
          const pessoaCapitalizada = pessoaSplited.join(' ');
          formatado[pessoaCapitalizada] = true;
        });

        return formatado;
      },

      tagsFormatadasParaFirebase() {
        let formatado = {};

        this.models.tags.forEach(function (tag) {
          formatado[tag] = true;
        });

        return formatado;
      },

    },

    mounted() {

      // Se houver um parametro de id, trata ele
      const relatoId = this.$route.params.id;
      if (relatoId) {
        this.getRelato(relatoId);
      }
      else {
        this.relatoCarregado = true;
        this.inicializarEscrita();
      }
    },

    created() {
      this.$store.commit('toolbarTitulo', 'Relato');
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');
      this.dbRefs.localizacoesRef = userRef.collection('localizacoes');
      this.dbRefs.pessoasRef = userRef.collection('pessoas');
      this.dbRefs.tagsRef = userRef.collection('tags');
    }
  }
</script>

<style scoped>

  .center-content-vh {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 959px) {
    .container {
      padding: 0;
    }
  }

</style>
