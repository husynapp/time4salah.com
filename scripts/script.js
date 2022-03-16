var GprayerTime;
var dateLastParsed;
var HadithText;

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
    $('#hijriDate').append("||");
    $('#hijriDate').hijriDate({
        correction: +1,
        showWeekDay: false});
}

//Old way
// function addHijriDate(data){
//     var Hijridate = data[0].datehijriday;
//     var monthEn = data[0].datehijrimonthen;
//     var monthAr = data[0].datehijrimonthar;
//     var year = data[0].datehijriyear;
//     var hijriMonthNo = data[0].datehijrimonthnumber;
//     var fullHijriDate = monthAr + " - "  + Hijridate + " - " + monthEn + " - " + year;
//     if(Hijridate == undefined || monthAr == undefined || monthAr == undefined || year == undefined){
//         fullHijriDate = "Issue retrieving hijri date";
//     }
//     document.getElementById("hijriDate").innerHTML = fullHijriDate;
//     if((hijriMonthNo == 10 &&Hijridate >= 1 && Hijridate <=3) || (hijriMonthNo == 12 && Hijridate >= 10 && Hijridate <15)){
//         document.getElementById("eidDiv").style.display = "block";
//     }
// }

function displayTimings(obj){
    var isFriday = new Date().getDay() == 5;
    obj.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
        //   console.log("key:" + key + "value:" + item[key]);
            if (key != "Fajr2") {
            var div = document.getElementById(key);
            var divT = '';
            if(isFriday && key == "Zuhr"){
                divT = `<span> <p class="ptitle"> Jummah </p>
                <p class="ptime"> ${item[key]} </p></span>`
            }else{
            divT = `<span> <p class="ptitle"> ${key} </p>
                        <p class="ptime"> ${item[key]} </p></span>`
                    }
            if (key != "Fajr2") {div.innerHTML = divT;}
            }

        });
      });
}

function parseCSV(){
    var csvSrc = "data/"+ getCurrentMonthFileName();
    // var hadithNo = getNumberOfDays("2021-05-30",new Date());
    // getAyah(hadithNo);
    // getHadith(hadithNo);
    d3.csv(csvSrc).then(function(data){
        var today = new Date();
        dateLastParsed = today.getDate();
        var filtered = filterByDate(today, data);
        // varTodaysData = filtered;
        var tomorrow = filterByDate(today.setDate(today.getDate()+ 1), data);

        var fajr2 = tomorrow.any ? tomorrow[0].timingsFajr : filtered[0].timingsFajr;

        // addHijriDate(filtered);
        addHijriDate();

        prayertime = [{"Fajr": filtered[0].timingsFajr.substring(0,5)},{"Sunrise":filtered[0].timingsSunrise.substring(0,5)},
                        {"Zuhr":filtered[0].timingsDhuhr.substring(0,5)},{"Asr": filtered[0].timingsAsr.substring(0,5)},
                    {"Maghrib": filtered[0].timingsMaghrib.substring(0,5)}, {"Isha":filtered[0].timingsIsha.substring(0,5)},
                    {"Fajr2":fajr2.substring(0,5)}];

        displayTimings(prayertime);
        GprayerTime = prayertime;
        }
    )
    display_c();
}


// function getHadith(number){
//     let request = new XMLHttpRequest();
//     var url = 'https://api.sunnah.com/v1/collections/riyadussalihin/hadiths/' + number;
//     request.open("GET", url);
//     request.setRequestHeader("x-api-key","Cl6LyXnsYg8aaJQrNCoIy5ltFQSWa3Yc7x42x8xt");
//     request.setRequestHeader('Access-Control-Allow-Origin', 'https://time4salah.com');
//     request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     request.setRequestHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
//     // request.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
//     // request.withCredentials = true;
//     request.send();
//     request.onload = ()=>{
//     // console.log(request);
//     if(request.status == 200){
//     //   console.log(JSON.parse(request.response));
//       HadithText = JSON.parse(request.response);
//       var hadithDiv = HadithText.hadith[1].body;
//       var english = HadithText.hadith[0].body.replaceAll("<br/>","").replace("<b>", "<br/> <b>");
//     //   console.log(english);
//       hadithDiv += english;
//       document.getElementById("hadith").innerHTML = hadithDiv;
//     }else{
//       console.log(`error ${request.status} ${request.statusText}`)
//       var error = `Error returning hadith from server, please contact administrator at www.husyn.app`
//       error += request.statusText;
//       document.getElementById("hadith").innerHTML = error;
//       }
//     }
//   }

  
// function getAyah(number){
//     let request = new XMLHttpRequest();
//     var url = `http://api.alquran.cloud/v1/ayah/${number}/editions/quran-uthmani,en.pickthall`
//     request.open("GET", url);
//     // request.setRequestHeader("x-api-key","SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk");
//     request.setRequestHeader('Access-Control-Allow-Origin', 'https://www,time4salah.com');
//     request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     request.setRequestHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
//     // request.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
//     // request.withCredentials = true;
//     request.send();
//     request.onload = ()=>{
//     // console.log(request);
//     if(request.status == 200){
//       console.log(JSON.parse(request.response));
//       var verse = JSON.parse(request.response);
//       console.log(verse.data[0].text);
//     //   var english = HadithText.hadith[0].body.replaceAll("<br/>","").replace("<b>", "<br/> <b>");
//     //   console.log(english);
//     //   hadithDiv += english;
//     //   document.getElementById("hadith").innerHTML = hadithDiv;
//     }else{
//       console.log(`error ${request.status} ${request.statusText}`)
//       var error = `Error returning hadith from server, please contact administrator at www.husyn.app`
//       error += request.statusText;
//       document.getElementById("hadith").innerHTML = error;
//       }
//     }
//   }

  function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}