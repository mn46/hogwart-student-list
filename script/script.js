"use strict";

window.addEventListener("DOMContentLoaded", fetchFamilies);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";

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

let filesCounter = 0;
let familyNames;
const allStudents = [];
const expelledStudents = [];

// fetching the data for blood status

function fetchFamilies() {
  fetch(urlFamilies)
    .then((response) => response.json())
    .then((jsonFamilyData) => {
      checkFile();
      filesCounter++;
      console.log(filesCounter);
      familyNames = jsonFamilyData;
      console.log(familyNames);
    });
}

function checkFile() {
  if (filesCounter !== 0) {
    fetchStudents();
  } else {
    setTimeout(checkFile, 1000);
  }
}

// fetching the data for students

function fetchStudents() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      console.log(jsonData);
      createObjects(jsonData);
      setTimeout(displayHackPopup, 60000);
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

// split string on hyphen

function getBeforeHyphen(string) {
  return string.slice(0, string.indexOf("-"));
}

function getAfterHyphen(string) {
  return string.slice(string.indexOf("-") + 1);
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

    if (jsonObject.fullname.includes("-")) {
      const firstPart = firstToUppercase(getBeforeHyphen(cutOffLast(trimString(jsonObject.fullname))));
      const secondPart = firstToUppercase(getAfterHyphen(cutOffLast(trimString(jsonObject.fullname))));
      student.lastName = firstPart + "-" + secondPart;
    } else {
      student.lastName = firstToUppercase(cutOffLast(trimString(jsonObject.fullname)));
    }

    student.gender = jsonObject.gender;

    if (jsonObject.fullname.includes("-")) {
      const noHyphen = getAfterHyphen(jsonObject.fullname).toLowerCase();
      student.imageFile = "assets/images/" + noHyphen.toLowerCase() + "_" + student.firstName[0].toLowerCase() + ".png";
    } else {
      student.imageFile = "assets/images/" + student.lastName.toLowerCase() + "_" + student.firstName[0].toLowerCase() + ".png";
    }

    student.house = firstToUppercase(trimString(jsonObject.house));
    student.inqSquad = false;
    student.prefect = false;
    student.expelled = false;
    student.bloodStatus = getBloodStatus(student);
    // console.log(`${student.firstName} is ${student.bloodStatus}`);

    allStudents.push(student);
  });

  addData(allStudents);
  console.log(allStudents);
}

// ADDING DATA

function addData(chosenArray) {
  // cleaning the list
  document.querySelectorAll(".student").forEach((element) => {
    element.remove();
  });

  document.querySelector("#number").textContent = "Number of displayed students: " + chosenArray.length;

  chosenArray.forEach((element) => {
    const studTemplate = document.querySelector("#student").content;

    const studClone = studTemplate.cloneNode(true);

    studClone.querySelector(".fullname").textContent = element.firstName + " " + element.middleName + " " + element.nickName + " " + element.lastName;

    studClone.querySelector(".read-more").addEventListener("click", () => showDetails(element));
    studClone.querySelector(".expell").addEventListener("click", () => expellStudent(element));

    document.querySelector("#student-list").appendChild(studClone);
  });
}

// expelling student

