import { Component, OnInit } from '@angular/core';
import { Chart, CategoryScale, LineController, LinearScale, PointElement, Title, Tooltip, Legend, LineElement } from 'chart.js';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'livechart';
  chart: any;
  maxDataCount = 30; // Número máximo de datos a mostrar en la gráfica
  currentDataCount = 0;
  requiredFlow = 10; // Flujo requerido
  exceededFlow = false; // Variable para controlar si se ha excedido el flujo
  exceededFlowCount = 0; // Contador de tiempo para flujo excedido

  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    Chart.register(CategoryScale, LineController, LinearScale, PointElement, Title, Tooltip, Legend, LineElement);
    this.chart = new Chart('canvas', {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Realtime Charts'
          }
        }
      },
      data: {
        labels: [],
        datasets: [
          {
            type: 'line',
            label: 'Flujo',
            data: [],
            backgroundColor: '#3F3FBF',
          }
        ]
      }
    });

    this.mqttService.observe('infusion_datos').subscribe((message) => {
      const msg = message.payload.toString();
      console.log(msg);
      const data = msg.split(",");
      const flujoData = parseFloat(data[0].trim());
      const tiempoData = data[1].trim();

      if (this.currentDataCount >= this.maxDataCount) {
        this.chart.data.labels.shift();
        this.chart.data.datasets[0].data.shift();
      } else {
        this.currentDataCount++;
      }

      this.chart.data.labels.push(tiempoData);
      this.chart.data.datasets[0].data.push(flujoData);

      // Verificar si el flujo supera el 5% del valor requerido
      const currentFlow = flujoData;
      const threshold = this.requiredFlow * 0.05;
      let backgroundColor = 'white'; // Color de fondo inicial

      if (currentFlow > this.requiredFlow + threshold) {
        this.exceededFlowCount++;
      } else {
        this.exceededFlowCount = 0;
      }

      // Si el flujo excede durante 2 segundos o más, cambiar el color de fondo
      if (this.exceededFlowCount >= 2) {
        backgroundColor = 'red';
        this.exceededFlow = true;
      } else if (currentFlow <= this.requiredFlow) {
        backgroundColor = 'white';
        this.exceededFlow = false;
      }

      document.body.style.backgroundColor = backgroundColor;

      this.chart.update();
      console.log(data);
    });
  }
}
