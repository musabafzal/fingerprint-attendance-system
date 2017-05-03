import tempfile
import MySQLdb
from pyfingerprint.pyfingerprint import PyFingerprint


## Reads image and download it
##

## Tries to initialize the sensor
try:
    f = PyFingerprint('/dev/ttyACM0', 57600, 0xFFFFFFFF, 0x00000000)

    if ( f.verifyPassword() == False ):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    exit(1)

totalNoOfFingerPrints=f.getTemplateCount()

db = MySQLdb.connect(host="192.168.51.100",    # your host, usually localhost
                     user="root",         # your username
                     passwd="lolbro",  # your password
                     db="attendanceDB")        # name of the data base


cur = db.cursor()

names= ['Noyan','Urwah','Musab']
count=0
regNo=2014001
for j in range(3):
    currName=names[j]
    for i in range(10):
        name = currName+' '+str(i)
        f.loadTemplate(count)
        try:
            sql="INSERT INTO student VALUES (%s, %s, %s, %s)"
            values=(str(regNo), str(regNo), name, str(f.downloadCharacteristics()))
            cur.execute(sql, values)
            db.commit()
        except:
             print('error')
             db.rollback()
        regNo=regNo+1
        count=count+1

db.close()
