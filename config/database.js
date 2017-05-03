var mysql = require('mysql')


var state = {
  pool: null,
}

exports.connect = function(done) {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'seproject123',
    database: 'attendanceDB'
  })

  done()
}

exports.get = function() {
  return state.pool
}
