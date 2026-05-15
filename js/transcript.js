// ============================================================
//  TRANSCRIPT GENERATOR — 2-up layout matching reference design
// ============================================================

function generateTranscript() {
    const output = document.getElementById('transcriptOutput');

    if (Object.values(currentPlan.courses).every(year => year.length === 0)) {
        output.innerHTML = `
            <div class="empty-transcript">
                <h3>No Courses Added</h3>
                <p>Please add courses in the Planner tab first.</p>
            </div>`;
        return;
    }

    const overallStats  = calculateOverallStats();
    const today         = new Date();
    const issuedDate    = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const schoolAddress = currentPlan.schoolAddress || '';
    const schoolPhone   = currentPlan.schoolPhone   || '';
    const studentDOB    = currentPlan.studentDOB    || '________________';
    const studentID     = currentPlan.studentID     || '________________';

    // ── Helper: build one year panel (left or right) ──────────
    function buildYearPanel(yearObj) {
        const courses = currentPlan.courses[yearObj.number] || [];
        if (courses.length === 0) return '<div class="pt-year-panel pt-year-empty"></div>';

        const stats = calculateYearStats(courses);

        // Derive school-year label from graduation year + grade offset
        const gradeOffset = { 1: 3, 2: 2, 3: 1, 4: 0 };
        const offset      = gradeOffset[yearObj.number] ?? 0;
        const startYear   = (parseInt(currentPlan.graduationYear) || 2025) - offset;
        const yearLabel   = `${startYear} \u2013 ${startYear + 1}`;

        let rows = '';
        courses.forEach(course => {
            rows += `
                <tr>
                    <td class="pt-col-name">${course.name}</td>
                    <td class="pt-col-credits">${course.credits}</td>
                    <td class="pt-col-grade">${course.grade}</td>
                </tr>`;
        });

        return `
            <div class="pt-year-panel">
                <table class="pt-year-table">
                    <thead>
                        <tr class="pt-year-header-row">
                            <th class="pt-yh-name">${yearObj.name}</th>
                            <th class="pt-yh-year" colspan="2">${yearLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr class="pt-year-totals">
                            <td class="pt-col-name">Year Total &mdash; GPA: ${stats.gpa}</td>
                            <td class="pt-col-credits">${stats.credits}</td>
                            <td class="pt-col-grade"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>`;
    }

    // ── Pair years: [9+10], [11+12] ───────────────────────────
    const years = CONFIG.YEARS;
    const pair1 = `
        <div class="pt-row">
            ${buildYearPanel(years[0])}
            ${buildYearPanel(years[1])}
        </div>`;
    const pair2 = `
        <div class="pt-row">
            ${buildYearPanel(years[2])}
            ${buildYearPanel(years[3])}
        </div>`;

    let html = `
    <div class="pro-transcript">

        <!-- LETTERHEAD -->
        <div class="pt-letterhead">
            <div class="pt-school-name">${currentPlan.schoolName || 'School Name'}</div>
            <div class="pt-school-meta">${[schoolAddress, schoolPhone].filter(Boolean).join(' &nbsp;&bull;&nbsp; ')}</div>
        </div>

        <!-- STUDENT META -->
        <table class="pt-meta-table">
            <tbody>
                <tr>
                    <td class="pt-meta-label">Student</td>
                    <td class="pt-meta-value">${currentPlan.studentName || ''}</td>
                    <td class="pt-meta-label">DOB</td>
                    <td class="pt-meta-value">${studentDOB}</td>
                    <td class="pt-meta-label">ID</td>
                    <td class="pt-meta-value">${studentID}</td>
                    <td class="pt-meta-label">Grad. Year</td>
                    <td class="pt-meta-value">${currentPlan.graduationYear || ''}</td>
                    <td class="pt-meta-label">Cum. GPA</td>
                    <td class="pt-meta-value pt-meta-gpa">${overallStats.cumulativeGPA}</td>
                    <td class="pt-meta-label">Credits</td>
                    <td class="pt-meta-value">${overallStats.totalCredits}</td>
                </tr>
            </tbody>
        </table>

        <!-- ACADEMIC RECORD TITLE -->
        <div class="pt-record-title">Academic Record</div>

        <!-- SHARED COLUMN HEADERS -->
        <div class="pt-col-labels">
            <div class="pt-col-label-set">
                <span class="pt-cl-name">Course Title</span>
                <span class="pt-cl-credits">Credits</span>
                <span class="pt-cl-grade">Final Grade</span>
            </div>
            <div class="pt-col-label-divider"></div>
            <div class="pt-col-label-set">
                <span class="pt-cl-name">Course Title</span>
                <span class="pt-cl-credits">Credits</span>
                <span class="pt-cl-grade">Final Grade</span>
            </div>
        </div>

        <!-- YEAR PAIRS -->
        ${pair1}
        ${pair2}

        <!-- GRADING SCALE -->
        <div class="pt-scale-bar">
            <strong>Grading Scale:</strong>
            A&nbsp;=&nbsp;90–100 &nbsp;|&nbsp; B&nbsp;=&nbsp;80–89 &nbsp;|&nbsp; C&nbsp;=&nbsp;70–79 &nbsp;|&nbsp; D&nbsp;=&nbsp;60–69 &nbsp;|&nbsp; F&nbsp;=&nbsp;0–59 &nbsp;|&nbsp; P&nbsp;=&nbsp;Pass (not calculated in GPA)
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            <strong>GPA Weights:</strong> Regular&nbsp;4.0 &nbsp;|&nbsp; Honors&nbsp;4.5 &nbsp;|&nbsp; AP/Dual Enrollment&nbsp;5.0
        </div>

        <!-- SIGNATURE BLOCK -->
        <div class="pt-signature-block">
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">Administrator / Parent-Educator Signature</div>
            </div>
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">Title &amp; Date</div>
            </div>
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">Contact Phone / Email</div>
            </div>
        </div>

        <div class="pt-doc-footer">
            Official transcript of ${currentPlan.studentName || 'student'} &mdash; ${currentPlan.schoolName || ''} &mdash; Issued ${issuedDate}
        </div>

    </div>`;

    output.innerHTML = html;
}


// ── Stat helpers ──────────────────────────────────────────────

function calculateYearStats(courses) {
    let credits = 0, gpaPoints = 0, gradedCredits = 0;
    courses.forEach(course => {
        credits += course.credits;
        if (course.gpaPoints !== null) {
            gpaPoints     += course.gpaPoints * course.credits;
            gradedCredits += course.credits;
        }
    });
    const gpa = gradedCredits > 0 ? gpaPoints / gradedCredits : 0;
    return { credits: credits.toFixed(1), gpa: formatGPA(gpa) };
}

function calculateOverallStats() {
    let totalCredits = 0, totalGPAPoints = 0, totalGradedCredits = 0, totalCourses = 0;
    CONFIG.YEARS.forEach(year => {
        const courses = currentPlan.courses[year.number] || [];
        courses.forEach(course => {
            totalCourses++;
            totalCredits += course.credits;
            if (course.gpaPoints !== null) {
                totalGPAPoints     += course.gpaPoints * course.credits;
                totalGradedCredits += course.credits;
            }
        });
    });
    const cumulativeGPA = totalGradedCredits > 0 ? totalGPAPoints / totalGradedCredits : 0;
    return {
        totalCredits:  totalCredits.toFixed(1),
        cumulativeGPA: formatGPA(cumulativeGPA),
        totalCourses
    };
}

function printTranscript() {
    if (!document.querySelector('.pro-transcript')) {
        alert('Please generate a transcript first.');
        return;
    }
    window.print();
}
