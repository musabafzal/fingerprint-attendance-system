import httplib
import MySQLdb
from pyfingerprint.pyfingerprint import PyFingerprint
import sys
import datetime
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(20,GPIO.OUT)
GPIO.setup(21,GPIO.OUT)


start = datetime.datetime.now()
stop = start+datetime.timedelta(minutes= 1)

print sys.argv
lectureHall = sys.argv[1]
courseCode = sys.argv[2]
timeSlot = sys.argv[3]
todayDate= sys.argv[4]


try:
    f = PyFingerprint('/dev/ttyACM0', 57600, 0xFFFFFFFF, 0x00000000)

    if ( f.verifyPassword() == False ):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    exit(1)

db = MySQLdb.connect(host="192.168.103.125",    # your host, usually localhost
                     user="root",         # your username
                     passwd="seproject123",  # your password
                     db="attendanceDB")        # name of the data base

db1 = MySQLdb.connect(host="192.168.51.100",    # your host, usually localhost
                     user="root",         # your username
                     passwd="lolbro",  # your password
                     db="attend")        # name of the data base

res = courseCode
cur = db.cursor()
cur1 = db1.cursor()

try:
    sql="SELECT regNo FROM studentCourses WHERE courseCode='%s'" % (res)
    cur.execute(sql)
    results=cur.fetchall()
except:
     print('error')

pos=0

sql = "DELETE FROM attendance"
try:
   cur1.execute(sql)
   db1.commit()
except:
   db1.rollback()
for row in results:
    try:
        sql="INSERT INTO attendance VALUES (%s, %s, %s, %s, %s, %s)"
        values=(pos, row[0], res, todayDate, timeSlot, 'A')
        cur1.execute(sql, values)
        db1.commit()
        pos=pos+1
    except:
        print('error')
        db1.rollback()


fingerPrints=[]
for row in results:
    regNo=str(row[0])
    try:
        sql="SELECT fingerPrint FROM student WHERE regNo='%s'" % (regNo)
        cur.execute(sql)
        fing=cur.fetchall()
        fingerPrints.append(fing[0][0])
    except:
         print('error')

fingerPrintsToBeUploaded=[]


for fingerPrint in fingerPrints:
    finger=fingerPrint[1:len(fingerPrint)-1]
    finstr= finger.split(",")
    individualFingerprint=[]
    for strs in finstr:
        individualFingerprint.append(int(strs))
    fingerPrintsToBeUploaded.append(individualFingerprint)
for row in results:
    try:
        sql="INSERT INTO attendance VALUES (%s, %s, %s, %s, %s, %s)"
        values=(pos, row[0], res, todayDate, timeSlot, 'A')
        cur1.execute(sql, values)
        db1.commit()
        pos=pos+1
    except:
        print('error')
        db1.rollback()


fingerPrints=[]
for row in results:
    regNo=str(row[0])
    try:
        sql="SELECT fingerPrint FROM student WHERE regNo='%s'" % (regNo)
        cur.execute(sql)
        fing=cur.fetchall()
        fingerPrints.append(fing[0][0])
    except:
         print('error')

fingerPrintsToBeUploaded=[]


for fingerPrint in fingerPrints:
    finger=fingerPrint[1:len(fingerPrint)-1]
    finstr= finger.split(",")
    individualFingerprint=[]
    for strs in finstr:
        individualFingerprint.append(int(strs))
    fingerPrintsToBeUploaded.append(individualFingerprint)

f.clearDatabase()
for fingerPrint in fingerPrintsToBeUploaded:
    print(f.uploadCharacteristics(0x01,fingerPrint))
    print(f.uploadCharacteristics(0x02,fingerPrint))

    positionNumber = f.storeTemplate()
    print('Finger enrolled successfully!')
    print('New template position #' + str(positionNumber))


## Wait that finger is read

while(datetime.datetime.now()<stop):
    if( f.readImage() == False ):
        pass
    else:
        ## Converts read image to characteristics and stores it in charbuffer 1
        f.convertImage(0x01)

        ## Searchs template
        result = f.searchTemplate()

        positionNumber = result[0]
        accuracyScore = result[1]

        if ( positionNumber == -1 ):
            print('No match found!')
            GPIO.output(21,0)
            GPIO.output(20,1)
        else:
            GPIO.output(20,0)
            GPIO.output(21,1)
            sql = "UPDATE attendance SET status = 'P' WHERE templatePosition = '%s'" % (positionNumber)
            try:
               # Execute the SQL command
               cur1.execute(sql)
               # Commit your changes in the database
               db1.commit()
            except:
               # Rollback in case there is any error
               print('error')
               db1.rollback()
            print('Found template at position #' + str(positionNumber))
            print('The accuracy score is: ' + str(accuracyScore))

try:
    sql="SELECT * FROM attendance WHERE status='P'"
    cur1.execute(sql)
    todayAttend=cur1.fetchall()
except:
     print('error')


for row in todayAttend:
    sql = "UPDATE attendance SET status = 'P' WHERE regNo= '%s' AND courseCode='%s' AND date='%s' AND timeSlot='%s'" % (str(row[1]), row[2], row[3], row[4])
    try:
       # Execute the SQL command
       cur.execute(sql)
       # Commit your changes in the database
       db.commit()
    except:
       # Rollback in case there is any error
       print('error')
       db.rollback()
            try:
               # Execute the SQL command
               cur1.execute(sql)
               # Commit your changes in the database
               db1.commit()
            except:
               # Rollback in case there is any error
               print('error')
               db1.rollback()
            print('Found template at position #' + str(positionNumber))
            print('The accuracy score is: ' + str(accuracyScore))

try:
    sql="SELECT * FROM attendance WHERE status='P'"
    cur1.execute(sql)
    todayAttend=cur1.fetchall()
except:
     print('error')


for row in todayAttend:
    sql = "UPDATE attendance SET status = 'P' WHERE regNo= '%s' AND courseCode='%s' AND date='%s' AND timeSlot='%s'" % (str(row[1]), row[2], row[3], row[4])
    try:
       # Execute the SQL command
       cur.execute(sql)
       # Commit your changes in the database
       db.commit()
    except:
       # Rollback in case there is any error
       print('error')
       db.rollback()
db1.close()
db.close()


print('exiting')

GPIO.output(20,0)
GPIO.output(21,0)
