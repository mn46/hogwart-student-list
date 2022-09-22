"use strict";

window.addEventListener("DOMContentLoaded", start);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  gender: "",
  imageFile: ``,
  house: undefined,
  inqSquad: false,
  prefect: false,
  expelled: false,
  bloodStatus: undefined,
};

const allStudents = [];
const expelledStudents = [];

function start() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      createObjects(jsonData);
      // console.log(jsonData);
    });
}

// universal functions to clean data

// function for cleaning strings from white space in the beginning and at the end

function trimString(string) {
  return string.trim();
}

// create new string from 0 index and 1st space

function cutToFirstSpace(string) {
  return string.slice(0, string.indexOf(" "));
}

// create new string from 1st to last space

function cutBetweenSpaces(string) {
  return string.slice(string.indexOf(" "), string.lastIndexOf(" "));
}

// create new string from last space to the end of primary string

function cutOffLast(string) {
  const lastString = string.slice(string.lastIndexOf(" "), string.length);
  return trimString(lastString);
}

// first letter to upper case

function firstToUppercase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function createObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);

    student.firstName = firstToUppercase(cutToFirstSpace(trimString(jsonObject.fullname)));

    const midString = cutBetweenSpaces(trimString(jsonObject.fullname));

    if (midString === " " || midString === "") {
      student.middleName = "";
    } else if (midString.includes(`"`)) {
      student.nickName = midString.trim();
    } else {
      student.middleName = firstToUppercase(trimString(midString));
    }

    student.lastName = firstToUppercase(cutOffLast(trimString(jsonObject.fullname)));
    student.gender = jsonObject.gender;

    if (jsonObject.fullname.includes("-")) {
      const noHyphen = student.lastName.slice(student.lastName.indexOf("-") + 1);
      student.imageFile = "assets/images/" + noHyphen.toLowerCase() + "_" + noHyphen[0].toLowerCase() + ".png";
    } else {
      student.imageFile = "assets/images/" + student.lastName.toLowerCase() + "_" + student.firstName[0].toLowerCase() + ".png";
    }

    student.house = firstToUppercase(jsonObject.house);
    student.inqSquad = false;
    student.prefect = false;
    student.expelled = false;
    student.bloodStatus = false;

    allStudents.push(student);
  });

  addData(allStudents);
}

// ADDING DATA

function addData(chosenArray) {
  // cleaning the list
  document.querySelectorAll(".student").forEach((element) => {
    element.remove();
  });

  document.querySelector("#number").textContent = "Number of displayed students: " + chosenArray.length;

  chosenArray.forEach((element) => {
    // console.log(element);
    const studTemplate = document.querySelector("#student").content;

    const studClone = studTemplate.cloneNode(true);

    studClone.querySelector(".fullname").textContent = element.firstName + " " + element.middleName + " " + element.nickName + " " + element.lastName;

    studClone.querySelector(".read-more").addEventListener("click", () => showDetails(element));
    // studClone.querySelector(".read-more").addEventListener("click", showDetails);
    studClone.querySelector(".expell").addEventListener("click", () => expellStudent(element));

    document.querySelector("#student-list").appendChild(studClone);
  });
}

// expelling student

function expellStudent(student) {
  student.expelled = true;
  allStudents.splice(allStudents.indexOf(student), 1);
  expelledStudents.push(student);
  console.log(allStudents);
  console.log(expelledStudents);
  addData(allStudents);
}

// displaying pop-up with detailed info about student

function showDetails(student) {
  console.log("show details");

  document.querySelector("#student-details").classList.remove("hidden");

  // adding data

  document.querySelector("#fullname").textContent = student.firstName + " " + student.middleName + " " + student.nickName + " " + student.lastName;
  document.querySelector("#student-photo").src = student.imageFile;
  document.querySelector("#house-info h2").textContent = student.house;

  if (student.firstName) {
    document.querySelector("#first-name").textContent = "First name: " + student.firstName;
  } else {
    document.querySelector("#first-name").textContent = "First name: -";
  }

  if (student.middleName) {
    document.querySelector("#first-name").textContent = "First name: " + student.firstName;
  } else {
    document.querySelector("#first-name").textContent = "First name: -";
  }
  document.querySelector("#middle-name").textContent = "Middle name: " + student.middleName;
  document.querySelector("#last-name").textContent = "Last name: " + student.lastName;
  document.querySelector("#nick-name").textContent = "Nick name: " + student.nickName;
  document.querySelector("#gender").textContent = "Gender: " + student.gender;
  document.querySelector("#prefect").textContent = "Prefect: " + student.prefect;
  document.querySelector("#blood-status").textContent = "Blood status: " + student.bloodStatus;

  // event listeners for buttons
  document.querySelector("#close").addEventListener("click", closeDetails);
  document.querySelector("#make-prefect").addEventListener("click", () => makePrefect(student));
  document.querySelector("#add-inq").addEventListener("click", () => addToSquad(student));
}

