import { Component, OnInit } from '@angular/core';
import { FraudDataService } from '../services/fraud-data.service';
import { Type } from '../model/fraud-data.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  chart: any;
  selectedType: Type = Type.PAYMENT; // Default type
  types: Type[] = Object.values(Type);

  constructor(private fraudDataService: FraudDataService) { }

  ngOnInit(): void {
    this.loadStats(this.selectedType);
  }

  // Method to handle type change from dropdown
  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedType = selectElement.value as Type;
    this.loadStats(this.selectedType);
  }

  loadStats(type: Type): void {
    this.fraudDataService.getStatsByType(type).subscribe(data => {
      this.createChart(type, data);
    });
  }

  createChart(type: Type, data: any): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: [type],
        datasets: [
          {
            label: 'Normal',
            data: [data.normalCount],
            backgroundColor: 'green'
          },
          {
            label: 'Suspect',
            data: [data.suspectCount],
            backgroundColor: 'yellow'
          },
          {
            label: 'Fraud',
            data: [data.fraudCount],
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y;
                }
                return label;
              }
            }
          }
        }
      }
    });
  }
}
