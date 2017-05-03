var db = require('../../config/database.js')

// exports.populateStudentTable= function(){
//   var s=2014001
//   for(var i=0; i<500;i++){
//     post  = {regNo: s, password: s, name: "Mr A",  fingerPrint: "******"}
//     query=db.get().query('INSERT INTO student SET ?', post, function(err,rows,fields){
//       // console.log(err)
//     });
//     s++;
//   }
// }

exports.populateTaTable= function(){
  var s=1001;
  for(var i=0; i<50;i++){
    post  = {id: s, password: s, name: "Mr TA"}
    query=db.get().query('INSERT INTO ta SET ?', post, function(err,rows,fields){
      // console.log(err)
    });
    s++;
  }
}

//
// days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//
// timeSlots= ['08:00-08:50', '09:00-09:50', '10:30-11:20', '11:30-12:20', '12:30-13:20', '14:30-15:20', '15:30-16:20', '16:30-17:20'];
//   n
// lectureHalls = ['CS LH1', 'CS LH2', 'CS LH3', 'EE LH4', 'EE LH5', 'EE LH6', 'EE Main', 'ES LH1', 'ES LH2', 'ES LH3', 'ES LH4', 'ES Main'
//                 , 'BB LH1', 'BB LH2', 'BB Main', 'ME LH1', 'ME LH2', 'ME LH3', 'ME Main', 'ED Hall', 'MCE LH1', 'MCE LH2', 'MCE LH3'
//                 , 'MCE LH4', 'MCE Main'];
// id=0;
//
// for(var d=0;d<5;d++) {
//   for(var l=0;l<25;l++) {
//    for(var o=0;o<8;o++) {
//      id++;
//      query=db.get().query('INSERT INTO slots SET id = ?, day = ?, timeSlot = ?, lectureHall =?',[id,days[d],timeSlots[o],lectureHalls[l]],
//      function(err,rows,fields){
//        // console.log(err)
//      });
//
//     }
//   }
// }
//
// }
