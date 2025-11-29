// paises-game.js
// Lógica del minijuego País → Capital (modo "Escríbelo")
// Ahora con dificultad + modo de juego (aleatorio / todos)

function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * difficulty: "easy" | "medium" | "hard"
 * mode: "random" | "all"
 */
function createPaisesGame(difficulty, mode) {
  const container = document.getElementById("paisesGameArea");
  container.innerHTML = "";

  // 1. Filtrar por dificultad
  let pool = countries.filter(c => {
    if (difficulty === "easy") return c.nivel === "easy";
    if (difficulty === "medium") return c.nivel === "easy" || c.nivel === "medium";
    if (difficulty === "hard") return c.nivel === "medium" || c.nivel === "hard";
    return true;
  });

  if (pool.length === 0) {
    container.textContent = "No hay datos para esta dificultad.";
    return;
  }

  // 2. Aleatorizar siempre
  pool = shuffle(pool);

  // 3. Según modo, usar todos o solo 10
  if (mode === "random") {
    pool = pool.slice(0, Math.min(10, pool.length));
  }

  let currentIndex = 0;
  let score = 0;

  const header = document.createElement("div");
  header.className = "game-header";

  const qCount = document.createElement("div");

  const tags = document.createElement("div");
  const modeLabel =
    mode === "all" ? "Modo: Todos los países" : "Modo: Aleatorio (10)";
  tags.innerHTML =
    '<span class="tag">País → Capital</span>' +
    '<span class="tag">' + modeLabel + '</span>';

  header.appendChild(qCount);
  header.appendChild(tags);

  // Barra de progreso
  const progressOuter = document.createElement("div");
  progressOuter.className = "progress-outer";
  const progressInner = document.createElement("div");
  progressInner.className = "progress-inner";
  progressOuter.appendChild(progressInner);

  const questionText = document.createElement("div");
  questionText.className = "question-text";

  const controls = document.createElement("div");
  controls.className = "answer-row";

  const feedback = document.createElement("div");
  feedback.className = "feedback";

  const scoreLine = document.createElement("div");
  scoreLine.className = "score-line";

  container.appendChild(header);
  container.appendChild(progressOuter);
  container.appendChild(questionText);
  container.appendChild(controls);
  container.appendChild(feedback);
  container.appendChild(scoreLine);

  function updateProgress() {
    const pct = pool.length
      ? Math.round((currentIndex / pool.length) * 100)
      : 0;
    progressInner.style.width = pct + "%";
  }

  function renderQuestion() {
    if (currentIndex >= pool.length) {
      renderFinal();
      return;
    }

    const q = pool[currentIndex];
    qCount.textContent = "Pregunta " + (currentIndex + 1) + " de " + pool.length;
    feedback.textContent = "";
    feedback.className = "feedback";

    questionText.innerHTML =
      "¿Cuál es la capital de <strong>" + q.pais + "</strong>?";

    controls.innerHTML = "";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Escribe la capital...";

    const btnResponder = document.createElement("button");
    btnResponder.className = "btn btn-primary";
    btnResponder.textContent = "Responder";

    const btnSaltar = document.createElement("button");
    btnSaltar.className = "btn btn-ghost";
    btnSaltar.textContent = "Saltar";

    controls.appendChild(input);
    controls.appendChild(btnResponder);
    controls.appendChild(btnSaltar);

    input.focus();
    scoreLine.textContent = "Aciertos: " + score + " / " + pool.length;
    updateProgress();

    function checkAnswer() {
      const value = normalizeText(input.value);
      if (!value) return;

      const correct = q.capital;

      if (value === normalizeText(correct)) {
        feedback.textContent = "¡Correcto! ✅";
        feedback.className = "feedback correct";
        score++;
      } else {
        feedback.textContent = "Incorrecto. La respuesta correcta es: " + correct + " ❌";
        feedback.className = "feedback incorrect";
      }

      currentIndex++;
      scoreLine.textContent = "Aciertos: " + score + " / " + pool.length;
      setTimeout(renderQuestion, 900);
    }

    btnResponder.addEventListener("click", checkAnswer);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        checkAnswer();
      }
    });

    btnSaltar.addEventListener("click", function () {
      const correct = q.capital;
      feedback.textContent = "Saltaste. La respuesta era: " + correct + ".";
      feedback.className = "feedback incorrect";
      currentIndex++;
      scoreLine.textContent = "Aciertos: " + score + " / " + pool.length;
      setTimeout(renderQuestion, 900);
    });
  }

  function renderFinal() {
    container.innerHTML = "";

    const box = document.createElement("div");
    box.className = "result-box";

    const title = document.createElement("div");
    title.className = "result-title";

    const porcentaje = pool.length ? Math.round((score / pool.length) * 100) : 0;

    if (porcentaje === 100) {
      title.textContent = "¡Perfecto! 🌟";
    } else if (porcentaje >= 70) {
      title.textContent = "¡Muy bien! 💪";
    } else if (porcentaje >= 40) {
      title.textContent = "Buen intento, sigue practicando. 😉";
    } else {
      title.textContent = "Es un buen inicio, vuelve a intentarlo. 📚";
    }

    const detail = document.createElement("div");
    detail.className = "result-score";
    detail.textContent =
      "Puntaje final: " + score + " de " + pool.length + " (" + porcentaje + "%)";

    const buttonsRow = document.createElement("div");
    buttonsRow.className = "btn-row";
    buttonsRow.style.justifyContent = "center";
    buttonsRow.style.marginTop = "8px";
    buttonsRow.style.marginBottom = "4px";

    const btnRepetir = document.createElement("button");
    btnRepetir.className = "btn btn-primary";
    btnRepetir.textContent = "Jugar de nuevo";
    btnRepetir.addEventListener("click", function () {
      createPaisesGame(difficulty, mode);
    });

    const btnMenu = document.createElement("button");
    btnMenu.className = "btn btn-ghost";
    btnMenu.textContent = "Volver al inicio";
    btnMenu.addEventListener("click", function () {
      showStart();
    });

    buttonsRow.appendChild(btnRepetir);
    buttonsRow.appendChild(btnMenu);

    box.appendChild(title);
    box.appendChild(detail);
    box.appendChild(buttonsRow);

    container.appendChild(box);
  }

  renderQuestion();
}
