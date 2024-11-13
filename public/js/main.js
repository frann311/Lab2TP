const d = document;

// INICIALIZACIONES

var quill = new Quill(".editor", {
  theme: "snow",
  placeholder: "Escribe aquí...",
  modules: {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"]],
  },
});

var quill2 = new Quill(".editor2", {
  theme: "snow",
  placeholder: "Escribe aquí...",
  modules: {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"]],
  },
});

var quill3 = new Quill(".editor3", {
  theme: "snow",
  placeholder: "Escribe aquí...",
  modules: {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"]],
  },
});
var quill4 = new Quill(".editor4", {
  theme: "snow",
  placeholder: "Escribe aquí...",
  modules: {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"]],
  },
});
// ATENCION PACIENTE MENU

const $inputs = d.querySelectorAll(".inputs");

d.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn_atencion")) {
    const btnName = e.target.getAttribute("data-textarea");

    $inputs.forEach((input) => {
      const inputType = input.getAttribute("data-type");

      if (inputType === btnName) {
        input.classList.remove("none");
      } else {
        input.classList.add("none");
      }
    });
  }
});

// ATENCION PACIENTE FORM
const $from = d.getElementById("atencion-form");
const prueba = d.querySelector(".prueba");
d.addEventListener("click", (e) => {
  if (e.target.classList.contains("submit-button")) {
    const $taEvoluciones = d.getElementById("Ievolucion"),
      $taDiagnostico = d.getElementById("Idiagnostico"),
      $diagnosticoBtn = document.querySelector('[data-textarea="diagnostico"]'),
      $evolucionBtn = document.querySelector('[data-textarea="evolucion"]'),
      quillContent = quill.root.innerHTML;

    $taEvoluciones.value = quill.getText();
    let isValid = true;

    // CONTROLAR DIAGNOSTICO Y EVOLUCIONES
    if ($taDiagnostico.value.trim() === "") {
      e.preventDefault();
      $diagnosticoBtn.classList.add("err");
      isValid = false;
    } else {
      $diagnosticoBtn.classList.remove("err");
    }

    if ($taEvoluciones.value.trim() === "") {
      e.preventDefault();
      $evolucionBtn.classList.add("err");
      isValid = false;
    } else {
      $taEvoluciones.value = quillContent;
      $evolucionBtn.classList.remove("err");
    }

    // CONTROLAR FECHAS
    const textareas = {
      antecedentes: {
        text: d.getElementById("Iantecedentes"),
        inicio: d.getElementById("antecedentesInicio"),
        final: d.getElementById("antecedentesFinal"),
        name: d.querySelector('[name = "antecedentes"]').name,
      },
      habitos: {
        text: d.getElementById("Ihabitos"),
        inicio: d.getElementById("habitosInicio"),
        final: d.getElementById("habitosFinal"),
        name: d.querySelector('[name = "habitos"]').name,
      },
      medicamentos: {
        text: d.getElementById("Imedicamentos"),
        inicio: d.getElementById("medicamentosInicio"),
        final: d.getElementById("medicamentosFinal"),
        name: d.querySelector('[name = "medicamentos"]').name,
      },
    };

    Object.values(textareas).forEach(({ text, inicio, final, name }) => {
      const hasText = text.value.trim() !== "";
      const hasBothDates =
        inicio.value.trim() !== "" && final.value.trim() !== "";
      const datesAreValid = inicio.value < final.value;
      const hasOneBoth =
        (inicio.value.trim() !== "" && final.value.trim() === "") ||
        (inicio.value.trim() === "" && final.value.trim() !== "");

      // Condición para agregar o quitar clase de error
      if (
        (hasText && !hasBothDates) ||
        (hasBothDates && !datesAreValid) ||
        (hasBothDates && !hasText) ||
        hasOneBoth
      ) {
        d.querySelector(`[data-textarea=${name}]`).classList.add("err");
        e.preventDefault();
        isValid = false;
      } else {
        d.querySelector(`[data-textarea=${name}]`).classList.remove("err");
      }
    });

    // CONTROLAR ALERGIAS Y ESTADOS
    const $alergiasSelect = d.getElementById("alergias"),
      $alergiasEstadoSelect = d.getElementById("alergiasEstado"),
      $alergiasInicio = d.getElementById("alergiasInicio"),
      $alergiasFinal = d.getElementById("alergiasFinal");
    const alergiaSeleccionada = $alergiasSelect.value.trim() !== "";
    const estadoSeleccionado = $alergiasEstadoSelect.value.trim() !== "";
    const hasDateAlergias =
        $alergiasInicio.value.trim() !== "" &&
        $alergiasFinal.value.trim() !== "",
      dateAlergiasAreValid = $alergiasInicio.value < $alergiasFinal.value,
      hasOneDateAlergias =
        ($alergiasInicio.value.trim() !== "" &&
          $alergiasFinal.value.trim() === "") ||
        ($alergiasInicio.value.trim() === "" &&
          $alergiasFinal.value.trim() !== "");

    if (
      (!alergiaSeleccionada && estadoSeleccionado) ||
      (alergiaSeleccionada && !estadoSeleccionado) ||
      (hasDateAlergias && !alergiaSeleccionada) ||
      (!dateAlergiasAreValid && alergiaSeleccionada) ||
      hasOneDateAlergias
    ) {
      e.preventDefault();
      d.querySelector(`[data-textarea=alergias]`).classList.add("err");
      console.log("errror");
      isValid = false;
    } else {
      d.querySelector(`[data-textarea=alergias]`).classList.remove("err");
    }

    if (isValid) {
      console.log("Formulario válido, se enviará.");
      $from.submit();
    } else {
      e.preventDefault();
      console.log("Formulario inválido, no se enviará.");
    }
  }
});

