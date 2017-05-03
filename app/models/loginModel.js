var db = require('../../config/database.js')

exports.findUserAndValidatePass = function(type, id, done) {
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
