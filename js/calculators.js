// calculators.js

function updateAverage() {
    let totalWeightedGrade = 0;
    let totalSubjects = state.subjects.length;
    
    state.subjects.forEach(subject => {
        let subjectGrade = 0;
        let totalWeight = 0;
        
        subject.grades.forEach(grade => {
            subjectGrade += (grade.value * grade.weight);
            totalWeight += Number(grade.weight);
        });
        
        if (totalWeight > 0) {
            totalWeightedGrade += (subjectGrade / totalWeight);
        }
    });

    const average = totalSubjects > 0 ? 
        (totalWeightedGrade / totalSubjects).toFixed(2) : 
        '0.00';
    
    currentAverageSpan.textContent = average;
}
// Calculadora de nota necesaria.

// Estado inicial.
const RequiredCalcState = {
    grades: []
};
const gradesList = document.getElementById('requiredGrades-list'); // Asegúrate de tener este elemento en tu HTML

// Función para renderizar las notas
function renderGradesRequired() {
    gradesList.innerHTML = RequiredCalcState.grades.map((grade, index) => `
        <div class="flex gap-2 items-center">
            <input type="number" 
                   class="w-20 p-2 border rounded notes"
                   value="${grade.value}"
                   min="0"
                   max="5"
                   step="0.1"
                   onchange="updatenote(${index}, 'value', this.value)">
            <input type="number" 
                   class="w-20 p-2 border rounded weight"
                   value="${grade.weight}"
                   min="0"
                   max="100"
                   onchange="updatenote(${index}, 'weight', this.value)">
            <span class="text-sm text-gray-500">%</span>
            ${RequiredCalcState.grades.length > 1 ? `
                <button onclick="removeGradetorequired(${index})"
                        class="text-red-600 hover:text-red-800">
                    ✕
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Función para agregar una nueva nota
function addGradetorequired() {
    const newGrade = { value: 0, weight: 0 };
    RequiredCalcState.grades.push(newGrade);
    renderGradesRequired();
    saverequired(); // Guardar después de agregar
}

// Función para eliminar una nota
function removeGradetorequired(index) {
    if (RequiredCalcState.grades.length > 1) {
        RequiredCalcState.grades.splice(index, 1);
        renderGradesRequired();
        saverequired(); // Guardar después de eliminar
    }
}

// Función para actualizar el valor o peso de una nota
function updatenote(index, key, value) {
    RequiredCalcState.grades[index][key] = parseFloat(value);
    saverequired(); // Guardar después de actualizar
}

// Inicializa el renderizado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadrequired(); // Cargar estado guardado
    renderGradesRequired(); // Renderiza inicialmente si hay notas guardadas
});

// Enlaza el botón "Agregar Nota" a la función addGrade
document.getElementById('add-grade-button').addEventListener('click', addGradetorequired); // Asegúrate de tener este botón en tu HTML

// Ejemplo de cómo guardar en localStorage si es necesario
function saverequired() {
    localStorage.setItem('RequiredCalcState', JSON.stringify(RequiredCalcState));
}

// Cargar desde localStorage
function loadrequired() {
    const savedState = localStorage.getItem('RequiredCalcState');
    if (savedState) {
        Object.assign(RequiredCalcState, JSON.parse(savedState));
    }
}

// Función para calcular la nota necesaria
function CalculateRequired() {
  let notes = document.querySelectorAll(".notes");
  let weights = document.querySelectorAll(".weight");
  let targetNote = parseFloat(document.getElementById("desiredGrade").value);
  const requiredcontainer = document.getElementById('requiredGrade');

  let totalWeightedGrades = 0;
  let totalWeight = 0;

  // Sumar las notas y los pesos
  notes.forEach((gradeInput, index) => {
    const gradeValue = parseFloat(gradeInput.value) || 0; // Valor de la nota
    const weightValue = parseFloat(weights[index].value) || 0; // Peso de la nota
    totalWeightedGrades += gradeValue * (weightValue / 100); // Sumar las notas ponderadas
    totalWeight += weightValue; // Sumar los pesos
  });

  // Calcular el peso restante que necesita la nueva nota
  const remainingWeight = 100 - totalWeight;

  if (remainingWeight <= 0) {
    document.getElementById("result").innerText =
      "Ya has alcanzado o superado el peso total.";
    return;
  }

  // Calcular la nota necesaria
  const requiredGrade =
    ((targetNote - totalWeightedGrades) * 100) / remainingWeight;

  // Mostrar el resultado
  if (requiredGrade < 0) {
    requiredcontainer.innerText = "No necesitas ninguna nota adicional para alcanzar tu objetivo.";
  } else if (requiredGrade > 5) {
    requiredcontainer.innerText = "Necesitas más de 5 para alcanzar tu objetivo, lo cual no es posible.";
  } else {
    requiredcontainer.innerText = `${requiredGrade.toFixed(2)}`;
  }
}

const calculateButton = document.getElementById('Calculate-required');
calculateButton.addEventListener('click', CalculateRequired);
