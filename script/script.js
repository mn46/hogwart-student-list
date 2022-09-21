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
  house: "",
  inqSquad: false,
  prefect: false,
  expelled: false,
};

// i will be used when adding data to the pop-up with detailed info about each student
let iteration = 0;
const allStudents = [];

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
  const lastString = string.slice(string.lastIndexOf(" "));
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
      student.imageFile = noHyphen.toLowerCase() + "_" + noHyphen[0].toLowerCase() + ".png";
    } else {
      student.imageFile = student.lastName.toLowerCase() + "_" + student.firstName[0].toLowerCase() + ".png";
    }

    student.house = firstToUppercase(jsonObject.house);

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

  chosenArray.forEach((element) => {
    console.log(element);
    iteration++;
    const studTemplate = document.querySelector("#student").content;

    const studClone = studTemplate.cloneNode(true);

    studClone.querySelector(".fullname").textContent = element.firstName + " " + element.middleName + " " + element.nickName + " " + element.lastName;

    studClone.querySelector(".read-more").addEventListener("click", showDetails);

    document.querySelector("#student-list").appendChild(studClone);
  });
}

function showDetails() {
  console.log("show details");
}

// SORTING AND FILTERING

// making sort and filters work

document.querySelector("#apply").addEventListener("click", startAdjusting);

function startAdjusting() {
  // This are arrays with selected input attributes
  const sortInput = [document.querySelector("#name"), document.querySelector("#surname")];
  const filterInput = [document.querySelector("#prefects"), document.querySelector("#inq"), document.querySelector("#girls"), document.querySelector("#boys"), document.querySelector("#expelled")];

  getSort(sortInput, filterInput);
}

// function for checking if any of the checkboxes are checked

function checked() {
  return array.checked === true;
}

// SORTING

function getSort(sortInput, filterInput) {
  console.log("sort");
  let sortedArray;
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
    } else {
      sortedArray = allStudents;
    }
  });
  console.log(sortedArray);
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
            filteredArray = sortedArray.filter((student) => student.expelled === true);
            console.log("expelled");
            break;
        }
      }
    });
  } else {
    filteredArray = sortedArray;
  }

  console.log(filteredArray);

  // display filtered data

  adjustList(filteredArray);
}

function isChecked(element) {
  return element.checked === true;
}

function adjustList(filteredArray) {
  addData(filteredArray);
  document.querySelector("#clear").addEventListener("click", clearResults);
}

function clearResults() {
  addData(allStudents);
}
