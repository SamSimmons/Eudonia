# Education

A surprisingly table-heavy domain. K-12 and higher ed run on student information systems, learning management systems, and gradebooks that are essentially specialized tables. Reference tools: Canvas, Blackboard, Moodle, D2L Brightspace, PowerSchool, Infinite Campus, Skyward, Schoology, Google Classroom, Aeries, Banner, Workday Student, Frontline, Clever, Kahoot/quiz tools' analytics views.

## Who is at the screen

- **Teachers** entering grades, taking attendance, looking at student work submissions. Daily users; the gradebook table is the workspace.
- **School administrators** (principals, deans) reviewing attendance, behavior, performance trends.
- **District / superintendent staff** rolling up across schools.
- **Academic advisors / counselors** reviewing student progress, intervention candidates, course schedules.
- **Registrars** managing enrollment, course catalog, transcripts.
- **Faculty in higher ed** managing course rosters, grades, advising loads.
- **Students** viewing their own grades, schedule, assignments.
- **Parents** looking at their child's grades, attendance, missing assignments.
- **Special education / 504 coordinators** managing IEP / 504 documentation tables.
- **Athletic directors** managing rosters, eligibility, schedules.
- **State reporting staff** preparing required reports for state education departments.

## Jobs to be done

- Enter today's grades / attendance.
- See which students are missing assignments.
- Identify students who need intervention.
- Plan next term's courses.
- Build a class roster.
- Send a progress report to parents.
- Track behavior incidents over time.
- Verify a student's eligibility for graduation.
- Roll up grades for a transcript.
- Submit required state report.

## Representative tables

### Gradebook
The defining table of K-12 and higher ed. Each row a student; each column an assignment, exam, or category; cells are scores. Row scale: 15–35 per class for K-12, dozens to hundreds for college. Column scale: dozens to hundreds over a term. Editable in place — type the grade, tab to next. Color on missing, late, low. Footer: class average, distribution. Sticky first column (student name) and sticky header (assignment names).

### Roster table
Each row a student in a class. Columns: photo, name, ID, year, email, status (active/dropped). Row scale: 15–300. Used to take attendance, contact, and reference identity throughout other tables.

### Attendance table
Each row a student. Columns: name + a column per day (or per period). Cells: present/absent/tardy/excused. Row scale: 15–35 per class. Editable. Color heavily. Footer: attendance rate per student.

### Attendance summary by student
Each row a student. Columns: total absent days, total tardies, attendance rate, pattern (sparkline), excused vs unexcused breakdown. Row scale: dozens per teacher, thousands per school.

### Assignment / submissions table
Each row a student × assignment. For one assignment, each row a submission. Columns: student, submission time, status (submitted/late/missing), grade, plagiarism check, feedback given. Row scale: 15–300 per assignment.

### Course catalog table
Each row a course offering. Columns: course code, title, instructor, term, day/time, room, credits, enrollment, capacity, waitlist. Row scale: hundreds to thousands per term.

### Schedule / timetable table
Each row a period or time slot for one student or one teacher. Columns: time, course, room, teacher / students. Row scale: handful per day. Often shown as a grid of days × periods.

### Master schedule
Whole school or department. Each row a course section. Columns: course, section, teacher, room, period, students enrolled. Row scale: hundreds per school.

### Behavior / discipline table
Each row a behavior incident. Columns: date, student, incident type, reporter, action taken, severity. Row scale: dozens to hundreds per school per year.

### Intervention / RTI (Response to Intervention) table
Each row a student flagged for intervention. Columns: name, intervention type, tier, started, goal, progress check, owner. Row scale: dozens per school.

### IEP / 504 / accommodations table
Each row a student with documented accommodations. Columns: student, plan type, accommodations, goals, last review, next review. Row scale: dozens per school. Privacy-sensitive.

### Transcript table
Each row a course taken. Columns: term, course, credits, grade, GPA contribution. Row scale: dozens to hundreds. Footer: cumulative GPA, total credits. Printable artifact.

### Degree audit table
Each row a degree requirement. Columns: requirement, courses satisfying, status (met/in progress/not met), credits applied. Row scale: dozens. Hierarchical (category > subcategory > requirement).

### Enrollment / registration table
Each row a course the student is registered for. Columns: course, section, status, dropdown to drop. Row scale: 4–8 per term.

### Grade distribution / analytics table
Each row a course or section. Columns: course, enrollment, A/B/C/D/F counts, mean, median, withdrawals. Row scale: dozens to hundreds.

### Standards mastery table
For standards-based grading. Each row a student × standard. Cells: mastery level. Row scale: 15–30 students × dozens of standards.

### Quiz / assessment results table
Each row a student attempt or each row a question. Columns vary. Used for item analysis (which questions were hardest).

