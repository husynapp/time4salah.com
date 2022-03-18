var GprayerTime;
var dateLastParsed;

function parseCSV(){
    var csvSrc = "data/"+ getCurrentMonthFileName();

    d3.csv(csvSrc).then(function(data){
        var today = new Date();
        dateLastParsed = today.getDate();
        var filtered = filterByDate(today, data);
        // varTodaysData = filtered;
        var tomorrow = filterByDate(today.setDate(today.getDate()+ 1), data);

        var fajr2 = tomorrow.any ? tomorrow[0].timingsFajr : filtered[0].timingsFajr;

        addHijriDate();

        prayertime = [  {"Fajr": adjustTime("Fajr",filtered[0].timingsFajr.substring(0,5))},
                        {"Sunrise": adjustTime("Sunrise",filtered[0].timingsSunrise.substring(0,5))},
                        {"Zuhr":adjustTime("Zuhr",filtered[0].timingsDhuhr.substring(0,5))},
                        {"Asr": adjustTime("Asr",filtered[0].timingsAsr.substring(0,5))},
                        {"Maghrib": adjustTime("Maghrib",filtered[0].timingsMaghrib.substring(0,5))}, 
                        {"Isha":adjustTime("Isha",filtered[0].timingsIsha.substring(0,5))},
                        {"Fajr2":adjustTime("Fajr2",fajr2.substring(0,5))}];

        displayTimings(prayertime);
        GprayerTime = prayertime;
        }
    )
    display_c();
}

function display_c(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)

}

function display_ct() {
    var currentDate = new Date().getDate();
    if (dateLastParsed != currentDate){
        parseCSV();
    }
    displayTimeRemaining(GprayerTime);
    var currentMomentString =  moment().format('llll');
    document.getElementById('ct').innerHTML = currentMomentString;
    display_c();
}

function displayTimeRemaining(data) {
    var times = []
    var currentTime = new Date();
    data.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
            if(key == "Sunrise"){return};
            if(key == "Fajr2"){
                currentTime.setDate(currentTime.getDate()+1)
            }
            currentTime.setHours(item[key].substring(0,2));
            currentTime.setMinutes(item[key].substring(3,5));
            currentTime.setSeconds(0);
            times.push(currentTime);
            currentTime = new Date();
            });
        });

        times.sort(function(a, b) {
            var distancea = Math.abs(currentTime - a);
            var distanceb = Math.abs(currentTime - b);
            return distancea - distanceb; // sort a before b when the distance is smaller
        });

        var nextTime = new Date();
        nextTime = times.filter(function(d) {
            return d - currentTime > 0;
        });

        // console.log(times)

        var timeleft = nextTime[0] - currentTime;

        // console.log(nextTime);
        //("0" + myNumber).slice(-2);

        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    document.getElementById("np").innerHTML = `NEXT SALAH IN: ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}

function adjustTime(salah, salahTime){
    var adjustment = returnAdjustmentTime(salah)
    var time = moment(salahTime, "HH:mm")
    if(salah != "Fajr" && salah != "Fajr2" && salah != "Sunrise"){
        if(time.hour() < 12 ){time.add(12, "h");}
    }
    return time.add(adjustment,"m").format("HH:mm")
}


function filterByDate(date, data){
		var date = new Date(date);
		var mDate = moment(date);
        var dd = mDate.format("DD/MM/yyyy");
        // console.log(dd);
        //console.log(data);
        var filtered = data.filter(function(el) {
            return el.datereadable === dd;
          });
        return filtered;
}

function getCurrentMonthFileName(){
    var todayDate = new Date();
    var year = todayDate.getFullYear();
    var month = todayDate.getMonth() + 1;
    var monthStr = ("0" + month).slice(-2)
    return year+monthStr+".csv";
}

function addHijriDate(){
    $('#hijriDate').hijriDate({gregorian: true, showWeekDay: false,
        showGregDate: false,
        weekDayLang: 'en',
        hijriLang: 'en',
        gregLang: 'en',
        correction: +1});
    isEidToday()
    $('#hijriDate').append("||");
    $('#hijriDate').hijriDate({
        correction: +1,
        showWeekDay: false});
}

function isEidToday(){
    var date = $('.hijri-date').text();
    if (date.includes("1 Ramadan")){
        $('#eidDiv').show();
    }
}

function displayTimings(obj){
    var isFriday = new Date().getDay() == 5;
    obj.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
        var time = moment(item[key], "HH:mm").format("hh:mm");
        console.log(time);
            if (key != "Fajr2") {
            var div = document.getElementById(key);
            var divT = '';
            if(isFriday && key == "Zuhr"){
                divT = `<span> <p class="ptitle"> Jummah </p>
                <p class="ptime"> ${time} </p></span>`
            }else{
            divT = `<span> <p class="ptitle"> ${key} </p>
                        <p class="ptime"> ${time} </p></span>`
                    }
            if (key != "Fajr2") {div.innerHTML = divT;}
            }

        });
      });
}

function returnAdjustmentTime(salah){
    //Future plan to have dynamic adjustment
    var adjustment = 0;
    switch(salah){
        case "Fajr", "Fajr2" : adjustment = 0;
        break;
        case "Zuhr" : adjustment = 5;
        break;
        case "Asr" : adjustment = 0;
        break;
        case "Maghrib" : adjustment = 4;
        break;
        case "Isha" : adjustment = -9;
        break;
        default: adjustment = 0;
        break;
    }
    return adjustment;
}
