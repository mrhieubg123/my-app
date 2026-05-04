import React from 'react';
import Highcharts, { format } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BorderColor } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs'

function HoursAddOne (date) {
    const idate = new Date(date.replace(' ', 'T'));   
    let year = idate.getFullYear();
    let month = String(idate.getMonth() + 1).padStart(2, '0');
    let date1 = String(idate.getDate()).padStart(2, '0');
    let ihours = String(idate.getHours() +1).padStart(2, '0');
    let minutes = String(idate.getMinutes()).padStart(2, '0');
    let seconds = String(idate.getSeconds()).padStart(2, '0');
    const resultTime = `${ihours}:${minutes}:${seconds}`
    return resultTime;
}

const AnalysisChart = ({ idata =[], onQuery}) => {
    const theme = useTheme();

    const temp = {};
        idata.forEach(item => {
            if (temp[item.TIMET]) {
                temp[item.TIMET].TOTALTIME += item.TOTALTIME * 1;
                temp[item.TIMET].FREN += item.FREN * 1;
            }
            else {
                temp[item.TIMET] = { TIMET: item.TIMET, TOTALTIME: item.TOTALTIME * 1, FREN: item.FREN * 1 };
            }
        });
        const ErrorList = Object.values(temp);

    const handleClickQuery = (cate, Datet) =>{
        const newModel = {
            timet: cate,
            datet: Datet,
            dateFrom: `${cate}:00`,
            dateTo: `${HoursAddOne(`${Datet} ${cate}:00`)}`
        }
        onQuery?.(newModel)
    }

    const spark1Options = {
        chart: {
            type: 'column',
            backgroundColor: "transparent",
            height: 180,
        },
        colors: ['#00e396'],
        title: { text: '' },
        xAxis: {
            categories: ErrorList.map(item => item.TIMET),
            labels: { style: { fontSize: '12px', color: theme.palette.chart.color } },
            gridLineWidth: 0,
            lineWidth:0,
            // tickAmount: 6,
            tickInterval: ErrorList.length > 15 ? 3 : ErrorList.length > 8 ? 2 : ''
        },
        yAxis: {
            title: { text: 'Duration(h)', style: { fontSize: '11px', color: '#999' }},
            gridLineWidth: 0,
            lineWidth:0,
            tickAmount: 2,
            labels:{
                style:{
                    fontSize: '12px',
                    color: theme.palette.chart.color
                }
            } 
           
        },
        plotOptions: {
            column: {
                borderRadius: 5,
                dataLabels: { enabled: true, style: { fontSize: '11px', color: theme.palette.chart.color } },
                borderWidth:0,
            },
            series:{
                point:{
                    events:{
                        click: function(){
                          handleClickQuery(this.category, `${idata.map(item => item.DATET)[this.index]}`);
                          // alert(this.series.name);
                            // handleInputChange(this.category);
                            // alert(`sdfsdf ${this.category}, ${this.y} ,  ${data.map(item => item.DATE_E.split('T')[0])[this.index]}`);
                            //alert( this.category);
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Duration(h)',
            data: ErrorList.map(item => (item.TOTALTIME*1/3600).toFixed(2)*1),
            color: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#2099f5'],
                    [1, '#2099f500']
                ]
            },
            dataLabels: {
                enabled: true,
                format:`{y}`,
                offsetY: -20,
                color: theme.palette.chart.color,
                style: {
                    textOutline: 'none',
                    fontSize: "11px",
                }
            },
        }],
       
        credits: {
            enabled: false, // Tắt logo Highcharts ở góc
          },
          legend:{
            enabled: false,
            align: 'left',
            verticalAlign: 'top',
          },
          exporting:{
            enabled: false,
          },
        
    };

    const spark2Options = {
        chart: {
            type: 'column',
            backgroundColor: "transparent",
            // borderWidth: 0,
            // borderColor: "transparent",
            // plotBackgroudColor: "transparent",
            // plotBorderWidth: 0,
            height: 160,
            reversed: true,
        },
        colors: ['#ff3110'],
        title: { text: '' },
        xAxis: {
            categories: ErrorList.map(item => item.TIMET),
            labels: { enabled: false ,
                style: {
                    fontSize: "12px",
                    color: theme.palette.chart.color, // Màu chữ trên trục Y
                  },
            },
            gridLineWidth: 0,
            lineWidth:0
        },
        yAxis: {
            title: { text: 'Frequency', style: { fontSize: '11px', color: '#999' } },
            reversed: true,
            gridLineWidth: 0,
            lineWidth:0,
            tickAmount: 2,
            labels:{
                style:{
                    fontSize: '12px',
                    color: theme.palette.chart.color
                }
            } 
        },
        plotOptions: {
            column: {
                borderRadius: 5,
                dataLabels: { enabled: true, style: { fontSize: '11px', color: theme.palette.chart.color } },
                borderWidth:0,

            },
            series:{
                point:{
                    events:{
                        click: function(){
                          handleClickQuery(this.category, `${idata.map(item => item.DATET)[this.index]}`);
                          // alert(this.series.name);
                            // handleInputChange(this.category);
                            // alert(`sdfsdf ${this.category}, ${this.y} ,  ${data.map(item => item.DATE_E.split('T')[0])[this.index]}`);
                            //alert( this.category);
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Frequency',
            data: ErrorList.map(item => item.FREN),
            color: {
                linearGradient: {
                    x1: 0,
                    y1: 1,
                    x2: 0,
                    y2: 0
                },
                stops: [
                    [0, '#ff3110'],
                    [1, '#ff311000']
                ]
            },
            dataLabels: {
                enabled: true,
                format:`{y}`,
                offsetY: -20,
                color: theme.palette.chart.color,
                style: {
                    textOutline: 'none',
                    fontSize: '11px',

                }
            },
            
        }],
        credits: {
            enabled: false, // Tắt logo Highcharts ở góc
          },
        legend:{
            enabled: false,
            align: 'left',
            verticalAlign: 'bottom',
            borderWidth:0,
        },
        exporting:{
            enabled: false,
          },
    };

    return (
        <div>
            <div id="chart41">
                <HighchartsReact highcharts={Highcharts} options={spark1Options} />
            </div>
            <div id="chart42">
                <HighchartsReact highcharts={Highcharts} options={spark2Options} />
            </div>
        </div>
    );
};

export default React.memo(AnalysisChart);