function closeDetails() {
  document.querySelector("#close").removeEventListener;
  document.querySelector("#student-details").classList.add("hidden");
}

// adding prefects and members of inq. squad

function makePrefect(student) {
  console.log("prefecting" + student);
}

function addToSquad(student) {
  console.log("adding to squad" + student);
}

// SORTING AND FILTERING

// making "apply" button work and selecting inputs for sorting and filtering

document.querySelector("#apply").addEventListener("click", startAdjusting);

function startAdjusting() {
  // This are arrays with selected input attributes
  const sortInput = [document.querySelector("#name"), document.querySelector("#surname")];
  const filterInput = [
    document.querySelector("#gryffindor"),
    document.querySelector("#hufflepuff"),
    document.querySelector("#ravenclaw"),
    document.querySelector("#slytherin"),
    document.querySelector("#prefects"),
    document.querySelector("#inq"),
    document.querySelector("#girls"),
    document.querySelector("#boys"),
    document.querySelector("#expelled"),
  ];

  getSort(sortInput, filterInput);
}

// function for checking if any of the checkboxes are checked

function isChecked(element) {
  return element.checked === true;
}

// SORTING

function getSort(sortInput, filterInput) {
  console.log("sort");
  let sortedArray;
  if (sortInput.some(isChecked)) {
    sortInput.forEach((option) => {
      if (option.checked === true) {
        switch (option.value) {
          case "name":
            sortedArray = allStudents.sort(compareName);
            console.log("sort by first name");
            break;
          case "surname":
            sortedArray = allStudents.sort(compareSurname);
            console.log("sort by last name");
            break;
        }
      }
    });
  } else {
    sortedArray = allStudents;
  }

  // console.log(sortedArray);
  getFilter(sortedArray, filterInput);
}

// functions for sorting

// sort by 1st name
function compareName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

// sort by surname
function compareSurname(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

// FILTERING

function getFilter(sortedArray, filterInput) {
  console.log("filter");
  let filteredArray;

  if (filterInput.some(isChecked)) {
    filterInput.forEach((input) => {
      if (input.checked === true) {
        switch (input.value) {
          case "gryffindor":
            filteredArray = sortedArray.filter((student) => student.house == "Gryffindor");
            document.querySelector("h1").textContent = "Gryffindor";
            console.log("gryf");
            break;
          case "hufflepuff":
            filteredArray = sortedArray.filter((student) => student.house == "Hufflepuff");
            document.querySelector("h1").textContent = "Hufflepuff";
            break;
          case "ravenclaw":
            filteredArray = sortedArray.filter((student) => student.house == "Ravenclaw");
            document.querySelector("h1").textContent = "Ravenclaw";
            break;
          case "slytherin":
            filteredArray = sortedArray.filter((student) => student.house == "Slytherin");
            document.querySelector("h1").textContent = "Slytherin";
            break;
          case "prefects":
            filteredArray = sortedArray.filter((student) => student.prefect === true);
            console.log("prefects");
            break;
          case "inq":
            filteredArray = sortedArray.filter((student) => student.inqSquad === true);
            console.log("inq");
            break;
          case "girls":
            filteredArray = sortedArray.filter((student) => student.gender === "girl");
            console.log("girls");
            break;
          case "boys":
            filteredArray = sortedArray.filter((student) => student.gender === "boy");
            console.log("boys");
            break;
          case "expelled":
            filteredArray = expelledStudents;
            console.log("expelled");
            break;
        }
      }
    });
  } else {
    filteredArray = sortedArray;
  }

  // console.log(filteredArray);

  // display filtered data

  adjustList(filteredArray);
}

function adjustList(filteredArray) {
  addData(filteredArray);
}

// cleaning the results
document.querySelector("#clear").addEventListener("click", clearResults);

function clearResults() {
  addData(allStudents);
}

// SEARCHING
