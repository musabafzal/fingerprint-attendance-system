var db = require('../../config/database.js')
var mysql = require('mysql')
var Slots = require('./slotsModel')
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

function insertAttendanceByRegNo(row, timeSlot, courseCode, x) {
  if (row[x]) {
    var date = new Date();
    var date1 = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    query = db.get().query('INSERT INTO attendance (regNo, courseCode, date, timeSlot,status) VALUES (?,?,?,?,"A")',
      [row[x].regNo, courseCode, date1, timeSlot], function (err, rows) {
        if (rows) {
          console.log('inserted by insertAttendanceByRegNo: ')
          console.log(row[x].regNo+"   "+courseCode)

          insertAttendanceByRegNo(row, timeSlot, courseCode, x + 1)
        }
      })
  }
  else
    return

}
function setStudentAttendance(courseCode, timeSlot, done) {
  query = db.get().query('SELECT * FROM studentCourses WHERE courseCode=?', courseCode, function (err, rows) {
    if (rows) {

      console.log(rows)
      insertAttendanceByRegNo(rows, timeSlot, courseCode, 0)
      done(true);
      // for (row in rows) {
      //   console.log("---------------------------------------------")
      //   console.log(info[inside].timeSlot)
      //   console.log(rows[row])
      //   insertAttendanceByRegNo(rows[row].regNo, timeSlot, rows[row].courseCode, function (d) {
      //     if (d)
//=======
    }
  })
}
//<<<<<<< HEAD
function startSetting(info, x) {
  if (info[x]) {
    setStudentAttendance(info[x].courseCode, info[x].timeSlot, function (row) {
      if (row) {
        console.log("iteration# " +x)
        startSetting(info, x + 1)
      }
    })
  }
  else
  return
}
exports.setAttendanceByDay = function (day) {

  Slots.getClassesByDay(day, function (info) {
    console.log(info)
    startSetting(info, 0);
  })
//=======
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