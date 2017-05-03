var schedule = require('node-schedule');
var Slots = require('./app/models/slotsModel')
var Attendance = require('./app/models/attendanceModel')
var SSH = require('simple-ssh');



//var j = schedule.scheduleJob('0 0 7 * * 1-5', function(){

// var j = schedule.scheduleJob('* * * * * *', function(){
exports.run=function(){
  var date = new Date()
  console.log(date.getDay())

  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  Attendance.setAttendanceByDay(days[date.getDay()-1])
  Slots.getClassesByDay(days[date.getDay()-1], function(results){
    //console.log(results)
    for(row in results){
      if(row==0){
      if(results[row].courseCode!=''){
      //  console.log(results[row].courseCode)
        hour= parseInt(results[row].timeSlot.substring(0,2))
        minutes = parseInt(results[row].timeSlot.substring(3,5))
        var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes, 0)
        var date2 = new Date(date1-60000*10)
        month=date.getMonth()+1
        console.log(date.getMonth())
        todayDate= date.getDate()+'-'+month+'-'+date.getFullYear()
        Slots.getPiIP(results[row].lectureHall, results[row].courseCode, results[row].timeSlot, todayDate, date2, function(ip, lectureHall, courseCode, time, toDate, reDate){
          //schedule.scheduleJob(date2, function(){
            var ssh = new SSH({
                host: ip[0].ip,
                port: '22',
                user: 'pi',
                pass: 'shahidbh'
            });

            console.log(ip[0].ip)
            console.log(lectureHall+courseCode+time+toDate)
            ssh.exec('sudo python2 /home/pi/fingerprint-python/attendanceFinal.py "'+lectureHall+'" "'+courseCode+'" "'+time+'" "'+toDate+'"', {
              out: function(stdout) {
                  console.log(stdout);
                }
            }).start();
        //})
      })

        //console.log(results[row].timeSlot.substring(0,2))
      }
    }
    }

  })

}

//
// });
