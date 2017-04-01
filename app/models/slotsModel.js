var db = require('../../config/database.js')

exports.insertCourses = function(courseList) {
  var i=0
  for(course in courseList){
    i++
      //if(courseList[course]!='')
      {
        console.log(i)
        query=db.get().query('UPDATE slots SET courseCode=? WHERE id=?',[courseList[course],i],
        function(err,rows,fields){
        });
      }
  }
}

exports.getUniqueCourses = function(done) {

  query=db.get().query('SELECT DISTINCT courseCode FROM slots ORDER BY courseCode;',
  function(err,rows,fields){
    done(rows)
  });
}

exports.getAllSlots = function(done) {
  var i=0
  query=db.get().query('SELECT courseCode FROM slots',
  function(err,rows,fields){
    done(rows)
  });
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
       console.log(err)
     });

    }
  }
}

}
*/
