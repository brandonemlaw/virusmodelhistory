//Test

var mainChart = null;

function addToChart(data, label)
{
    console.log(data);
    mainChart.data.datasets.push(
    {
        label: label,
        borderColor: '#ff0000',

        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        data: data
    });
    mainChart.update();
}

function initChart()
{
    var ctx = document.getElementById('chartCanvas').getContext('2d');
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            tooltips: {
                mode: 'point',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }], 
                xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }]
            }
        }
    });
}



$(document).ready(function() {
    console.log("Go2");
    $.ajax({
        type: "GET",
        url: "data/ihme/2020-04-27.csv",
        dataType: "text",
        success: function(data) 
        {
            var us = parseIhmeCsv(data, "United States", '2020-04-27');
            var dat = getDataset(us, "totdea_mean");
            addToChart(dat, "Deaths 4/27");
        }
     });
    initChart();
    addStates();

});


function getDataset(data, parameter)
{
    console.log(data);
    var result = [];
    for (var key in data) 
    {
        var value = data[key];
        result.push(
            {
               x: key,
               y: value[parameter]
            } 
        );
    }

    return result;
}



function parseIhmeCsv(text, location, projectionBegins)
{
    var lines = text.split(/\r\n|\n/);
    var headers = CsvtoArray(lines[0]);

    var result = { };
    for (var i = 1; i < lines.length; i++)
    {
        if (lines[i].includes(location))
        {
            var data = CsvtoArray(lines[i]);
            var resultData = { };
            for (var j = 0; j < headers.length; j++)
            {
                var key = headers[j];
                resultData[key] = data[j];
            }

            var date = resultData['date'];
            if (moment(date).isSameOrAfter(projectionBegins, 'day'))
            {
                result[date] = resultData;
            }
        }
    }

    return result;
}



//Handle Settings Changes
function onRadioStatesChanged()
{
    $('#radio-us').prop("checked", false);

}

function onRadioUsChanged()
{
    $('#radio-states').prop("checked", false);

}


//Setup drop down menu
$(".checkbox-menu").on("change", "input[type='checkbox']", function() {
   $(this).closest("li").toggleClass("active", this.checked);
});

$(document).on('click', '.allow-focus', function (e) {
  e.stopPropagation();
});

function addStates()
{
    var html = "<li><label onClick='checkStates(true);'>Check All</label><li>";
    html = html + "<li><label onClick='checkStates(false);'>Uncheck All</label><li>";
    for (var abbrev in states)
    {
        html = html +  
        '<li><label><input type="checkbox" id="chk-' +
        abbrev + '" checked="false">' + states[abbrev] + '</label></li>';
    }
     $("#stateDropDown").html(html);
}

function checkStates(isChecked)
{
    for (var abbrev in states)
    {
        $('#chk-' + abbrev).prop("checked", isChecked);
    }
}

function getCheckedStates()
{
    var result = [];
    for (var abbrev in states)
    {
        if ($('#chk-' + abbrev).prop("checked"))
        {
            result.push(states[abbrev]);
        }
    }
    return result;
}