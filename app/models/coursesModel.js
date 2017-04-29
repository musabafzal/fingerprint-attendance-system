var db = require('../../config/database.js')
var mysql = require('mysql')
var Slots = require('./slotsModel')
exports.getCourses = function (type, id, done) {
  if (type == 'student')
    col = 'regNo'
  else
    col = 'id'

  query = db.get().query('SELECT password FROM ?? WHERE ?? = ?', [type, col, id], function (err, result) {
    if (err) return done(err)
    if (result == '')
      return done(null, false)
    user = { 'type': type, 'id': id, 'password': result[0].password }
    done(null, user)
  })

}

exports.registerStudentCourses = function (regNo, courses,done) {
  for (courseCode in courses) {
    if (courses[courseCode] != '') {
      post = { courseCode: courses[courseCode], regNo: regNo }
      query = db.get().query('INSERT INTO `studentCourses` SET ?', post, function (err, result) {
        var message;
        if (err) {
          console.log(err);
          message = "Not Registered";
        }
        else
          message = "Successfully Registered"
        done(message)
      })
    }
  }
}
var getCoursesByRegNo = function (regNo, done) {
  query = db.get().query('SELECT courseCode,attendancePercent,classesHeld,attended FROM studentCourses WHERE regNo=?', regNo, function (err, result) {
    if (err) return done(err)
    console.log(result)
    done(result)
  })
}

exports.registerTaCourses = function (id, courses, done) {
  for (courseCode in courses) {
    if (courses[courseCode] != '') {
      post = { courseCode: courses[courseCode], id: id }
      query = db.get().query('INSERT INTO `taCourses` SET ?', post, function (err, result) {
        var message;
        if (err) {
          console.log(err);
          message = "Not Registered";
        }
        else
          message = "Successfully Registered"
        done(message)
      })
    }
  }
}
exports.getCoursesById = function (id, done) {
  query = db.get().query('SELECT courseCode FROM taCourses WHERE id=?', id, function (err, result) {
    if (err) return done(err)
    done(result)
  })
}
exports.rescheduledCourses = function (userId, done) {
  var string = ""
  var onComplete = function (string) {
    console.log(string)
    done(string);
  };
  getCoursesByRegNo(userId, function (courses) {
    var keys = Object.keys(courses)
    console.log(courses)
    var tasksToGo = keys.length;
    keys.forEach(function (key) {
      Slots.getRescheduledSlots(courses[key].courseCode, function (notification) {
        console.log('notification');

        console.log(notification);
        if (notification != 'no') {
          string += "  Your Class " + notification.courseCode + " has been shifted from " +
            notification.prevday + " " +
            notification.prevtimeSlot + " " +
            notification.prevlectureHall + " " +
            "to " +
            notification.day + " " +
            notification.timeSlot + " " +
            notification.lectureHall + "</br>"
        }
        console.log(tasksToGo)
        if (--tasksToGo === 0) {
          // No tasks left, good to go

          onComplete(string);
        }

      })

    })

  }

  )
}

exports.getCoursesByRegNo = getCoursesByRegNo;

function getStatus(row, i) {
  console.log('hello')
  if (row[i].status == 'P')
    return 1;
  return 0;
}

var count = 0, value = 0;
function c(row, value, count) {

  var p = (count / value) * 100;
  console.log("percent = " + p);
  if (value == 0)
    p = 0;

  console.log("percent = " + p);
  if (row[0]) {
    console.log("reg=" + row[0].regNo);
    console.log("value=" + value)
    query = db.get().query('UPDATE studentCourses SET `attendancePercent`=?,`classesHeld`=?,`attended`=? WHERE `regNo`=? and `courseCode`=?',
      [p, value, count, row[0].regNo, row[0].courseCode], function (err, rows, fields) {
        console.log('done');

      });
  }

}

function calculatePercentage(row, i, count, value) {
  var z = 0;
  if (row[i]) {
    console.log("inner iteration: " + i)
    console.log(row[i].status)
    value++;
    //count += getStatus(row, i);
    if (row[i].status == 'P') {
      console.log(row[i].status)
      count++;
    }
    i++;
    console.log("value if=" + value);
    console.log("count if=" + count);
    calculatePercentage(row, i, count, value)
  }
  else {
    console.log("value=" + value);
    console.log("count=" + count);
    c(row, value, count)
  }
  //console.log("in calculatePercentage: ")

}

function percentage(result, x) {

  if (result[x]) {
    console.log("result[x] =" + result[x].regNo + "  " + result[x].courseCode)
    console.log("\n\niteration# " + x)
    query = db.get().query('SELECT regNo,courseCode,status FROM attendance WHERE regNo=? and courseCode=?', [result[x].regNo, result[x].courseCode], function (err, row) {
      if (err) return done(err)
      //console.log("\nprinting rows:\n")
      //console.log(i);
      // console.log("row="+ row[0].status);
      var percent = calculatePercentage(row, 0, 0, 0)

      percentage(result, x + 1);
    });
  }
}
exports.setAttendancePercentages = function (done) {
  query = db.get().query('SELECT courseCode, regNo FROM studentCourses', function (err, result) {
    if (err) return done(err)

    //console.log("Printing studentCourses:")
    //console.log(result)
    var i = 0;
    console.log("\n\ntesting:")
    console.log(result[i].regNo)
    // while(result[i]){
    //   console.log("\nprinting data for "+result[i].regNo + " : " + result[i].courseCode)
    //   i++;
    // }
    percentage(result, 0);
    //done(result)
  })
}