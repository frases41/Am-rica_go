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
const paisesSummary = document.getElementById("paisesSummary");
let selectedDifficulty = null;

diffButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDifficulty = btn.dataset.difficulty;

    let label = "";
    if (selectedDifficulty === "easy") label = "Fácil";
    else if (selectedDifficulty === "medium") label = "Intermedio";
    else if (selectedDifficulty === "hard") label = "Difícil";

    paisesSummary.textContent =
      'Dificultad seleccionada: ' + label + '. Ahora pulsa "Empezar minijuego".';
  });
});

// ==== Botón que inicia el minijuego País → Capital ====
document.getElementById("startPaisesGame").addEventListener("click", function () {
  if (!selectedDifficulty) {
    alert("Primero elige una dificultad.");
    return;
  }
  createPaisesGame(selectedDifficulty);
});