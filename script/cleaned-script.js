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
};

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

  // addData();
}

// function addData() {
//   allStudents.forEach((student) => {
//     console.log("test" + student);
//     const studTemplate = document.querySelector("#student").content;

//     const studClone = studTemplate.cloneNode(true);

//     studClone.querySelector(".fullname").textContent = student.firstName + " " + student.middleName + " " + student.nickName + " " + student.lastName;

//     studClone.querySelector(".read-more").addEventListener("click", showDetails);

//     document.querySelector("#student-list").appendChild(studClone);
//   });
// }

// function showDetails() {
//   console.log(this);
// }
