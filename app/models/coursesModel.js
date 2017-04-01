var db = require('../../config/database.js')
var mysql = require('mysql')

exports.getCourses = function(type, id, done) {
    if(type=='student')
      col='regNo'
    else
      col='id'

    query= db.get().query('SELECT password FROM ?? WHERE ?? = ?', [type, col, id] ,function(err, result) {
      if (err) return done(err)
      if(result=='')
          return done(null, false)
      user={'type': type, 'id': id, 'password': result[0].password}
      done(null, user)
    })

}

exports.registerStudentCourses = function(regNo, courses) {
  for(courseCode in courses){
    if(courses[courseCode]!=''){
      post  = {courseCode: courses[courseCode], regNo: regNo}
     query= db.get().query('INSERT INTO `studentCourses` SET ?', post ,function(err, result) {
     })
   }
  }
}
exports.getCoursesByRegNo= function(regNo, done){
  query= db.get().query('SELECT courseCode FROM studentCourses WHERE regNo=?', regNo ,function(err, result) {
    if(err) return done(err)
        done(result)
  })
}

exports.registerTaCourses = function(id, courses) {
  for(courseCode in courses){
    if(courses[courseCode]!=''){
      post  = {courseCode: courses[courseCode], id: id}
     query= db.get().query('INSERT INTO `taCourses` SET ?', post ,function(err, result) {
     })
   }
  }
}
exports.getCoursesById= function(id, done){
  query= db.get().query('SELECT courseCode FROM taCourses WHERE id=?', id ,function(err, result) {
    if(err) return done(err)
        done(result)
  })
}
