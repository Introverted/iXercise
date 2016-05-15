# iXercise WebAPP
#####Project for INF132

######Newest version of the iXercise WebAPP, it runs on a server now.
---
######Download this project to your desktop and follow these steps:

1. make sure node.js is installed in your computer [try the other steps to see if it works without you having to install this]
2. run cmd
3. go to the project folder
4. run >node server.js
5. go on the browser and type localhost:8173
6. The website should run

---
######For now you can put anything and it will take you to the doctor version. 

I always put -  
id: d
and pass: 1.

---
######Important files containing the code: 
**Home pages:**

1. home.html - general information about the webapp
2. loginScreen.html - to login

**Doctor pages:**

1. admin_doctor.html - admin page for the doctor
2. mainD.html - the home page for the doctor version of the site
3. patientListD.html - shows all of the patients that the doctor has, add/remove patients
4. patientProfileD.html - shows a single patient's statistics 

**Trainer pages:**

1. mainT.html - the home page for the trainer version of the site 
2. patientListT.html - shows all of the patients that the trainer has, add/remove patients
3. patientProfileT.html - shows a single patient's statistics 

**Admin page:**

1. userList.html - contains a list of everyone in the system, add/remove users

**Pages used by both the Doctor & Trainer:**

1. change_password.html - to change password

**JS files:**

1. server.js - manages database access and sending the information to the client in the html pages
2. functions.js [in the js folder] - page contains variables that are used by all pages and some functions that is used by more thatn one page. Good for putting information that more than one page will be using since it is being loaded by all of the pages.

