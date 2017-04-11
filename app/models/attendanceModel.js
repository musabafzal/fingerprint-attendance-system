var db = require('../../config/database.js')
var mysql = require('mysql')

exports.getAttendanceByStudentCourse = function (regNo, courseCode, done) {

  query = db.get().query('SELECT `date`, `status` FROM attendance WHERE `regNo` = ? AND `courseCode` = ?', [regNo, courseCode], function (err, result) {
    if (err) return done(err)
    done(result)
  })

}

exports.getUniqueDatesByTaCourse = function (courseCode, done) {

  query = db.get().query('SELECT DISTINCT `date` FROM attendance WHERE `courseCode` = ?', [courseCode], function (err, result) {
    if (err) return done(err)
    done(result)
  })

}

exports.getAttendanceByDate = function (courseCode, date, done) {

  query = db.get().query('SELECT `regNo`, `status` FROM attendance WHERE `courseCode` = ? AND `date` = ?', [courseCode, date], function (err, result) {
    if (err) return done(err)
    done(result)
  })

}

exports.updateAttendance = function (courseCode, date, regList, done) {
  var i = 0
  for (regNo in regList) {
    i++
      console.log(i+" "+regNo+" "+regList[regNo])
      query = db.get().query('UPDATE attendance SET status=? WHERE regNo=? and courseCode=? and date=?', [regList[regNo], regNo, courseCode, date],function (err, rows, fields) {
        });
  }

}