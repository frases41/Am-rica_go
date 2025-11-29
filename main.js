// main.js
// Navegación y conexión entre UI y minijuego

// ==== Navegación entre pantallas ====
const startScreen = document.getElementById("startScreen");
const cards = document.querySelectorAll(".card");

function showStart() {
  startScreen.style.display = "flex";
  cards.forEach(card => card.classList.remove("active"));
}

function showCard(id) {
  startScreen.style.display = "none";
  cards.forEach(card => {
    card.classList.toggle("active", card.id === id);
  });
}

// Botón "Iniciar juego" → va a Países
document.getElementById("btnIniciar").addEventListener("click", function () {
  showCard("paisesCard");
});

// Botones "Aprender", "Países", "Capitales" en inicio
document.querySelectorAll("[data-open]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const id = btn.getAttribute("data-open");
    showCard(id);
  });
});

// Botones "Volver al inicio"
document.querySelectorAll("[data-back]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    showStart();
  });
});

// ==== Selector de dificultad para Países → Capitales ====
const diffButtons = document.querySelectorAll("#paisesDifficulty .pill-btn");
const modeButtons = document.querySelectorAll("#paisesMode .pill-btn");
const paisesSummary = document.getElementById("paisesSummary");

let selectedDifficulty = null;
let selectedMode = null;

diffButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDifficulty = btn.dataset.difficulty;
    updateSummary();
  });
});

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMode = btn.dataset.mode;
    updateSummary();
  });
});

function updateSummary() {
  let diffLabel = "";
  if (selectedDifficulty === "easy") diffLabel = "Fácil";
  else if (selectedDifficulty === "medium") diffLabel = "Intermedio";
  else if (selectedDifficulty === "hard") diffLabel = "Difícil";

  let modeLabel = "";
  if (selectedMode === "random") modeLabel = "Aleatorio (10 preguntas)";
  else if (selectedMode === "all") modeLabel = "Todos los países";

  if (!selectedDifficulty && !selectedMode) {
    paisesSummary.innerHTML =
      'Selecciona dificultad y modo, luego pulsa en <strong>"Empezar minijuego"</strong>.';
  } else if (selectedDifficulty && !selectedMode) {
    paisesSummary.textContent =
      "Dificultad seleccionada: " + diffLabel + ". Ahora elige un modo de juego.";
  } else if (!selectedDifficulty && selectedMode) {
    paisesSummary.textContent =
      "Modo seleccionado: " + modeLabel + ". Ahora elige una dificultad.";
  } else {
    paisesSummary.textContent =
      "Dificultad: " + diffLabel + " · Modo: " + modeLabel + ". Listo, pulsa en \"Empezar minijuego\".";
  }
}

// ==== Botón que inicia el minijuego País → Capital ====
document.getElementById("startPaisesGame").addEventListener("click", function () {
  if (!selectedDifficulty && !selectedMode) {
    alert("Primero elige dificultad y modo de juego.");
    return;
  }
  if (!selectedDifficulty) {
    alert("Primero elige una dificultad.");
    return;
  }
  if (!selectedMode) {
    alert("Primero elige un modo de juego.");
    return;
  }

  createPaisesGame(selectedDifficulty, selectedMode);
});
