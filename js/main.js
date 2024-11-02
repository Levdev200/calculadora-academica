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
        <div class="subject-card bg-gray-50 p-4 rounded-lg" data-subject-id="${subject.id}">
            <div class="flex gap-4 mb-4">
                <input type="text" 
                       class="flex-grow p-2 border rounded"
                       placeholder="Nombre de la materia"
                       value="${subject.name}"
                       onchange="updateSubjectName(${subject.id}, this.value)">
                <button onclick="removeSubject(${subject.id})" 
                        class="text-red-600 hover:text-red-800">
                    🗑️
                </button>
            </div>
            <div class="grades-list space-y-2">
                ${renderGrades(subject)}
            </div>
            <button onclick="addGrade(${subject.id})"
                    class="mt-2 text-blue-600 hover:text-blue-800">
                + Agregar nota
            </button>
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
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    saveToLocalStorage();
}