var mysql = require('mysql')


var state = {
  pool: null,
}

exports.connect = function(done) {
  state.pool = mysql.createPool({
    host: '192.168.103.125',
    user: 'root',
    password: 'lolbro',
    database: 'attendanceDB'
  })

  done()
}

exports.get = function() {
  return state.pool
}
