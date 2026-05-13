// Main planner logic

let currentPlan = {
    studentName: 'Student',
    schoolName: 'HomeschoolHS',
    graduationYear: new Date().getFullYear() + 4,
    courses: {
        9: [],
        10: [],
        11: [],
        12: []
    }
};

let courseBeingAdded = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadPlan();
    updateUI();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Student info changes
    document.getElementById('studentName').addEventListener('change', function() {
        currentPlan.studentName = this.value;
        updateUI();
    });

    document.getElementById('schoolName').addEventListener('change', function() {
        currentPlan.schoolName = this.value;
        updateUI();
    });

    document.getElementById('graduationYear').addEventListener('change', function() {
        currentPlan.graduationYear = parseInt(this.value);
        updateUI();
    });

    // Course form submission
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCourse();
    });

    // File input for import
    document.getElementById('fileInput').addEventListener('change', function(e) {
        handleFileImport(e);
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active to selected button
    event.target.classList.add('active');
}

// Add course modal
function addCourse(year) {
    courseBeingAdded = year;
    document.getElementById('courseForm').reset();
    document.getElementById('courseModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('courseModal').classList.remove('show');
    courseBeingAdded = null;
}

// Submit course
function submitCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const courseCredits = parseFloat(document.getElementById('courseCredits').value);
    const courseGrade = document.getElementById('courseGrade').value;
    const courseType = document.getElementById('courseType').value;

    if (!courseName || !courseGrade) {
        alert('Please fill in all fields');
        return;
    }

    const course = {
        id: Date.now(),
        name: courseName,
        credits: courseCredits,
        grade: courseGrade,
        type: courseType,
        gpaPoints: getGPAPoints(courseGrade)
    };

    currentPlan.courses[courseBeingAdded].push(course);
    closeModal();
    updateUI();
}

// Delete course
function deleteCourse(year, courseId) {
    currentPlan.courses[year] = currentPlan.courses[year].filter(c => c.id !== courseId);
    updateUI();
}

// Update UI with current plan
function updateUI() {
    // Update student info
    document.getElementById('studentName').value = currentPlan.studentName;
    document.getElementById('schoolName').value = currentPlan.schoolName;
    document.getElementById('graduationYear').value = currentPlan.graduationYear;

    // Update years
    CONFIG.YEARS.forEach(year => {
        renderYear(year.number);
    });

    // Update summary
    updateSummary();
}

// Render a year's courses
function renderYear(year) {
    const coursesList = document.getElementById(`year-${year}`);
    const courses = currentPlan.courses[year] || [];
    
    coursesList.innerHTML = '';
    
    courses.forEach(course => {
        const courseEl = document.createElement('div');
        courseEl.className = 'course-item';
        courseEl.innerHTML = `
            <div class="course-info">
                <div class="course-name">${course.name}</div>
                <div class="course-details">${course.type} • ${course.credits} credits</div>
            </div>
            <span class="course-grade">${course.grade}</span>
            <button class="course-delete" onclick="deleteCourse(${year}, ${course.id})">Delete</button>
        `;
        coursesList.appendChild(courseEl);
    });
}

// Update summary statistics
function updateSummary() {
    let totalCredits = 0;
    let totalGPAPoints = 0;
    let courseCount = 0;
    let gradedCourseCount = 0;

    CONFIG.YEARS.forEach(year => {
        const courses = currentPlan.courses[year.number] || [];
        courses.forEach(course => {
            courseCount++;
            totalCredits += course.credits;
            
            if (course.gpaPoints !== null) {
                totalGPAPoints += course.gpaPoints * course.credits;
                gradedCourseCount += course.credits;
            }
        });
    });

    const gpa = gradedCourseCount > 0 ? totalGPAPoints / gradedCourseCount : 0;

    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
    document.getElementById('overallGPA').textContent = formatGPA(gpa);
    document.getElementById('totalCourses').textContent = courseCount;
}

// Save plan to localStorage
function savePlan() {
    const key = getPlanKey(currentPlan.studentName);
    localStorage.setItem(key, JSON.stringify(currentPlan));
    alert(`✅ Plan saved for ${currentPlan.studentName}`);
}

// Load plan from localStorage
function loadPlan() {
    const students = getSavedStudents();
    if (students.length > 0) {
        const key = getPlanKey(students[0]);
        const saved = localStorage.getItem(key);
        if (saved) {
            currentPlan = JSON.parse(saved);
        }
    }
}

// Export plan as JSON
function exportPlan() {
    const dataStr = JSON.stringify(currentPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPlan.studentName}_plan.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import plan from JSON
function importPlan() {
    document.getElementById('fileInput').click();
}

// Handle file import
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            currentPlan = imported;
            savePlan();
            updateUI();
            alert('✅ Plan imported successfully');
        } catch (error) {
            alert('❌ Error importing plan: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Clear all data
function clearPlan() {
    if (confirm('Are you sure you want to clear all courses? This cannot be undone.')) {
        CONFIG.YEARS.forEach(year => {
            currentPlan.courses[year.number] = [];
        });
        updateUI();
    }
}