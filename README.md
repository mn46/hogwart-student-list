# (Hacked) Hogwart's student list

## Description
  
I was flattered when I got a request to create a well functioning system for Hogwart's School of Witchcraft and Wizardry. Who would have thought that it would turn into such an adventure! The first version had to include basic functionalities such as sorting, filtering and searching. Apart from that the user has possibility to perform some actions on particular students: they can be expelled or "promoted" to the role of prefect if certain conditions are fulfilled: there can be only 2 prefects in each house and it has to be boy and girl. It was important to make sure that the data is consistent (eg. all names starting with capital letter), therefore a huge part of the code is focused on "cleaning up" existing strings.  
Everything seemed to work perfectly, but is was just calm before the storm. Due to some radical changes at school, the system had to be updated with some new options. The information about the "blood status" had to be added to each student's profile, but first it was necessary to figure it out from separate set of data. Apart from that, Inquisitorial Squad was created and there was a need for a possibility to add there pure-blood students from Slytherin only.  
As someone who values equality and peace, I could not just stand and watch, therefore I created a genius tricky fishing ad which triggers a "hack" function. When activated, it broke some important functionalities: the blood status information got assigned randomly to students' profiles, with no regard for their true origin. The Inquisitorial Squad cannot function anymore, because when a student is added to that group, they get removed after a couple of seconds.  
Now, for real, this is the final project for "Just JavaScript" theme, during which I got more comfortable with that language and I learned how to plan the process of creating a website with multiple functionalities. The website is not responsive, because that was not the main focus of the exercise.

## List of features

* displaying list of all students, where:
  * the initial data is rearranged and strings are “cleaned up”
  * new information, such as prefect status, is added
* displaying detailed information about the students
* figuring out students’ blood status, basing on their families’ data
* assigning prefect function to a student, where:
  * there are only 2 prefects for each house
  * it can be only one boy and one girl
* expelling a student
* adding and removing student to/from Inquisitorial Squad
* sorting alphabetically by first and last name
* filtering by: house, gender, prefect status, Inquisitorial Squad status, expelled status
* hacking the system (accessible approx. 1 minute after the website is loaded), where:
  * a newly inserted student - me - cannot be expelled
  * former pure-blood students have random blood status and all other students are pure-blood
  * after adding a student to the Inquisitorial Squad, they are removed after 5 seconds.


## Technologies

* HTML
* CSS
* JavaScript
