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