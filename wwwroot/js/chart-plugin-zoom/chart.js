function genData() {
    const d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var countDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    var date2 = date-1, date3 = date-2, date4 = date-3
    var month2=month, month3= month, month4=month
    if (Number(date)-1 == 0) {
         date2 = new Date(d.getFullYear(), d.getMonth(), 0).getDate();
         date3 = new Date(d.getFullYear(), d.getMonth(), 0).getDate()-1;
        date4 = new Date(d.getFullYear(), d.getMonth(), 0).getDate() - 2;
        month2 = month - 1;
        if (month2 < 10) {
            month2 = '0' + month2
        }
        month3 = month - 1;
        if (month3 < 10) {
            month3 = '0' + month3
        }
        month4 = month - 1;
        if (month4 < 10) {
            month4 = '0' + month4
        }
    }
    if (month < 10) {
        month = '0' + month
    }
    if (month2 < 10) {
        month2 = '0' + month2
    }
    if (month3 < 10) {
        month3 = '0' + month3
    }
    if (month4 < 10) {
        month4 = '0' + month4
    }
    if (date < 10) {
        date = '0'+date
    }
    console.log([`${d.getFullYear()}-${month}-${date}`, `${d.getFullYear()}-${month2}-${date2}`, `${d.getFullYear()}-${month3}-${date3}`, `${d.getFullYear()}-${month4}-${date4}`])
    $.ajax({
        url: "/api/date/day" ,
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            Lists: [`${d.getFullYear()}-${month}-${date}`, `${d.getFullYear()}-${month2}-${date2}`, `${d.getFullYear()}-${month3}-${date3}`, `${d.getFullYear()}-${month4}-${date4}`]
        }),
        success: function (data) {
            if (data.length > 0) {
                var values = [];
                var hours = [];
                $.each(data, function (ex, dataItem) {
                    $.each(dataItem.NumberOfTimes, function (ex, item) {
                        if (dataItem.Date != `${d.getFullYear()}-${month}-${date}`) {
                            var inputItem = item.Name;
                            var itemNumber = item.InputNumber;
                            if (item.Name == 0) {
                                inputItem = dataItem.Date
                            }
                            if (item.Name != 0) {
                                inputItem = `${item.Name}:00`;
                            }
                            values.push(itemNumber);
                            hours.push(inputItem)
                        } else {
                            if (Number(item.Name) <= Number(d.getHours())) {
                                var inputItem = item.Name;
                                var itemNumber = item.InputNumber;
                                if (item.Name == 0) {
                                    inputItem = dataItem.Date
                                }
                                if (item.Name != 0) {
                                    inputItem = `${item.Name}:00`;
                                }
                                values.push(itemNumber);
                                hours.push(inputItem)
                            }
                        }
                      
                    })
                })
                createConfig(values, `${date}-${month}-${d.getFullYear()}`, hours)
            }
        },
        error: function (error) {
            console.log('fail');
        }
    })
}

function createConfig(values, date, hours) {
    var config;
    var ctx = document.getElementById('canvas').getContext('2d');
    config = {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Dữ liệu ngày ' + date,
                data: values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {

            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                }
            }
        }
    };
    window.myChart = new window.Chart(ctx, config);
}


window.onload = function () {
    genData();
};