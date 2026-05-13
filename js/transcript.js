// Transcript generation logic

function generateTranscript() {
    const output = document.getElementById('transcriptOutput');
    
    if (Object.values(currentPlan.courses).every(year => year.length === 0)) {
        output.innerHTML = '<p style="color: #dc3545; text-align: center;">No courses added yet. Please add courses in the Planner tab.</p>';
        return;
    }

    let html = '<div class="transcript">';
    
    // Header
    html += `
        <div class="transcript-header">
            <h1>${currentPlan.schoolName}</h1>
            <p><strong>STUDENT TRANSCRIPT</strong></p>
            <p>Student Name: ${currentPlan.studentName}</p>
            <p>Expected Graduation: ${currentPlan.graduationYear}</p>
            <p>Transcript Generated: ${new Date().toLocaleDateString()}</p>
        </div>
    `;

    // Courses by year
    CONFIG.YEARS.forEach(year => {
        const courses = currentPlan.courses[year.number] || [];
        if (courses.length === 0) return;

        const yearStats = calculateYearStats(courses);

        html += `
            <div class="transcript-section">
                <h3>${year.name} (${year.number}th Grade)</h3>
                <div class="transcript-courses">
                    <div class="transcript-row transcript-header-row">
                        <div class="transcript-cell name">Course Name</div>
                        <div class="transcript-cell credits">Credits</div>
                        <div class="transcript-cell grade">Grade</div>
                        <div class="transcript-cell gpa">GPA Pts</div>
                    </div>
        `;

        courses.forEach(course => {
            const gpaDisplay = course.gpaPoints !== null ? course.gpaPoints.toFixed(1) : 'P';
            html += `
                <div class="transcript-row">
                    <div class="transcript-cell name">${course.name}</div>
                    <div class="transcript-cell credits">${course.credits}</div>
                    <div class="transcript-cell grade">${course.grade}</div>
                    <div class="transcript-cell gpa">${gpaDisplay}</div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="transcript-summary">
                    <div class="transcript-summary-item">
                        Year Credits
                        <strong>${yearStats.credits}</strong>
                    </div>
                    <div class="transcript-summary-item">
                        Year GPA
                        <strong>${yearStats.gpa}</strong>
                    </div>
                </div>
            </div>
        `;
    });

    // Overall summary
    const overallStats = calculateOverallStats();
    html += `
        <div class="transcript-section">
            <h3>Overall Summary</h3>
            <div class="transcript-summary">
                <div class="transcript-summary-item">
                    Total Credits
                    <strong>${overallStats.totalCredits}</strong>
                </div>
                <div class="transcript-summary-item">
                    Cumulative GPA
                    <strong>${overallStats.cumulativeGPA}</strong>
                </div>
                <div class="transcript-summary-item">
                    Total Courses
                    <strong>${overallStats.totalCourses}</strong>
                </div>
            </div>
        </div>
    `;

    html += '</div>';
    output.innerHTML = html;
}

function calculateYearStats(courses) {
    let credits = 0;
    let gpaPoints = 0;
    let gradedCredits = 0;

    courses.forEach(course => {
        credits += course.credits;
        if (course.gpaPoints !== null) {
            gpaPoints += course.gpaPoints * course.credits;
            gradedCredits += course.credits;
        }
    });

    const gpa = gradedCredits > 0 ? gpaPoints / gradedCredits : 0;

    return {
        credits: credits.toFixed(1),
        gpa: formatGPA(gpa)
    };
}

function calculateOverallStats() {
    let totalCredits = 0;
    let totalGPAPoints = 0;
    let totalGradedCredits = 0;
    let totalCourses = 0;

    CONFIG.YEARS.forEach(year => {
        const courses = currentPlan.courses[year.number] || [];
        courses.forEach(course => {
            totalCourses++;
            totalCredits += course.credits;
            if (course.gpaPoints !== null) {
                totalGPAPoints += course.gpaPoints * course.credits;
                totalGradedCredits += course.credits;
            }
        });
    });

    const cumulativeGPA = totalGradedCredits > 0 ? totalGPAPoints / totalGradedCredits : 0;

    return {
        totalCredits: totalCredits.toFixed(1),
        cumulativeGPA: formatGPA(cumulativeGPA),
        totalCourses: totalCourses
    };
}

function printTranscript() {
    if (document.getElementById('transcriptOutput').innerHTML === '') {
        alert('Please generate a transcript first');
        return;
    }
    window.print();
}