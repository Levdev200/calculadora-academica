// main.js

// State management
const state = {
    currentCalculator: 'semester',
    subjects: [],
    darkMode: false
};

// DOM Elements
const calculatorButtons = document.querySelectorAll('[data-calculator]');
const calculatorContainer = document.getElementById('calculatorContainer');
const addSubjectButton = document.getElementById('addSubject');
const subjectsList = document.getElementById('subjectsList');
const currentAverageSpan = document.getElementById('currentAverage');
const themeToggle = document.getElementById('themeToggle');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
addSubjectButton.addEventListener('click', addNewSubject);
themeToggle.addEventListener('click', toggleTheme);
calculatorButtons.forEach(button => {
    button.addEventListener('click', switchCalculator);
});

// Initialize Application
function initializeApp() {
    loadFromLocalStorage();
    renderSubjects();
    updateAverage();
    initializeCalculator();
    console.log('Inicializando aplicación...'); // Para debugging
}

function initializeCalculator() {
    // Asegurarse que la calculadora de semestre esté visible por defecto
    const semesterCalc = document.getElementById('semesterCalculator');
    if (semesterCalc) {
        semesterCalc.classList.add('active');
    }
    
    // Inicializar el estado si está vacío
    if (!state.subjects) {
        state.subjects = [];
    }
}
// Switch between calculators
function switchCalculator(e) {
    const selectedCalculator = e.target.dataset.calculator;
    
    // Update active button
    calculatorButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.calculator === selectedCalculator) {
            button.classList.add('active');
        }
    });

    // Update state
    state.currentCalculator = selectedCalculator;

    // Save state
    saveToLocalStorage();
}

// Add new subject
function addNewSubject() {
    const newSubject = {
        id: Date.now(),
        name: '',
        grades: [{ weight: 100, value: 0 }]
    };

    state.subjects.push(newSubject);
    renderSubjects();
    saveToLocalStorage();
}

// Render subjects list
function renderSubjects() {
    subjectsList.innerHTML = state.subjects.map(subject => `
        <div class="subject-card bg-gray-50 dark:bg-gray-700 p-4 rounded-lg" data-subject-id="${subject.id}">
            <div class="flex gap-4 mb-4">
                <input type="text" 
                       class="flex-grow p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                       placeholder="Nombre de la materia"
                       value="${subject.name}"
                       onchange="updateSubjectName(${subject.id}, this.value)">
                <button onclick="removeSubject(${subject.id})" 
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    🗑️
                </button>
            </div>
            <div class="grades-list space-y-2">
                ${renderGrades(subject)}
            </div>
            <button onclick="addGrade(${subject.id})"
                    class="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                + Agregar nota
            </button>
        </div>
    `).join('');
}

function renderGrades(subject) {
    return subject.grades.map((grade, index) => `
        <div class="flex gap-2 items-center">
            <input type="number" 
                   class="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                   value="${grade.value}"
                   min="0"
                   max="5"
                   step="0.1"
                   onchange="updateGrade(${subject.id}, ${index}, 'value', this.value)">
            <input type="number" 
                   class="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                   value="${grade.weight}"
                   min="0"
                   max="100"
                   onchange="updateGrade(${subject.id}, ${index}, 'weight', this.value)">
            <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
            ${subject.grades.length > 1 ? `
                <button onclick="removeGrade(${subject.id}, ${index})"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    ✕
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Render grades for a subject
function renderGrades(subject) {
    return subject.grades.map((grade, index) => `
        <div class="flex gap-2 items-center">
            <input type="number" 
                   class="w-20 p-2 border rounded"
                   value="${grade.value}"
                   min="0"
                   max="5"
                   step="0.1"
                   onchange="updateGrade(${subject.id}, ${index}, 'value', this.value)">
            <input type="number" 
                   class="w-20 p-2 border rounded"
                   value="${grade.weight}"
                   min="0"
                   max="100"
                   onchange="updateGrade(${subject.id}, ${index}, 'weight', this.value)">
            <span class="text-sm text-gray-500">%</span>
            ${subject.grades.length > 1 ? `
                <button onclick="removeGrade(${subject.id}, ${index})"
                        class="text-red-600 hover:text-red-800">
                    ✕
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Update functions
function updateSubjectName(subjectId, newName) {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (subject) {
        subject.name = newName;
        saveToLocalStorage();
    }
}

function updateGrade(subjectId, gradeIndex, field, value) {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (subject && subject.grades[gradeIndex]) {
        subject.grades[gradeIndex][field] = Number(value);
        updateAverage();
        saveToLocalStorage();
    }
}

function addGrade(subjectId) {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (subject) {
        subject.grades.push({ weight: 100 / (subject.grades.length + 1), value: 0 });
        subject.grades.forEach(grade => {
            grade.weight = 100 / subject.grades.length;
        });
        renderSubjects();
        saveToLocalStorage();
    }
}

function removeGrade(subjectId, gradeIndex) {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (subject && subject.grades.length > 1) {
        subject.grades.splice(gradeIndex, 1);
        renderSubjects();
        updateAverage();
        saveToLocalStorage();
    }
}

function removeSubject(subjectId) {
    state.subjects = state.subjects.filter(s => s.id !== subjectId);
    renderSubjects();
    updateAverage();
    saveToLocalStorage();
}

// Theme toggle

function toggleTheme() {
    // Toggle dark class on html element
    document.documentElement.classList.toggle('dark');
    
    // Update localStorage
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        // Actualizar el contenido del botón
        themeToggle.innerHTML = '🌙';
    }
    
    // Update state
    state.darkMode = document.documentElement.classList.contains('dark');
}

// Asegurarnos que el evento se añade cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial del botón basada en el tema actual
    if (document.documentElement.classList.contains('dark')) {
        themeToggle.innerHTML = '☀️';
    } else {
        themeToggle.innerHTML = '🌙';
    }
    
    // Agregar el evento click
    themeToggle.addEventListener('click', toggleTheme);
});

// Inicialización del tema al cargar
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggle.innerHTML = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.innerHTML = '🌙';
    }
}

// Llamar a initializeTheme cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeTheme);