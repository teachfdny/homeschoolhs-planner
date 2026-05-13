# HomeschoolHS Planner - Setup Guide

## Quick Start (5 minutes)

### Option 1: Use Locally
1. Clone the repository: `git clone https://github.com/teachfdny/homeschoolhs-planner.git`
2. Open `index.html` in your web browser
3. Start adding courses!

### Option 2: Deploy to GitHub Pages (Free)
1. Go to your repository settings
2. Scroll to "Pages" section
3. Under "Build and deployment", select:
   - Source: Deploy from a branch
   - Branch: main
4. Click Save
5. Your site will be live at: `https://teachfdny.github.io/homeschoolhs-planner/`

### Option 3: Deploy to Netlify (Free, Easiest)
1. Go to https://netlify.com and sign in with GitHub
2. Click "New site from Git"
3. Select your `homeschoolhs-planner` repository
4. Netlify will auto-detect and deploy
5. Your site is live in 30 seconds!

## How to Use

### Adding a Student
1. Enter **Student Name** (e.g., "John Smith")
2. Enter **School Name** (e.g., "HomeschoolHS")
3. Enter **Expected Graduation Year**

### Adding Courses
1. For each year (Freshman → Senior):
   - Click "+ Add Course"
   - Fill in:
     - Course Name (e.g., "Biology")
     - Credits (usually 0.5 to 1.0)
     - Grade (A, B, C, D, F, or P for Pass)
     - Course Type (Regular, Honors, AP, IB)
   - Click "Add Course"

### Viewing Your Progress
- **Total Credits**: Sum of all course credits
- **Overall GPA**: Weighted GPA across all graded courses
- **Total Courses**: Number of courses added

### Generating a Transcript
1. Click the "📄 Transcript" tab
2. Click "Generate Transcript"
3. Your transcript will display organized by year
4. Click "🖨️ Print" to print or save as PDF

### Saving Your Work
- Click "💾 Save Plan" to save to browser storage
- Your data is stored locally on your device
- Click "📥 Export as JSON" to download a backup
- Click "📤 Import from JSON" to restore from backup

## Data Storage

**Where is my data stored?**
- Locally on your device using browser storage (localStorage)
- Not sent to any server
- Private and secure
- Survives page refreshes and closing the browser

**Backup Your Data**
- Click "📥 Export as JSON" regularly
- Save the file to a secure location
- Use "📤 Import from JSON" to restore anytime

## Grading Scale

Default 4.0 scale:
- **A** = 4.0 GPA points
- **B** = 3.0 GPA points
- **C** = 2.0 GPA points
- **D** = 1.0 GPA points
- **F** = 0.0 GPA points
- **P** = Pass (no GPA weight)

*Note: Grading scale customization coming in v2*

## Multiple Students

**Switching Between Students:**
1. Export current student's plan ("📥 Export as JSON")
2. Clear all courses ("🗑️ Clear All")
3. Change the student name
4. Add courses for new student
5. Save the new plan

**Restoring Previous Student:**
1. Import their JSON file ("📤 Import from JSON")

## Troubleshooting

### My data disappeared!
- Check if you cleared browser storage/cache
- Look for your exported JSON backup
- Browser storage can be cleared by:
  - Clearing browser cache
  - Uninstalling browser extensions
  - Using private/incognito mode

**Solution:** Always export important plans!

### GPA not calculating correctly?
- Verify all courses have a grade selected
- "P" (Pass) grades don't count toward GPA
- GPA is weighted by credits

### Can't find my transcript?
- Click the "📄 Transcript" tab
- Ensure you have courses added
- Click "Generate Transcript"

## Features Coming Soon (v2)

- ✨ Custom grading scales
- ✨ Weighted GPA (for Honors/AP)
- ✨ Multiple schools/districts
- ✨ Cloud backup (optional)
- ✨ PDF export
- ✨ Requirements checklist
- ✨ Course recommendations

## Support

Found a bug or have a suggestion?
1. Check existing issues on GitHub
2. Create a new issue with:
   - What you were doing
   - What went wrong
   - Your browser/device

## Privacy

Your data:
- ✅ Stays on your device
- ✅ Is never sent to servers
- ✅ Cannot be tracked
- ✅ Is yours to control

No account needed. No login. No ads.