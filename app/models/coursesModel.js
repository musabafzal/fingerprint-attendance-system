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

exports.registerStudentCourses = function (regNo, courses) {
  for (courseCode in courses) {
    if (courses[courseCode] != '') {
      post = { courseCode: courses[courseCode], regNo: regNo }
      query = db.get().query('INSERT INTO `studentCourses` SET ?', post, function (err, result) {
      })
    }
  }
}
var getCoursesByRegNo = function (regNo, done) {
  query = db.get().query('SELECT courseCode FROM studentCourses WHERE regNo=?', regNo, function (err, result) {
    if (err) return done(err)
    done(result)
  })
}

exports.registerTaCourses = function (id, courses) {
  for (courseCode in courses) {
    if (courses[courseCode] != '') {
      post = { courseCode: courses[courseCode], id: id }
      query = db.get().query('INSERT INTO `taCourses` SET ?', post, function (err, result) {
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
          string+= "  Your Class " + notification.courseCode + " has been shifted from " +
            notification.prevday + " " +
            notification.prevtimeSlot + " " +
            notification.prevlectureHall + " " +
            "to " +
            notification.day + " " +
            notification.timeSlot + " " +
            notification.lectureHall +"</br>"
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