function expellStudent(student) {
  if (student.nickName === "Hackerman") {
    document.querySelector("#message").textContent = "You cannot expell me. Sorry!";
    showMessage();
  } else {
    student.expelled = true;
    allStudents.splice(allStudents.indexOf(student), 1);
    expelledStudents.push(student);
    console.log(allStudents);
    console.log(expelledStudents);
    addData(allStudents);
    document.querySelector("#message").textContent = `${student.firstName} was expelled.`;
    showMessage();
  }
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
  } else if (student.firstName === "") {
    document.querySelector("#first-name").textContent = "First name: -";
  }

  if (student.middleName) {
    document.querySelector("#middle-name").textContent = "Middle name: " + student.middleName;
  } else if (student.middleName === "") {
    document.querySelector("#middle-name").textContent = "Middle name: -";
  }
  // document.querySelector("#middle-name").textContent = "Middle name: " + student.middleName;
  document.querySelector("#last-name").textContent = "Last name: " + student.lastName;
  document.querySelector("#nick-name").textContent = "Nick name: " + student.nickName;
  document.querySelector("#gender").textContent = "Gender: " + student.gender;
  document.querySelector("#prefect").textContent = "Prefect: " + student.prefect;
  document.querySelector("#blood-status").textContent = "Blood status: " + student.bloodStatus;

  // appearance

  if (student.house === "Gryffindor") {
    document.querySelector("#details-container").style.backgroundColor = "#F2B9B9";
    document.querySelector("#house-info img").src = `assets/crests/Gryffindor.svg`;
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#details-container").style.backgroundColor = "#FFEAAF";
    document.querySelector("#house-info img").src = `assets/crests/Hufflepuff.svg`;
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#details-container").style.backgroundColor = "#A1C0FF";
    document.querySelector("#house-info img").src = `assets/crests/Ravenclaw.svg`;
  } else if (student.house === "Slytherin") {
    document.querySelector("#details-container").style.backgroundColor = "#7ED1B3";
    document.querySelector("#house-info img").src = `assets/crests/Slytherin.svg`;
  }

  // event listeners for buttons
  document.querySelector("#close").addEventListener("click", closePopup);
  document.querySelector("#make-prefect").addEventListener("click", makePrefectCallBack);
  function makePrefectCallBack() {
    makePrefect(student);
  }

  if (student.inqSquad === true) {
    document.querySelector("#add-inq").addEventListener("click", removeFromSquadCallback);
    document.querySelector("#add-inq").textContent = "Remove from Inquisitorial Squad";
  } else {
    document.querySelector("#add-inq").addEventListener("click", addToSquadCallback);
    document.querySelector("#add-inq").textContent = "Add to Inquisitorial Squad";
  }

  function removeFromSquadCallback() {
    removeFromSquad(student);
    document.querySelector("#add-inq").removeEventListener("click", removeFromSquadCallback);
  }

  function addToSquadCallback() {
    console.log("add to squad");
    addToSquad(student);
    document.querySelector("#add-inq").removeEventListener("click", addToSquadCallback);
  }

  function closePopup() {
    document.querySelector("#make-prefect").removeEventListener("click", makePrefectCallBack);

    document.querySelector("#close").removeEventListener("click", closePopup);
    document.querySelector("#student-details").classList.add("hidden");
  }
}

// GETTING BLOOD STATUS OF STUDENTS

function getBloodStatus(student) {
  for (let n = 0; n <= familyNames.pure.length; n++) {
    // console.log(familyNames.half);
    if (n < familyNames.pure.length) {
      if (student.lastName === familyNames.pure[n]) {
        return "pure-blood";
      }
    } else {
      for (let x = 0; x <= familyNames.half.length; x++) {
        if (x < familyNames.half.length) {
          if (student.lastName === familyNames.half[x]) {
            return "half-blood";
          }
        } else {
          return "muggle-born";
        }
      }
    }
  }
}

// ADDDING PREFECTS

const prefectsG = [];
const prefectsH = [];
const prefectsR = [];
const prefectsS = [];

function makePrefect(student) {
  console.log("prefecting" + student.firstName);
  console.log(student.house);
  switch (student.house) {
    case "Gryffindor":
      goToHouse(student, prefectsG);
      break;
    case "Hufflepuff":
      goToHouse(student, prefectsH);
      break;
    case "Ravenclaw":
      goToHouse(student, prefectsR);
      break;
    case "Slytherin":
      goToHouse(student, prefectsS);
      break;
  }
}

function goToHouse(student, chosenArray) {
  if (chosenArray.length == 0) {
    chosenArray.push(student);
    student.prefect = true;
    document.querySelector("#message").textContent = `${student.firstName} is now a prefect.`;
    showMessage();
  } else if (chosenArray.length == 1) {
    checkGender(student, chosenArray);
  } else if (chosenArray.length == 2) {
    document.querySelector("#message").textContent = `There is no space in ${student.house} for more prefects.`;
    showMessage();
  }
  console.log(chosenArray);
}

function checkGender(student, prefectsArray) {
  if (prefectsArray[0].gender === student.gender) {
    document.querySelector("#message").textContent = `There is already a ${student.gender} prefect in ${student.house}.`;
    showMessage();
  } else {
    student.prefect = true;
    prefectsArray.push(student);
    document.querySelector("#message").textContent = `${student.firstName} is now a prefect.`;
    showMessage();
  }
}

function showMessage() {
  document.querySelector("#pop-up").classList.remove("hidden");
  document.querySelector("#ok").addEventListener("click", closeSmallPopup);
}

function closeSmallPopup() {
  this.removeEventListener("click", closeSmallPopup);
  document.querySelector("#pop-up").classList.add("hidden");
}

// ADDING MEMBERS OF INQUISITORIAL SQUAD

