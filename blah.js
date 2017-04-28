var SSH = require('simple-ssh');
 
var ssh = new SSH({
    host: '192.168.51.100',
    port: '22',
    user: 'pi',
    pass: 'shahidbh'
});
 
ssh.exec('ls', {
    out: function(stdout) {
        console.log(stdout);
    }
}).start();
 
