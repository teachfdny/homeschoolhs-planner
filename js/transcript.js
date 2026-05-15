// ============================================================
//  TRANSCRIPT GENERATOR — drop-in replacement for your existing
//  generateTranscript(), calculateYearStats(), calculateOverallStats()
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

    const overallStats = calculateOverallStats();
    const today        = new Date();
    const issuedDate   = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // ── School address comes from currentPlan; fall back to placeholder ──
    const schoolAddress = currentPlan.schoolAddress || '&lt;School Address&gt;';
    const schoolPhone   = currentPlan.schoolPhone   || '&lt;Phone / Email&gt;';
    const studentDOB    = currentPlan.studentDOB    || '';
    const studentID     = currentPlan.studentID     || '';

    let html = `
    <div class="pro-transcript">

        <!-- ══ LETTERHEAD ══════════════════════════════════════ -->
        <header class="pt-header">
            <div class="pt-school-block">
                <div class="pt-school-name">${currentPlan.schoolName || 'School Name'}</div>
                <div class="pt-school-meta">${schoolAddress}</div>
                <div class="pt-school-meta">${schoolPhone}</div>
            </div>
            <div class="pt-title-block">
                <div class="pt-doc-title">OFFICIAL ACADEMIC TRANSCRIPT</div>
                <div class="pt-doc-subtitle">High School Record</div>
            </div>
        </header>

        <!-- ══ STUDENT INFO ROW ════════════════════════════════ -->
        <section class="pt-student-row">
            <table class="pt-info-table">
                <tbody>
                    <tr>
                        <td class="pt-info-label">Student Name</td>
                        <td class="pt-info-value">${currentPlan.studentName || ''}</td>
                        <td class="pt-info-label">Graduation Year</td>
                        <td class="pt-info-value">${currentPlan.graduationYear || ''}</td>
                        <td class="pt-info-label">Date Issued</td>
                        <td class="pt-info-value">${issuedDate}</td>
                    </tr>
                    <tr>
                        <td class="pt-info-label">Date of Birth</td>
                        <td class="pt-info-value">${studentDOB || '________________'}</td>
                        <td class="pt-info-label">Student ID</td>
                        <td class="pt-info-value">${studentID || '________________'}</td>
                        <td class="pt-info-label">Cumulative GPA</td>
                        <td class="pt-info-value pt-gpa-highlight">${overallStats.cumulativeGPA}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- ══ YEAR SECTIONS ═══════════════════════════════════ -->
    `;

    CONFIG.YEARS.forEach(year => {
        const courses = currentPlan.courses[year.number] || [];
        if (courses.length === 0) return;

        const yearStats = calculateYearStats(courses);

        html += `
        <section class="pt-year-section">
            <div class="pt-year-header">
                <span class="pt-year-title">${year.name}</span>
                <span class="pt-year-stats">Credits: ${yearStats.credits} &nbsp;|&nbsp; GPA: ${yearStats.gpa}</span>
            </div>

            <table class="pt-course-table">
                <thead>
                    <tr>
                        <th class="col-course">Course Title</th>
                        <th class="col-type">Level</th>
                        <th class="col-sem">Sem.</th>
                        <th class="col-credits">Credits</th>
                        <th class="col-grade">Grade</th>
                        <th class="col-gpapts">Grade Points</th>
                    </tr>
                </thead>
                <tbody>
        `;

        courses.forEach(course => {
            const gpaDisplay = course.gpaPoints !== null
                ? course.gpaPoints.toFixed(1)
                : 'P/F';

            html += `
                    <tr>
                        <td class="col-course">${course.name}</td>
                        <td class="col-type">${course.type || 'Regular'}</td>
                        <td class="col-sem">${course.semester || '—'}</td>
                        <td class="col-credits">${course.credits}</td>
                        <td class="col-grade">${course.grade}</td>
                        <td class="col-gpapts">${gpaDisplay}</td>
                    </tr>`;
        });

        html += `
                </tbody>
                <tfoot>
                    <tr class="pt-year-foot">
                        <td colspan="3">Year Totals</td>
                        <td>${yearStats.credits}</td>
                        <td></td>
                        <td>GPA: ${yearStats.gpa}</td>
                    </tr>
                </tfoot>
            </table>
        </section>`;
    });

    // ── GRADING SCALE ───────────────────────────────────────
    html += `
        <section class="pt-grading-scale">
            <div class="pt-scale-title">Grading Scale &amp; GPA Weights</div>
            <table class="pt-scale-table">
                <thead>
                    <tr>
                        <th>Grade</th><th>Range</th><th>Regular</th><th>Honors</th><th>AP / Dual Enroll</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>A</td><td>90–100</td><td>4.0</td><td>4.5</td><td>5.0</td></tr>
                    <tr><td>B</td><td>80–89</td><td>3.0</td><td>3.5</td><td>4.0</td></tr>
                    <tr><td>C</td><td>70–79</td><td>2.0</td><td>2.5</td><td>3.0</td></tr>
                    <tr><td>D</td><td>60–69</td><td>1.0</td><td>1.5</td><td>2.0</td></tr>
                    <tr><td>F</td><td>0–59</td><td>0.0</td><td>0.0</td><td>0.0</td></tr>
                    <tr><td>P</td><td>Pass</td><td colspan="3">Not included in GPA calculation</td></tr>
                </tbody>
            </table>
        </section>

        <!-- ══ ACADEMIC SUMMARY ════════════════════════════════ -->
        <section class="pt-summary">
            <table class="pt-summary-table">
                <thead>
                    <tr>
                        <th>Total Courses</th>
                        <th>Total Credits Earned</th>
                        <th>Cumulative GPA</th>
                        <th>Expected Graduation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${overallStats.totalCourses}</td>
                        <td>${overallStats.totalCredits}</td>
                        <td><strong>${overallStats.cumulativeGPA}</strong></td>
                        <td>${currentPlan.graduationYear || '________'}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- ══ SIGNATURE BLOCK ════════════════════════════════ -->
        <section class="pt-signature-block">
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">School Administrator / Parent-Educator Signature</div>
            </div>
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">Title &amp; Date</div>
            </div>
            <div class="pt-sig-col">
                <div class="pt-sig-line"></div>
                <div class="pt-sig-label">Contact Phone / Email</div>
            </div>
        </section>

        <footer class="pt-footer">
            <p>This transcript is an official record of ${currentPlan.studentName || 'the student'}'s
            academic work completed under the supervision of ${currentPlan.schoolName || 'the above institution'}.
            Issued ${issuedDate}. Unaltered copies may be reproduced for admissions purposes.</p>
        </footer>

    </div><!-- /pro-transcript -->
    `;

    output.innerHTML = html;
}


// ── Stat helpers (unchanged logic, same API) ──────────────────

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
                totalGPAPoints      += course.gpaPoints * course.credits;
                totalGradedCredits  += course.credits;
            }
        });
    });
    const cumulativeGPA = totalGradedCredits > 0 ? totalGPAPoints / totalGradedCredits : 0;
    return {
        totalCredits:   totalCredits.toFixed(1),
        cumulativeGPA:  formatGPA(cumulativeGPA),
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
