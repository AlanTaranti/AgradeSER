<template>
  <v-dialog
    v-model="dialog"
    height="dialogSize"
    max-width="dialogSize">
    <v-card>
      <div ref="container" id="container" style="padding: 0;">

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import * as d3 from "d3";

  export default {
    name: "EmotionPicker",
    props: ['value'],
    data: () => ({
      modelo: null,
    }),

    watch: {
      'value.show': function (val, oldVal) {
        if (val && !oldVal) {
          this.createChart();
        }
      }
    },

    computed: {
      dialog: {
        get: function () {
          return this.value.show;
        },
        set: function (value) {
          this.modelo.show = value;
          this.$emit('input', this.modelo)
        }
      },

      dialogSize: function () {

        const larguraTela = window.innerWidth;
        const alturaTela = window.innerHeight;
        const margem = 0;

        if (larguraTela > alturaTela) {
          return alturaTela > 360 ? alturaTela * .9 - margem : 360 - margem;
        }
        else {
          return larguraTela > 360 ? larguraTela - margem : 360 - margem;
        }


      },

      svgSize: function () {
        const larguraDialogo = this.dialogSize;
        const margem = 24;

        return larguraDialogo - 2 * margem;
      }


    },

    mounted() {
      this.modelo = this.value;
    },

    methods: {

      emocaoEscolhida(emotion) {
        this.modelo.emotion = emotion.name;
        this.modelo.color = emotion.color;
        this.modelo.show = false;
        this.$emit('input', this.modelo);
      },


      createChart() {

        const self = this;

        this.$refs.container.innerHTML = '';

        // Extrair tamanho disponível
        const totalWidth = this.svgSize;
        const totalHeight = this.svgSize;

        const radius = totalWidth * .07 < 65 ? totalWidth * .07 : 65;
        // Definir margens
        const margin = {
          top: totalHeight * .05,
          left: radius * .5 + totalWidth * .05,
          bottom: 10 + totalHeight * .05,
          right: radius * .5 + totalWidth * .05,
        };

        // Largura e Altura do Canvas
        const width = totalWidth - margin.left - margin.right;
        const height = totalHeight - margin.top - margin.bottom;

        //
        // Definir Dados
        //

        const theData = [];

        theData.push({code: 'ALE', name: 'Alegria', color: '#FFEB3B', radius: radius, cx: 6, cy: 11,});
        theData.push({code: 'ANS', name: 'Ansiedade', color: '#FF9800', radius: radius, cx: 2, cy: 10,});
        theData.push({code: 'CON', name: 'Confiança', color: '#4CAF50', radius: radius, cx: 10, cy: 10,});
        theData.push({code: 'RAI', name: 'Raiva', color: '#F44336', radius: radius, cx: 1, cy: 6,});
        theData.push({code: 'NOJ', name: 'Nojo', color: '#9C27B0', radius: radius, cx: 2, cy: 2,});
        theData.push({code: 'TRI', name: 'Tristeza', color: '#1E88E5', radius: radius, cx: 6, cy: 1,});
        theData.push({code: 'SUR', name: 'Surpresa', color: '#039BE5', radius: radius, cx: 10, cy: 2,});
        theData.push({code: 'MED', name: 'Medo', color: '#1B5E20', radius: radius, cx: 11, cy: 6,});

        //
        // Scala X & Y
        //

        // X SCALE
        const xDomain = d3.extent(theData, function (d) {
          return d.cx;
        });

        const xRange = [0, width];
        const xPadding = d3.mean(theData, function (d) {
          return d.cx
        });
        const xScale = d3.scaleLinear().domain(xDomain).range(xRange).nice(10);

        // Y SCALE
        const yDomain = d3.extent(theData, function (d) {
          return d.cy;
        });
        const yRange = [height, 0];
        const yScale = d3.scaleLinear().domain(yDomain).range(yRange).nice(5);

        // SVG GROUP HIERARCHY

        const svg = d3.select('#container').append('svg')
          .attr("id", "scatterplot")
          .attr("width", totalWidth)
          .attr("height", totalHeight);

        const mainGroup = svg.append("g")
          .attr("id", "mainGroup")
          .attr("transform", "translate( " + margin.left + ", " + margin.top + ")");


        const eventGroup = mainGroup.append("g").attr('id', 'event-overlay');

        const canvasGroup = eventGroup.append("g")
          .attr("id", "circleGroup");

        // CHART ASSEMBLY

        canvasGroup.selectAll("circle")
          .data(theData)
          .enter()
          .append('circle')
          .attr("cx", function (d) {
            return xScale(d.cx)
          })
          .attr("cy", function (d) {
            return yScale(d.cy)
          })
          .attr("r", function (d) {
            return d.radius;
          })
          .style("fill", function (d) {
            return d.color;
          })
          .style("opacity", 1)
          .on("mouseover", function (d, i) {


          })
          .on('click', function (d, i) {
            self.emocaoEscolhida(d);
          })
          .on("mouseout", function (d, i) {


          })
          .transition()
          .attr("r", function (d) {
            return d.radius;
          });

        canvasGroup.selectAll("text")
          .data(theData)
          .enter()
          .append("text")
          .attr("transform", function (d) {
            return "translate(" + xScale(d.cx) + ")";
          })
          .attr("y", function (d) {
            return yScale(d.cy) + d.radius + 15 * 1.2;
          })
          .append('tspan')
          .text(function (d) {
            return d.name;
          })
          .attr("x", "0")
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("font-family", "Roboto Mono, monospace")
          .attr("fill", "#0f0f0f");
      },
    }
  }
</script>

<style scoped>

</style>
