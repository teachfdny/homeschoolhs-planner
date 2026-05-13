// Configuration for HomeschoolHS Planner

const CONFIG = {
    // Grading scale for GPA calculation
    GRADES: {
        'A': 4.0,
        'B': 3.0,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0,
        'P': null  // Pass - no GPA weight
    },

    // Course types (can be used for weighting later)
    COURSE_TYPES: ['Regular', 'Honors', 'AP', 'IB'],

    // School years
    YEARS: [
        { number: 9, name: 'Freshman' },
        { number: 10, name: 'Sophomore' },
        { number: 11, name: 'Junior' },
        { number: 12, name: 'Senior' }
    ],

    // Storage keys
    STORAGE_KEY: 'homeschoolhs_plan',

    // Default student
    DEFAULT_STUDENT: {
        name: 'Student',
        school: 'HomeschoolHS',
        graduationYear: new Date().getFullYear() + 4
    }
};

// Helper function to calculate GPA points
function getGPAPoints(grade) {
    return CONFIG.GRADES[grade] || null;
}

// Helper function to format GPA
function formatGPA(gpa) {
    return isNaN(gpa) ? '0.00' : gpa.toFixed(2);
}

// Helper function to get current plan key
function getPlanKey(studentName) {
    return `${CONFIG.STORAGE_KEY}_${sanitizeKey(studentName)}`;
}

// Helper function to sanitize keys
function sanitizeKey(key) {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

// Helper function to get all saved students
function getSavedStudents() {
    const students = [];
    for (let key in localStorage) {
        if (key.startsWith(CONFIG.STORAGE_KEY)) {
            const studentName = key.replace(CONFIG.STORAGE_KEY + '_', '');
            students.push(studentName);
        }
    }
    return students;
}