// CARGAR PLANTILLAS

const $plantillas = d.getElementById("evolucionEstado");

d.addEventListener("change", (e) => {
  if (e.target.matches("#evolucionEstado")) {
    quill.root.innerHTML = $plantillas.value;
  }
});

// CONTROLAR PLANTILLAS FORM

d.addEventListener("click", (e) => {
  if (!e.target.matches("#btn-plantilla")) return;

  const $textPlantillas = d.getElementById("text_plantilla");
  let isValid = false;

  $textPlantillas.value = quill2.getText();

  if ($textPlantillas.value === "") {
    isValid = false;
  } else {
    isValid = true;
    $textPlantillas.value = quill2.root.innerHTML;
  }

  if (isValid) {
    submit();
  } else {
    e.preventDefault();
  }
});

// CONTROLAR PLANTILLAS EDIT FORM
d.addEventListener("DOMContentLoaded", (e) => {
  const mainElement = d.querySelector("main.container");
  const vista = mainElement?.getAttribute("data-vista");
  if (vista !== "plantillas-edit") return;

  const $tplantilla = d.getElementById("text_plantilla-edit");

  quill4.root.innerHTML = $tplantilla.value;
});

d.addEventListener("click", (e) => {
  if (!e.target.matches("#btn-plantilla-edit")) return;

  const $textPlantillas = d.getElementById("text_plantilla-edit");
  let isValid = false;

  $textPlantillas.value = quill4.getText();

  if ($textPlantillas.value === "") {
    isValid = false;
  } else {
    isValid = true;
    $textPlantillas.value = quill4.root.innerHTML;
  }

  if (isValid) {
    submit();
  } else {
    e.preventDefault();
  }
});

// CONTROLAR TURNOS FORM

d.addEventListener("click", (e) => {
  if (!e.target.matches("#btn-turnos")) return;

  const $fecha = d.getElementById("date_turno"),
    $formTurnos = d.getElementById("form-pacientes");

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  let isValid = false;

  if ($fecha.value >= formattedDate) {
    isValid = true;
  }
  console.log("dateTurno", $fecha.value);
  console.log("dateNow", formattedDate);

  if (isValid) {
    $formTurnos.submit();
  } else {
    e.preventDefault();
    alert("La fecha debe ser posterior a hoy.");
  }
});

// CONTROLAR HISTORIAL
d.addEventListener("DOMContentLoaded", (e) => {
  const mainElement = d.querySelector("main.container");
  const vista = mainElement?.getAttribute("data-vista");
  if (vista !== "historia-clinica") return;

  const $tEvolucion = d.getElementById("Ievolucion");
  console.log($tEvolucion);
  console.log(typeof $tEvolucion.value);

  quill3.root.innerHTML = $tEvolucion.value;
});
