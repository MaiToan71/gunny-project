window.onload = function () {
    var dataPoints = []
    updateChart();
    function updateChart() {
        var date_0 = moment(new Date().setDate(new Date().getDate())).format('YYYY-MM-DD');
        var date_1 = moment(new Date().setDate(new Date().getDate() - 1)).format('YYYY-MM-DD');
        var date_2 = moment(new Date().setDate(new Date().getDate() -2)).format('YYYY-MM-DD');
        var date_3 = moment(new Date().setDate(new Date().getDate() - 3)).format('YYYY-MM-DD');
        $.ajax({
            url: "/api/date/day",
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                Lists: [date_0, date_1, date_2, date_3]
            }),
            success: function (data) {
                if (data.length > 0) {
                    $.each(data, function (ex, dataItem) {
                        $.each(dataItem.NumberOfTimes, function (ex, item) {
                            var dateCompare = `${dataItem.Date}T${item.Name}:00` ;
                            if (Number(item.Name) < 10) {
                                dateCompare = `${dataItem.Date}T${'0' + item.Name}:00`
                            }
                          if (new Date(dateCompare) < new Date()) {
                                var dayInput = item.Name
                                if (Number(item.Name) < 10) {
                                    dayInput = '0' + item.Name
                                }
                                dataPoints.push({ x: new Date(`${dataItem.Date}T${dayInput}:00`).getTime(), y: item.InputNumber })
                          }
                           
                            
                        })
                    })
                
                    var stockChart = new CanvasJS.StockChart("chartContainer", {
                        theme: "light1",
                        title: {
                            text: ""
                        },
                        rangeChanged: function (e) {
                            rangeChangedTriggered = true;
                        },
                        animationDuration: 1500,
                        exportEnabled: false,
                        animationEnabled: true,
                        dataPointMaxWidth: 5,

                        charts: [{
                            axisX: {
                                crosshair: {
                                    enabled: true,
                                    valueFormatString: "DD-MM-YYYY HH:mm"
                                }
                            },
                            axisY: {
                                title: "",

                                stripLines: [{
                                    showOnTop: true,
                                    lineDashType: "dash",
                                    color: "#ff4949",
                                    labelFontColor: "#ff4949",
                                    labelFontSize: 30
                                }]
                            },
                            toolTip: {
                                shared: true
                            },
                            dataPointMaxWidth: 20,

                            data: [/*{
                                type: "line",
                                name: "Số lượng",
                                xValueFormatString: "DD-MM-YYYY HH:mm",
                                xValueType: "dateTime",
                                dataPoints: dataPoints,
                                showInLegend: true,
                                yValueFormatString: "$#,##0",
                            }, {
                                type: "column",
                                    name: "Số lượng",
                                    xValueFormatString: "DD-MM-YYYY HH:mm",
                                    xValueType: "dateTime",
                                dataPoints: dataPoints,
                                showInLegend: true,
                                xValueFormatString: "MMMM YYYY",
                                yValueFormatString: "$#,##0",
                                }*/
                                {
                                    type: "column",
                                    name: "",
                                    showInLegend: true,
                                    dataPoints: dataPoints,
                                    indexLabel: "{y}",
                                    xValueFormatString: "DD-MM-YYYY HH:mm",
                                    xValueType: "dateTime",

                                }, {
                                    dataPointMaxWidth: 5,
                                    type: "line",
                                    name: "",
                                    showInLegend: true,
                                    dataPoints: dataPoints,
                                    xValueFormatString: "DD-MM-YYYY HH:mm",
                                    xValueType: "dateTime",                                }]
                        }],
                        navigator: {
                            slider: {
                                minimum: new Date(`${moment(new Date().setDate(new Date().getDate())).format('YYYY-MM-DD')}T00:00:00`),
                                maximum: new Date(`${moment(new Date().setDate(new Date().getDate())).format('YYYY-MM-DD')}T${new Date().getHours()}:59:00`)
                            }
                        },
                        rangeSelector: {
                            enabled: false
                        }
                    });

                    stockChart.render();
                    $('.canvasjs-navigator-panel').hide()
                        $('.canvasjs-chart-credit').hide()
                }
            },
            error: function (error) {
                console.log('fail');
            }
        })
      
      // setTimeout(function () { updateChart(xstart, ystart, dataCount, interval); }, 1000);
    }


  
}