function addToSquad(student) {
  if (student.bloodStatus === "pure-blood" || student.house === "Slytherin") {
    console.log("adding to squad" + student.firstName);
    student.inqSquad = true;
    document.querySelector("#message").textContent = `${student.firstName} is now a member of Inquisitorial Squad.`;
    showMessage();
    document.querySelector("#add-inq").textContent = "Remove from Inquisitorial Squad";
  } else {
    document.querySelector("#message").textContent = `${student.firstName} cannot be a member of Inquisitorial Squad.`;
    showMessage();
  }
}

function removeFromSquad(student) {
  console.log("removing from squad" + student.firstName);
  student.inqSquad = false;
  document.querySelector("#add-inq").textContent = "Add to Inquisitorial Squad";
  document.querySelector("#message").textContent = `${student.firstName} is no longer a member of Inquisitorial Squad.`;
  showMessage();
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
            filteredArray = prefectsG.concat(prefectsH, prefectsR, prefectsS);
            document.querySelector("h1").textContent = "Prefects";
            break;
          case "inq":
            filteredArray = sortedArray.filter((student) => student.inqSquad === true);
            document.querySelector("h1").textContent = "Members of Inquisitorial Squad";
            break;
          case "girls":
            filteredArray = sortedArray.filter((student) => student.gender === "girl");
            document.querySelector("h1").textContent = "Girls";
            break;
          case "boys":
            filteredArray = sortedArray.filter((student) => student.gender === "boy");
            document.querySelector("h1").textContent = "Boys";
            break;
          case "expelled":
            filteredArray = expelledStudents;
            document.querySelector("h1").textContent = "Expelled students";
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
  document.querySelector("h1").textContent = "All students";
  addData(allStudents);
}

// SEARCHING

document.querySelector("#search").addEventListener("input", getSearch);

function getSearch() {
  console.log("get search");
  const searchInput = this.value;
  if (searchInput != "") {
    const searchString = firstToUppercase(searchInput);
    displaySearch(searchString);
  } else {
    addData(allStudents);
  }
}

function displaySearch(searchString) {
  console.log(searchString);
  const searchResult = [];
  allStudents.forEach((student) => {
    if (student.firstName.includes(searchString) || student.middleName.includes(searchString) || student.lastName.includes(searchString)) {
      searchResult.push(student);
    }
  });
  addData(searchResult);
}

// HACKING THE SYSTEM

function displayHackPopup() {
  document.querySelector("#hack-popup").classList.remove("hidden");
  document.querySelector("#hack").addEventListener("click", hackTheSystem);
  document.querySelector("#no").addEventListener("click", quitHackPopup);
}

function quitHackPopup() {
  document.querySelector("#hack-popup").classList.add("hidden");
}

function hackTheSystem() {
  document.querySelector("#hack").removeEventListener("click", hackTheSystem);
  document.querySelector("#hack-message").textContent = "Wow, it really worked! Sorry, no Firebolt for you. And the system is now hacked.";
  document.querySelector("#hack").textContent = "ok";
  document.querySelector("#hack").addEventListener("click", quitHackPopup);
  document.querySelector("#no").classList.add("hidden");

  // break adding students to inq. squad
  document.querySelector("#add-inq").addEventListener("click", breakInqSquad);

  addMe();
  mixBloodStatus();
}

function addMe() {
  const student = Object.create(Student);
  student.firstName = "Marta";
  student.middleName = "Halina";
  student.lastName = "Nowak";
  student.nickName = "Hackerman";
  allStudents.push(student);
  console.log(student);
}

function mixBloodStatus() {
  const bloodOptions = ["pure-blood", "half-blood", "muggle-born"];
  function randomNumber() {
    return Math.floor(Math.random() * 3);
  }
  allStudents.forEach((student) => {
    if (student.bloodStatus === "pure-blood") {
      student.bloodStatus = bloodOptions[randomNumber()];
    } else {
      student.bloodStatus = "pure-blood";
    }
    console.log(student.bloodStatus);
  });

  addData(allStudents);
}

function breakInqSquad() {
  setTimeout(breakingInqSquadLoop, 1000);
}

function breakingInqSquadLoop() {
  console.log("breakInqSquad");

  allStudents.forEach((student) => {
    if (student.inqSquad === true) {
      console.log("student scheduled for removal");
      setTimeout(removeFromSquadCallback, 5000);
    }
    function removeFromSquadCallback() {
      removeFromSquad(student);
    }
  });
}
