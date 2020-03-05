//Exercise Class: Represnts a Exercise
class Exercise {
  constructor(exerciseN, reps, sets, weight) {
    this.exerciseN = exerciseN;
    this.reps = reps;
    this.sets = sets;
    this.weight = weight;
  }
}

//UI Class: Handle UI Tasks
class UI {
  static displayExercises() {
    const exercises = Store.getExercises();
    exercises.forEach(exercise => UI.addExerciseToList(exercise));
  }

  static addExerciseToList(exercise) {
    const list = document.querySelector("#exercise-list");
    const row = document.createElement("tr");

    //Changes weight units to either LB or KG
    const units = document.querySelector(".active").textContent;

    row.innerHTML = `
    <td>${exercise.exerciseN}</td>
    <td>${exercise.reps}x${exercise.sets}</td>
    <td>${exercise.weight}${units}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#exerciseN").value = "";
    document.querySelector("#reps").value = "";
    document.querySelector("#sets").value = "";
    document.querySelector("#weight").value = "";
  }

  static deleteExercise(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#exercise-form");
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

//Store Class: Handles Storage
class Store {
  static getExercises() {
    let exercises;
    if (localStorage.getItem("exercises") === null) {
      exercises = [];
    } else {
      exercises = JSON.parse(localStorage.getItem("exercises"));
    }
    return exercises;
  }

  static addExercise(exercise) {
    const exercises = Store.getExercises();
    exercises.push(exercise);
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }

  static removeExercise(exerciseN) {
    const exercises = Store.getExercises();
    exercises.forEach((exercise, index) => {
      if (exercise.exerciseN === exerciseN) {
        exercises.splice(index, 1);
      }
    });

    localStorage.setItem("exercises", JSON.stringify(exercises));
  }

  static changeExerciseUnits() {
    if ((units = "LB (pound)")) {
      localStorage.setItem("weight", "LB");
    }
  }
}

// Event: Display exercises
document.addEventListener("DOMContentLoaded", UI.displayExercises);

// Event: Add a exercise
document.querySelector("#exercise-form").addEventListener("submit", e => {
  e.preventDefault();

  const exerciseN = document.querySelector("#exerciseN").value;
  const reps = document.querySelector("#reps").value;
  const sets = document.querySelector("#sets").value;
  const weight = document.querySelector("#weight").value;

  // Validate
  if (exerciseN === "" || reps === "" || sets === "" || weight === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate exercise
    const exercise = new Exercise(exerciseN, reps, sets, weight);

    // Add exercise to UI
    UI.addExerciseToList(exercise);

    // Add exercise to store (local storage)
    Store.addExercise(exercise);

    //Show Success message
    UI.showAlert("Exercise Added", "success");

    // Clear Fields
    UI.clearFields();
  }
});

// Event: Remove a Exercise
document.querySelector("#exercise-list").addEventListener("click", e => {
  // Remove exercise from UI
  UI.deleteExercise(e.target);

  // Remove exercise from store
  Store.removeExercise(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );

  //Show Removed Exercise Message
  UI.showAlert("Exercise Removed", "success");
});
