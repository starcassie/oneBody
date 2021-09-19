console.log("running")
let googleUserId;
let itemsUploaded = 0;
google.charts.load('current', {packages: ['corechart', 'line']});

var dataLine;
var dataDot;

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            console.log(googleUserId)
            const profileRef = firebase.database().ref(`users/${googleUserId}`);
            profileRef.on("value", (snapshot) => {
                console.log("hello")
                const profileItem = snapshot.val();
                populateDash(profileItem);
                drawLineColors();
                drawChart();
            })
            
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });
    
    client.picker(options).open();
};

function populateDash(data) {
    dataLine = new google.visualization.DataTable();
    dataLine.addColumn('number', 'X');
    dataLine.addColumn('number', 'day rating');
    dataLine.addColumn('number', 'mental health rating');
    dataLine.addColumn('number', 'physical health rating');
    dataDot = new google.visualization.DataTable();
    dataDot.addColumn('number', 'stress');
    dataDot.addColumn('number', 'happiness');
    var totalHours = 0;
    var totalQuality = 0;
    var totalEnergy = 0;
    var totalPain = 0;
    var count = 0;
    for (item in data) {
        var arrayOfDate = data[item].date.split(/\D/);
        dataLine.addRows([
            [parseInt(arrayOfDate[2]), parseInt(data[item].day), parseInt(data[item].mental), parseInt(data[item].physical)]
        ]);
        dataDot.addRows([
            [parseInt(data[item].stress), parseInt(data[item].happiness)]
        ])
        totalHours += parseInt(data[item].sleephours);
        totalQuality += parseInt(data[item].sleepquality);
        totalEnergy += parseInt(data[item].energy);
        totalPain += parseInt(data[item].pain);
        count += 1;
    }
    console.log("hi" + count);
    var avgHours = totalHours / count;
    var avgQuality = totalQuality / count;
    var avgEnergy = totalEnergy / count;
    var avgPain = totalPain / count;

    document.querySelector("#avghours").innerHTML = avgHours;
    document.querySelector("#avgquality").innerHTML = avgQuality;
    document.querySelector("#avgenergy").innerHTML = avgEnergy;
    document.querySelector("#avgpain").innerHTML = avgPain;
    
    console.log(dataDot);
}

// google.charts.setOnLoadCallback(drawLineColors);

function drawLineColors() {

  var options = {
    title: 'daily ratings for the past month',
    hAxis: {
      title: 'day'
    },
    vAxis: {
      title: 'rating'
    },
    colors: ['#FF3366', '#0099FF', '#33CC99']
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div_rating'));
  chart.draw(dataLine, options);
}


function drawChart() {

  var options = {
    title: 'stress and happiness',
    hAxis: {title: 'stress', minValue: 0, maxValue: 10},
    vAxis: {title: 'happiness', minValue: 0, maxValue: 10},
    legend: 'none',
    colors: ['#0099FF']
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_emotions'));

  chart.draw(dataDot, options);
}