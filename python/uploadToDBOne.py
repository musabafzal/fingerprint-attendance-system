
import tempfile
import MySQLdb
from pyfingerprint.pyfingerprint import PyFingerprint
import sys
import time

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

db = MySQLdb.connect(host="192.168.103.125",    # your host, usually localhost
                     user="root",         # your username
                     passwd="seproject123",  # your password
                     db="attendanceDB")        # name of the data base



cur = db.cursor()

f.clearDatabase()

## Tries to enroll new finger
try:
    print('Waiting for finger...')

    ## Wait that finger is read
    while ( f.readImage() == False ):
        pass

    ## Converts read image to characteristics and stores it in charbuffer 1
    f.convertImage(0x01)

    ## Checks if finger is already enrolled
    result = f.searchTemplate()
    positionNumber = result[0]

    if ( positionNumber >= 0 ):
        print('Template already exists at position #' + str(positionNumber))
        exit(0)

    print('Remove finger...')
    time.sleep(2)

    print('Waiting for same finger again...')

    ## Wait that finger is read again
    while ( f.readImage() == False ):
        pass

    ## Converts read image to characteristics and stores it in charbuffer 2
    f.convertImage(0x02)

    ## Compares the charbuffers and creates a template
    if f.compareCharacteristics() != 0:
        f.createTemplate()
        ## Saves template at new position number
        positionNumber = f.storeTemplate()
        print('Finger enrolled successfully!')
        print('New template position #' + str(positionNumber))
    else:
        print('Fingerprints do not match')

    ## Saves template at new position number


except Exception as e:
    print('Operation failed!')
    print('Exception message: ' + str(e))
    exit(1)


name = sys.argv[1]
regNo= int(sys.argv[2])
f.loadTemplate(0)
try:
    sql="INSERT INTO student VALUES (%s, %s, %s, %s)"
    values=(str(regNo), str(regNo), name, str(f.downloadCharacteristics()))
    cur.execute(sql, values)
    db.commit()
except:
    print('error')
    db.rollback()

db.close()
