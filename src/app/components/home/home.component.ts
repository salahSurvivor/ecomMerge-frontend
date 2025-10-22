import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalProfits = 0;
  totalMoney = 0;
  monthProfits = 0;
  dayProfits = 0;

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Total Expenses', 'Total Profits'],
    datasets: [{
      data: [0, 0], // Valeurs initiales
      backgroundColor: ['#2CB946', '#36A2EB'],
    }]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Répartition des profits et dépenses'
      }
    }
  };

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getOrdersProfits().subscribe((dt) => {
      this.totalProfits = dt.totalProfits;
      this.totalMoney = dt.totalMoney;
      this.monthProfits = dt.monthProfits;
      this.dayProfits = dt.dayProfits;

      // Mise à jour des données du graphique après réception des données
      this.pieChartData = {
        labels: ['Argent Total', 'Bénéfices totaux'],
        datasets: [{
          data: [this.totalMoney, this.totalProfits],
          backgroundColor: ['#14CBF0', '#208A59'],
        }]
      };
    });
  }
}
