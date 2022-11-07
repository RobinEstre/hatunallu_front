import { ChartConfiguration, ChartData, ChartType } from "chart.js";


//Line Charts
export let lineChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    legend: {
      display: false,
      labels: {
        //display: false
      }
    },
  },
  scales: {
    y: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 10,
        // max: 80,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    },
    x: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 11,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }
  }
};


export let lineChartType: ChartType = 'line';
export let lineChartLegend = false;
export let lineChartData: ChartConfiguration['data'] ={datasets: [
  {
    data: [12, 15, 18, 40, 35, 38, 32, 20, 25, 15, 25, 30],
    borderColor: '#fb8fad',
    borderWidth: 1,
    fill: false,
    tension: 0.4
  }, {
    data: [10, 20, 25, 55, 50, 45, 35, 30, 45, 35, 55, 40],
    borderColor: '#5160c7',
    borderWidth: 1,
    fill: false,
    tension: 0.4
  }
],
labels:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}


//STACKED BAR CHART (Vertical)
export let barChart2Options: ChartConfiguration['options'] = {
  maintainAspectRatio: true,
  responsive: true,
  plugins:{legend: {
    display: false,
  },},
  scales: {
    y: {
      stacked: true,
      ticks: {
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    },
    x: {
      stacked: true,
      ticks: {
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }
  },
}
export let barChart2Type: ChartType = 'bar';
export let barChart2Legend = true;
// export let barChart2Plugins = []

export let barChart2Data: ChartConfiguration['data'] = {datasets:[
  {
    label:'bar1',
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#b1b9f3',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
    borderColor: "#b1b9f3",
    hoverBackgroundColor: "#b1b9ee"
  }, {
    label:'bar2',
    data: [10, 24, 20, 25, 35, 50],
    backgroundColor: '#6d7ce4',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
    borderColor: "#6d7ce4",
    hoverBackgroundColor: "#6d7cb3"
  }, {
    label:'bar3',
    data: [20, 30, 28, 33, 45, 65],
    backgroundColor: '#4454c3',
    borderWidth: 1,
    fill: true,
    barPercentage: 0.5,
    borderColor: "#4454c3",
    hoverBackgroundColor: "#4454b0"
  }
], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}

//DoughNut Chart and Pie chart data

export let PieChartData: ChartConfiguration['data'] = {datasets: [
  {
    data: [20, 20, 30, 5, 25],
    backgroundColor: ['#285cf7', '#f10075', '#8500ff', '#7987a1', '#74de00']
  }

],
labels:  ['Jan', 'Feb', 'Mar', 'Apr', 'May']
}
export let PieChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{legend: {
    display: false,
  },
}
}
export let DoughnutChartType: ChartType = 'doughnut';
export let PieChartType: ChartType = 'pie';

//SOLID COLOR
export let solidColorChartOptions: ChartConfiguration['options'] = {

  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 10,
        // max: 80,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    },
    x: {
      ticks: {
        // beginAtZero: true,
        // fontSize: 11,
        color: "rgba(171, 167, 167,0.9)",
      },
      grid: {
        display: true,
        color: 'rgba(171, 167, 167,0.2)',
        drawBorder: false
      },
    }
  }

}
export let solidColorLegend = true;
export let solidColorChartType: ChartType = 'bar';
export let solidColorChartData: ChartConfiguration['data'] = {datasets:[{
  label: '# of Votes',
  data: [12, 39, 20, 10, 25, 18],
  barPercentage: 0.6
}],
labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
}

export let polarAreaChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales' ];
export let  polarAreaChartData: ChartData<'polarArea'> = {
    labels: polarAreaChartLabels,
    datasets: [ {
      data: [ 300, 500, 100, 40, 120 ],
      label: 'Series 1'
    } ]
  };
export let  polarAreaLegend = true;
export let polarChartOptions: ChartConfiguration['options'] = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{legend: {
    display: false,
  },
}
}
export let  polarAreaChartType: ChartType = 'polarArea';
