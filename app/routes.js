// app/routes.js
var Slots = require('../app/models/slotsModel');
var Courses = require('../app/models/coursesModel');
var Attendance = require('../app/models/attendanceModel');
var Populate = require('../app/models/populateModel');
Attendance.setAttendanceByDay('Monday');
module.exports = function (app, passport) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/attendancePercentage', function (req, res) {

        Courses.setAttendancePercentages(function (info) {

            res.send(info)

            //console.log(info);

        });

    });

    app.get('/', function (req, res) {
        res.redirect('/login'); // load the index.ejs file
    });
    app.get('/populateDataBase', function (req, res) {
        //Populate.populateStudentTable();
        Populate.populateTaTable();
        res.end();
    });

    app.get('/lectureHall/:lectureHall', function (req, res) {

        Slots.getLectureHall(req.params.lectureHall, function (info) {

            res.send(info)

            console.log(info);
            if (info.rescheduled) {
                Slots.unSetRecheduled(info, function (bool) {
                    console.log(bool);
                })
            }

        });

    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form

    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.get('/login/:user', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render(req.params.user + 'Login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/panel/:user', isLoggedIn, function (req, res) {


        res.render(req.user.type + 'Panel.ejs', {
            user: req.user // get the user out of session and pass to template
        });

    });

    app.get('/panel/:user/:method', isLoggedIn, function (req, res) {
        if (req.params.user == 'admin' && req.params.method == 'updateTimetable') {
            Slots.getAllSlots(function (slots) {
                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    slots: slots
                });
            });
        }
        else if (req.params.user == 'student' && req.params.method == 'registerCourses') {
            Slots.getUniqueCourses(function (courseList) {

                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    courseList: courseList
                });
            });
        } else if (req.params.user == 'student' && req.params.method == 'viewAttendance') {
            Courses.getCoursesByRegNo(req.user.id, function (courses) {
                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    courses: courses
                });
            });
        }
        else if (req.params.user == 'student' && req.params.method == 'notification') {
            Courses.rescheduledCourses(req.user.id, function (courses) {
                res.send(courses);
            })
        }
        else if (req.params.user == 'ta' && req.params.method == 'viewUpdateAttendance') {
            Courses.getCoursesById(req.user.id, function (courses) {
                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    courses: courses
                });
            });
        }
        else if (req.params.user == 'ta' && req.params.method == 'registerCourses') {
            Slots.getUniqueCourses(function (courseList) {
                console.log(courseList)
                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    courseList: courseList
                });
            });
        }
        else if (req.params.user == 'ta' && req.params.method == 'rescheduleCourse') {
            Courses.getCoursesById(req.user.id, function (courses) {
                res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    courses: courses
                });
            });
        }
        else {
            res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        }
    });

    app.get('/panel/student/viewAttendance/:courseCode', isLoggedIn, function (req, res) {
        Attendance.getAttendanceByStudentCourse(req.user.id, req.params.courseCode, function (courseAttendance) {
            res.render('courseAttendance_studentPanel.ejs', {
                user: req.user, // get the user out of session and pass to template
                courseAttendance: courseAttendance
            });
        })
    });

    app.get('/panel/ta/viewUpdateAttendance/:courseCode', isLoggedIn, function (req, res) {
        Attendance.getUniqueDatesByTaCourse(req.params.courseCode, function (uniqueDates) {
            res.render('uniqueDates_taPanel.ejs', {
                user: req.user, // get the user out of session and pass to template
                uniqueDates: uniqueDates,
                courseCode: req.params.courseCode
            });
        })
    });

    app.get('/panel/ta/rescheduleCourse/:courseCode', isLoggedIn, function (req, res) {
        Slots.getCourseSlots(req.params.courseCode, function (courseSlots) {
            res.render('selectDateForReschedule.ejs', {
                user: req.user,
                courseCode: req.params.courseCode,
                courseSlots: courseSlots
            })
        })

    });
    app.get('/panel/ta/rescheduleCourse/:courseCode/getSlots', isLoggedIn, function (req, res) {

        Slots.getFreeSlots(req.query.day, req.query.timeSlots, function (slots) {

            res.render('SlotsrescheduleCourse_taPanel.ejs', {
                user: req.user,
                courseCode: req.params.courseCode,
                slots: slots,
                classSlot: req.query.classSlot,
                time: req.query.timeSlots,
                day: req.query.day
            })
        }
        )
    });
    app.get('/panel/ta/viewUpdateAttendance/:courseCode/:date', isLoggedIn, function (req, res) {
        Attendance.getAttendanceByDate(req.params.courseCode, req.params.date, function (attendance) {
            res.render('attendanceByDate_taPanel.ejs', {
                user: req.user, // get the user out of session and pass to template
                attendance: attendance,
                courseCode: req.params.courseCode,
                date: req.params.date
            });
<<<<<<< HEAD
        });
    }
    else {
        res.render(req.params.method + '_' + req.user.type + 'Panel.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    }
});

app.get('/panel/student/viewAttendance/:courseCode', isLoggedIn, function (req, res) {
    Attendance.getAttendanceByStudentCourse(req.user.id, req.params.courseCode, function (courseAttendance) {
        res.render('courseAttendance_studentPanel.ejs', {
            user: req.user, // get the user out of session and pass to template
            courseAttendance: courseAttendance,
            courseCode: req.params.courseCode
       });
    })
});

app.get('/panel/ta/viewAttendance/:courseCode', isLoggedIn, function (req, res) {
    Attendance.getUniqueDatesByTaCourse(req.params.courseCode, function (uniqueDates) {
        res.render('uniqueDates_taPanel.ejs', {
            user: req.user, // get the user out of session and pass to template
            uniqueDates: uniqueDates,
            courseCode: req.params.courseCode
        });
    })
});
app.get('/panel/ta/rescheduleCourse/:courseCode', isLoggedIn, function (req, res) {
    Slots.getCourseSlots(req.params.courseCode, function (courseSlots) {
        res.render('selectDateForReschedule.ejs', {
            user: req.user,
            courseCode: req.params.courseCode,
            courseSlots: courseSlots
=======
>>>>>>> 3ddda1c536d77df7214b288340934ba01c2057a0
        })
    });


    app.post('/panel/admin/updateTimetable', isLoggedIn, function (req, res) {
        Slots.insertCourses(req.body);
        res.redirect('/panel/admin/')
    });

    app.post('/panel/student/registerCourses', isLoggedIn, function (req, res) {
        Courses.registerStudentCourses(req.user.id, req.body)
        res.redirect('/panel/student/registerCourses')
    });

    app.post('/panel/ta/registerCourses', isLoggedIn, function (req, res) {
        Courses.registerTaCourses(req.user.id, req.body)
        res.redirect('/panel/ta/registerCourses')
    });

    app.post('/panel/ta/viewUpdateAttendance/:courseCode/:date', isLoggedIn, function (req, res) {
        Attendance.updateAttendance(req.params.courseCode, req.params.date, req.body);
        res.redirect('/panel/ta/viewUpdateAttendance')
    });

    app.post('/panel/ta/rescheduleCourse/:courseCode', isLoggedIn, function (req, res) {
        Slots.getFreeSlots(req.body.day, req.body.timeSlots, function (slots) {
            res.render("rescheduleCourse_taPanel.ejs", {
                user: req.user,
                slots: slots
            })
        })
    });

    app.post('/panel/ta/rescheduleCourse/:courseCode/getSlots', isLoggedIn, function (req, res) {

        Slots.alterCourseSlots(req.query.classSlot, req.query.day, req.query.timeSlots, req.body.lectureHall, req.params.courseCode, function (confirmed) {
            res.send("done");
            res.redirect("/panel/ta");
        })
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    /*// process the login form
    app.post('/login/:user', function(req, res, next) {
      console.log(req.params.user);
      passport.authenticate('login', {
        successRedirect : '/panel', // redirect to the secure profile section
        failureFlash : true // allow flash messages
    })
    });*/
    app.post('/login/:user', function (req, res, next) {
        passport.authenticate('login', function (err, user, info) {
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login/' + req.params.user); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                // Redirect if it succeeds
                return res.redirect('/panel/' + user.type);
            });
        })(req, res, next);
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
