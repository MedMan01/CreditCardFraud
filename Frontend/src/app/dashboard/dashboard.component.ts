import { Component, OnInit, OnDestroy } from '@angular/core';
import { FraudDataService } from '../services/fraud-data.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Type } from '../model/fraud-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalTransactions: number = 0;
  normalCount: number = 0;
  suspectCount: number = 0;
  fraudCount: number = 0;
  stats: any = {};
  selectedType: Type = Type.PAYMENT; // Default type
  types: Type[] = Object.values(Type);

  private pieChart: Chart<'doughnut'> | undefined;
  private barChart: Chart<'bar'> | undefined;

  constructor(private fraudDataService: FraudDataService) { }

  ngOnInit(): void {
    this.fraudDataService.getStats().subscribe(
      stats => {
        console.log('Received stats:', stats);
        this.totalTransactions = stats.totalTransactions;
        this.normalCount = stats.normalCount;
        this.suspectCount = stats.suspectCount;
        this.fraudCount = stats.fraudCount;
        this.stats = stats;
        this.initCharts();
        this.loadStats(this.selectedType);
      },
      error => {
        console.error('Error fetching stats:', error);
      }
    );
  }

  onTypeChange(type: Type): void {
    this.selectedType = type;
    this.loadStats(type);
  }

  loadStats(type: Type): void {
    this.fraudDataService.getStatsByType(type).subscribe(data => {
      this.createBarChart(type, data);
    });
  }

  createBarChart(type: Type, data: any): void {
    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart('chartCanvas', {
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

  initCharts(): void {
    this.destroyCharts();

    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Normal', 'Suspect', 'Fraud'],
          datasets: [{
            label: 'Transactions',
            data: [this.stats.normalCount, this.stats.suspectCount, this.stats.fraudCount],
            backgroundColor: ['green', 'yellow', 'red'],
            borderColor: ['black', 'black', 'black'],
            borderWidth: 1
          }]
        } as ChartData<'doughnut'>,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  const value = tooltipItem.raw as number;
                  return `${tooltipItem.label}: ${value.toLocaleString()}`;
                }
              }
            }
          }
        } as ChartOptions<'doughnut'>
      });
    }
  }

  destroyCharts(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}
