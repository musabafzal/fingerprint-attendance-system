var db = require('../../config/database.js')

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

exports.insertCourses = function (courseList) {
  var i = 0
  for (course in courseList) {
    i++
    {
      // console.log(i+" "+course+" "+courseList[course])
      query = db.get().query('UPDATE slots SET courseCode=? WHERE id=?', [courseList[course], i],
        function (err, rows, fields) {
        });
    }
  }
}

exports.getUniqueCourses = function (done) {

  query = db.get().query('SELECT DISTINCT courseCode FROM slots ORDER BY courseCode;',
    function (err, rows, fields) {
      done(rows)
    });
}

exports.getAllSlots = function (done) {
  var i = 0
  query = db.get().query('SELECT courseCode FROM slots',
    function (err, rows, fields) {
      done(rows)
    });
}

exports.getFreeSlots = function (day, timeSlot, done) {
  var i = 0
  query = db.get().query('SELECT lectureHall FROM slots WHERE day=? and timeSlot=? and courseCode=?', [day, timeSlot, ''],
    function (err, rows, fields) {

      done(rows)
    });
}
exports.getCourseSlots = function (courseCode, done) {
  var i = 0
  query = db.get().query('SELECT `id`,`lectureHall`,`day`,`timeSlot` FROM slots WHERE courseCode=?', [courseCode],
    function (err, rows, fields) {

      done(rows)
    });
}

exports.alterCourseSlots = function (id, newDay, newTimeSlot, lectureHall, courseCode, done) {
  var i = 0
  query = db.get().query('UPDATE slots SET courseCode=?,prevId=?,rescheduled=? WHERE lectureHall=? and day=? and timeSlot=?',
    [courseCode, id, true, lectureHall, newDay, newTimeSlot], function (err, rows, fields) {
      if (rows) {
        query = db.get().query('UPDATE slots SET courseCode="" WHERE id=? ',
          [id],
          function (err, rows, fields) {

            done(rows)
          });
      }
    });


}

exports.getRescheduledSlots = function (courseCode, done) {
//  // console.log(courseCode);
  query = db.get().query('SELECT * FROM slots WHERE courseCode=? and rescheduled=?', [courseCode, true], function (err, rows, fields) {
    if (rows != "") {
      // console.log(rows[0].day);
      var ans = {
        courseCode: courseCode,
        day: rows[0].day,
        timeSlot: rows[0].timeSlot,
        lectureHall: rows[0].lectureHall
      }
      query = db.get().query('SELECT * FROM slots WHERE id=?', [rows[0].prevId, true], function (err, rows, fields) {
        ans.prevday = rows[0].day;
        ans.prevtimeSlot = rows[0].timeSlot;
        ans.prevlectureHall = rows[0].lectureHall;
        // console.log(ans);
        done(ans)
      })
    }
    else {
      done('no')
    }
  })
}

exports.getLectureHall = function (lectureHall, done) {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var d = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  var day = days[date.getDay() - 1];

  if (hours > 13 && minutes >= 20) {
    var rHours = (hours) + ":30-" + (hours + 1) + ":20"
  }
  else if (hours >= 10 && day != 'Friday' && minutes >= 20) {

    var rHours = (hours) + ":30-" + (hours + 1) + ":20"
  }
  else if (minutes >= 50) {
    var rHours = "0" + (hours + 1) + ":00-0" + (hours + 1) + ":50"
  }
  // console.log(hours)
  // console.log(minutes);
  // console.log(rHours);
  // console.log(day);
  // console.log(lectureHall);
  // console.log(d);
  query = db.get().query('SELECT id,courseCode,timeSlot,rescheduled,prevId FROM slots WHERE lectureHall=? and day=? and timeSlot=?', [lectureHall, day, rHours], function (err, rows, fields) {
    if (err);
      // console.log(err)

    // console.log(rows)
    if (rows[0].courseCode) {
      // console.log(rows[0].courseCode)
      var info = {
        id: rows[0].id,
        courseCode: rows[0].courseCode,
        timeSlot: rows[0].timeSlot,
        date: d,
        rescheduled: rows[0].rescheduled,
        prevId: rows[0].prevId
      }

    }
    else
      var info = 'No Class';

    done(info)
  })


}

exports.unSetRecheduled = function (info, done) {
  query = db.get().query('UPDATE slots SET coursecode=NULL,rescheduled=NULL,prevId=NULL WHERE id=?', [info.id], function (err, rows, field) {
    if (err);

    if (rows) {
      query = db.get().query('UPDATE slots SET coursecode=? WHERE id=?', [info.courseCode, info.prevId], function (err, rows, field) {

        if (rows) {
          // console.log(true);
          done(true)
        }
      })
    }
  })
}


exports.getPiIP=function(lectureHall, course, time, date, redate, done ){
  query = db.get().query('SELECT `ip` FROM `raspberryPi` WHERE lectureHall=?',lectureHall, function (err, rows) {
      if(err);
      // console.log('lol');

      done(rows, lectureHall, course, time, date, redate)
    })
}
exports.getClassesByDay = function (day, done) {
  // console.log(day)
  query = db.get().query('SELECT `courseCode`,`timeSlot`,`lectureHall` FROM slots WHERE day=? and courseCode!=""', day, function (err, rows) {
    if (err);
      // console.log(err);

    done(rows);
  })
}
/*
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

timeSlots= ['08:00-08:50', '09:00-09:50', '10:30-11:20', '11:30-12:20', '12:30-13:20', '14:30-15:20', '15:30-16:20', '16:30-17:20'];

lectureHalls = ['CS LH1', 'CS LH2', 'CS LH3', 'EE LH4', 'EE LH5', 'EE LH6', 'EE Main', 'ES LH1', 'ES LH2', 'ES LH3', 'ES LH4', 'ES Main'
                , 'BB LH1', 'BB LH2', 'BB Main', 'ME LH1', 'ME LH2', 'ME LH3', 'ME Main', 'ED Hall', 'MCE LH1', 'MCE LH2', 'MCE LH3'
                , 'MCE LH4', 'MCE Main'];
id=0;

for(var d=0;d<5;d++) {
  for(var l=0;l<25;l++) {
   for(var o=0;o<8;o++) {
     id++;
     query=db.get().query('INSERT INTO slots SET id = ?, day = ?, timeSlot = ?, lectureHall =?',[id,days[d],timeSlots[o],lectureHalls[l]],
     function(err,rows,fields){
       // console.log(err)
     });

    }
  }
}

}
*/