### Office hours / advising appointment table
Each row an appointment. Columns: time, student, advisor, topic, status. Row scale: dozens per week.

### Tuition / financial aid / billing table
Each row a charge or aid award. Columns: term, type, amount, status, due date. Row scale: dozens. Footer: balance.

### Library / textbook table
Each row a book or resource checked out. Columns: title, due date, borrower, status, fines. Row scale: hundreds to thousands.

### Athletics roster table
Each row a player. Columns: name, position, jersey, eligibility status, grade, GPA, sports physical date. Row scale: dozens per team.

### State reporting tables
Each row a student or aggregate slice for state-mandated reporting. Columns vary widely by state. Strict format requirements.

## Behaviors and needs

- **Heavy in-place editing.** The gradebook is the canonical edit-everywhere table. Type, tab, save, undo. The table is the teacher's primary input device.
- **Sticky first column + sticky header.** Universal in gradebooks and attendance tables.
- **Bulk operations.** "Mark all present," "drop lowest score," "give all submissions a 100." Common in classroom workflows.
- **Per-cell formatting.** Missing → red, late → orange, exempt → grey, makeup → italic. Many cell states.
- **Click cell to edit and add note.** Comments per grade are common.
- **Drag-fill (spreadsheet-style).** Some gradebooks support filling a column with the same value via drag.
- **Photo-driven identity.** Student photos appear in roster, gradebook, attendance.
- **Print and PDF.** Progress reports, report cards, transcripts. The table is the data; printed artifact is the deliverable.
- **Parent / student / teacher view differences.** Same data, different visibility per role.
- **Roll-up to category.** Tests, homework, participation as categories with weighted averages.
- **Standards-based view alongside score-based view.** Toggle between viewing assignments and viewing standards mastered.
- **Notes / comments / behavior incident attachment** to a student row.
- **Attendance code keyboard shortcuts.** Press `P` `A` `T` to mark present / absent / tardy without using the mouse.
- **Compare to district or state averages.** Benchmark column or row.
- **Filter by group.** "Show only my advisees," "show only IEP students."
- **Mobile use** — teachers, students, parents all use mobile. Tables need to collapse responsively.

## Frustrations

- A gradebook that auto-sorts when a grade is entered, throwing the teacher off.
- Slow saves — teacher enters 30 grades in a row and the system loses them when the network blips.
- Attendance taken on a phone that doesn't sync to the desktop view for hours.
- Photos that don't load, replaced with default silhouettes that all look identical.
- A table that doesn't differentiate "0" (got zero points) from "missing" (never submitted) from "exempt."
- Parent portals that show stale grades.
- A standards-based view that doesn't roll up to a familiar A-F letter grade.
- Inability to undo a bulk action ("mark all present") that mistakenly overwrote real attendance.
- A transcript that breaks across pages without repeating headers.
- Course catalog tables that don't show prerequisites or conflicts inline.
- Names with non-Latin characters or hyphenated names rendering broken.
- A schedule grid that doesn't handle the bell schedule changing across days of the week.
- A degree audit that says "not met" without explaining what would meet it.

## Domain-specific notes

- **The gradebook is the canonical "table as application."** It is essentially the only UI in many teachers' lives. Whatever defaults work for the gradebook will work for many other tables.
- **Privacy and FERPA in the US, GDPR in Europe.** Student data has heavy protections. Tables must not leak student information across user boundaries.
- **Multi-user, multi-role.** Teachers, students, parents, admins all see overlapping tables with different visibility. The component is agnostic but the contexts are real.
- **Calendar awareness.** Term boundaries, grading periods, holidays, snow days, half-days. Time-based tables need to handle these gracefully.
- **K-12 vs higher ed differ.** K-12 tables are smaller (a teacher has 30 kids); higher ed tables are larger (a professor has 300 in a lecture). The same component must handle both densities.
- **Photos are universal in K-12** but rarer in higher ed.
- **Editing patterns matter more than reading patterns** in gradebook and attendance tables. The teacher reads briefly; they enter heavily.
- **Mobile is a real second context** — parents check grades on phones; teachers take attendance on tablets.
- **State reporting** is a tabular artifact requirement. Strict layouts; a row missing a value can fail an entire submission. The component should produce predictable output.
- **Specialized tables for specialized populations.** IEP, 504, ELL, gifted, athletics — each has its own table that overlaps with the main roster but adds dimensions. The component must accept arbitrary additional columns.
- **Print is not optional.** Report cards, transcripts, attendance summaries, IEP documents — all printed regularly. Page-break-aware rendering is real.
- **Visual appeal matters less than reliability.** Education software is widely mocked for ugliness; teachers tolerate it because the bar is "doesn't lose my data." A tasteful table component is a real upgrade.
