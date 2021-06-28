#### CLASSROOM

CLASSROOM is a virtual-classroom application, inspired by Google Classroom.
This is the Capstone project of CS50W 2020.

#### Features

1. Create a user.
2. Create a Classroom.
3. Enroll yourself in a class.
4. Find all enrolled classes in the Homepage.
5. Submit assignments to the class, which can be accessed by the classroom faculty(creater of the classroom).
6. View updates made by the faculty in the classroom.
7. View assignments submitted to the classroom, if you're the classroom faculty.
8. Be notified about any updates from any classrooms enrolled in. Or about the assignment submissions, if you're the classroom faculty.

#### Files & Directories

- `Main Directory`

  - It contains two folders: 
    1. `classroom` - The backend Django project folder which is used to access data. Inside this folder you can find classroom and GCR.
            
        - `classroom` - The main folder containing `settings.py` for the DRF project.

        - `GCR` - The Django application which has `models.py`,`serializers.py`,`urls.py`,`utils.py` and `views.py`.

    2. `classroomui` - The frontend ReactJS project folder which is the presentation layer of the project. Inside this folder you can find `public` and `src`.
            
        - `public` - Inside public is the main `index.html` file, which is the base of the single page application.

        - `src` - The src folder is where you can find all the react components used in the project. `index.js` is the file that integrates react with `index.html`.
        `Homepage.js`,`Classpage.js` and other files are used to render the specific queried information.



> Note : All packages used by the two applications- django and react can be found in `requirements.txt` and `package.json` files in the two project folders `classroom` and `classroomui` respectively.