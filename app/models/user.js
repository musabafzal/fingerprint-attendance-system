var db = require('../../config/database.js')

exports.findSlot = function(courseCode, done) {
  db.get().query('SELECT * FROM slots WHERE courseCode = ?', courseCode, function(err, rows) {
    if (err) return done(err)
    done(null, rows[0])
  })
}
//
// exports.getAll = function(done) {
//   db.get().query('SELECT * FROM comments', function (err, rows) {
//     if (err) return done(err)
//     done(null, rows)
//   })
// }
//
// exports.getAllByUser = function(userId, done) {
//   db.get().query('SELECT * FROM comments WHERE user_id = ?', userId, function (err, rows) {
//     if (err) return done(err)
//     done(null, rows)
//   })
// }
