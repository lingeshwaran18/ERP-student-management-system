export interface QaItem {
  q: string;
  keywords: string[];
  a: string;
}

export const erpKnowledgeBase: QaItem[] = [
  // User Prompt List 1 & List 2 Combined
  { q: "purpose of the student dashboard", keywords: ["purpose", "student dashboard", "dashboard purpose"], a: "The Student Dashboard provides a summary of the student's academic information, such as attendance, marks, fee status, timetable, and notifications in one place." },
  { q: "what information is displayed on the dashboard", keywords: ["information", "displayed", "dashboard"], a: "It displays attendance percentage, latest marks, upcoming exams, today's timetable, pending assignments, fee status, and recent notifications." },
  { q: "what happens when a student logs in", keywords: ["happens", "student logs in", "login"], a: "The system authenticates the student's credentials, generates a JWT token, fetches the student's data from the database, and redirects the student to the dashboard." },
  { q: "why is the dashboard important", keywords: ["why", "dashboard important", "importance of dashboard"], a: "It allows students to quickly view all important academic information without navigating through multiple pages." },
  { q: "which database tables are mainly used for the dashboard", keywords: ["database tables", "used for the dashboard", "dashboard tables"], a: "Student, Attendance, Marks, Fees, Timetable, Notifications, and Assignments tables." },
  
  // Profile
  { q: "why does the student profile module exist", keywords: ["why", "profile module exist", "profile purpose"], a: "It stores the student's personal and academic details securely." },
  { q: "what details can a student view", keywords: ["details", "student view", "view profile"], a: "Name, Roll Number, Register Number, Department, Semester, Email, Phone Number, Address, and Profile Picture." },
  { q: "can students edit every field", keywords: ["edit every field", "edit profile"], a: "No. Only permitted fields such as phone number, address, and profile picture can be updated." },
  { q: "why can't a student change the roll number", keywords: ["change the roll number", "roll number change"], a: "The Roll Number is a unique identifier assigned by the institution and should not be modified by students." },
  { q: "which sql operation is used when updating the profile", keywords: ["sql", "updating", "profile update"], a: "UPDATE." },
  
  // Attendance
  { q: "what is the attendance module", keywords: ["what is", "attendance module"], a: "It allows students to view their attendance records for each subject." },
  { q: "who marks attendance", keywords: ["who marks", "marks attendance"], a: "Faculty members mark attendance for students." },
  { q: "can students modify attendance", keywords: ["modify attendance", "edit attendance"], a: "No. Students have read-only access." },
  { q: "how is attendance percentage calculated", keywords: ["percentage", "calculated", "attendance percentage"], a: "(Present Days ÷ Total Working Days) × 100." },
  { q: "which sql operation is used to display attendance", keywords: ["sql", "display", "attendance sql"], a: "SELECT." },
  
  // Attendance Percentage
  { q: "why is attendance percentage displayed", keywords: ["why", "percentage displayed", "attendance percentage"], a: "It helps students know whether they meet the minimum attendance requirement." },
  { q: "what happens if attendance is below the required percentage", keywords: ["below the required", "attendance shortage", "shortage"], a: "The student may receive a warning and could become ineligible for examinations, depending on institution rules." },
  { q: "is attendance calculated automatically", keywords: ["calculated automatically", "automatic attendance"], a: "Yes. The system calculates it based on stored attendance records." },
  { q: "which module provides attendance data", keywords: ["module provides", "attendance data"], a: "The Attendance module." },
  { q: "which database table stores attendance", keywords: ["database table", "stores attendance", "attendance table"], a: "Attendance table." },
  
  // Marks
  { q: "what is the marks module", keywords: ["what is", "marks module"], a: "It allows students to view subject-wise examination marks." },
  { q: "who uploads marks", keywords: ["who uploads", "uploads marks"], a: "Faculty members upload marks." },
  { q: "can students edit marks", keywords: ["edit marks"], a: "No." },
  { q: "which sql query is mainly used", keywords: ["sql query", "mainly used", "marks query"], a: "SELECT." },
  { q: "why is this module important", keywords: ["why", "marks", "important"], a: "It helps students monitor their academic performance." },
  
  // Internal Marks
  { q: "what are internal marks", keywords: ["internal marks", "what are internal"], a: "They are marks awarded through assignments, tests, quizzes, and internal assessments." },
  { q: "who updates internal marks", keywords: ["who updates", "internal updates"], a: "Faculty members." },
  { q: "can students download internal marks", keywords: ["download internal", "download marks"], a: "Yes, if the download feature is provided." },
  { q: "are internal marks included in final results", keywords: ["included in final", "internal results"], a: "Yes, according to the institution's evaluation policy." },
  { q: "which table stores internal marks", keywords: ["table stores", "internal table"], a: "Internal_Marks table." },
  
  // Semester Results
  { q: "what is the semester results module", keywords: ["semester results module"], a: "It displays the student's semester examination results." },
  { q: "what details are shown", keywords: ["details are shown", "semester results details"], a: "Subject Name, Marks, Grade, Credits, GPA, and CGPA." },
  { q: "can results be modified by students", keywords: ["results", "modified", "students"], a: "No." },
  { q: "who publishes semester results", keywords: ["publishes semester", "publish results"], a: "The examination administrator." },
  { q: "which sql operation is used", keywords: ["sql", "semester results sql"], a: "SELECT." },
  
  // Assignments
  { q: "why is the assignment module useful", keywords: ["assignment module useful", "assignments useful"], a: "It allows students to view, submit, and track assignments." },
  { q: "can students upload assignment files", keywords: ["upload assignment", "submit assignment"], a: "Yes." },
  { q: "what file types are generally allowed", keywords: ["file types", "allowed file"], a: "PDF, DOCX, PPT, ZIP, and image files, depending on system settings." },
  { q: "can students submit after the deadline", keywords: ["submit after the deadline"], a: "Normally no, unless faculty extends the deadline." },
  { q: "which sql operations are used", keywords: ["sql", "assignments sql"], a: "INSERT and SELECT." },
  
  // Study Materials
  { q: "what is the study materials module", keywords: ["study materials module"], a: "It provides notes, presentations, PDFs, and reference materials uploaded by faculty." },
  { q: "can students upload study materials", keywords: ["students upload study"], a: "No." },
  { q: "who uploads study materials", keywords: ["uploads study materials"], a: "Faculty members." },
  { q: "which sql operation is used", keywords: ["sql", "study materials sql"], a: "SELECT." },
  { q: "why is this module useful", keywords: ["why", "study materials", "useful"], a: "Students can access learning resources anytime." },
  
  // Enrolled Courses & Subjects
  { q: "what is displayed in the courses module", keywords: ["displayed", "courses module"], a: "All courses enrolled by the student." },
  { q: "can students change courses", keywords: ["change courses"], a: "No, unless permitted by the administrator." },
  { q: "database table stores course information", keywords: ["database table", "stores course"], a: "Course table." },
  { q: "sql operation is mainly used", keywords: ["sql", "courses sql"], a: "SELECT." },
  { q: "why is this module important", keywords: ["why", "courses", "important"], a: "It helps students know their enrolled courses and subjects." },
  { q: "what information is shown", keywords: ["information", "shown", "subjects information"], a: "Subject Code, Subject Name, Credits, and Faculty Name." },
  { q: "who manages subjects", keywords: ["manages subjects"], a: "The administrator." },
  { q: "can students edit subject information", keywords: ["edit subject information"], a: "No." },
  { q: "sql operation is used", keywords: ["sql", "subjects sql"], a: "SELECT." },
  { q: "why is this module useful", keywords: ["why", "subjects", "useful"], a: "Students can view subject details for their semester." },
  
  // Timetable
  { q: "what is the timetable module", keywords: ["what is", "timetable module"], a: "It displays the daily and weekly class schedule." },
  { q: "who prepares the timetable", keywords: ["prepares the timetable"], a: "The administrator or timetable coordinator." },
  { q: "can students edit the timetable", keywords: ["edit the timetable"], a: "No." },
  { q: "sql operation is used", keywords: ["sql", "timetable sql"], a: "SELECT." },
  { q: "why is the timetable important", keywords: ["why", "timetable", "important"], a: "It helps students attend classes on time." },
  
  // Exam Schedule
  { q: "what is shown in the exam schedule", keywords: ["shown", "exam schedule"], a: "Exam date, subject, time, and venue." },
  { q: "who updates the schedule", keywords: ["updates", "schedule", "exam updates"], a: "The examination administrator." },
  { q: "can students modify exam schedules", keywords: ["modify exam schedules"], a: "No." },
  { q: "sql query is used", keywords: ["sql", "exam schedule sql"], a: "SELECT." },
  { q: "why is this feature important", keywords: ["why", "exam schedule", "important"], a: "It helps students prepare and attend exams on the correct dates." },
  
  // Fee Status
  { q: "what is fee status", keywords: ["what is", "fee status"], a: "It displays the fee amount paid, balance due, and payment status." },
  { q: "can students pay fees online", keywords: ["pay fees online"], a: "Yes, if online payment is integrated." },
  { q: "sql operation is mainly used", keywords: ["sql", "fee status sql"], a: "SELECT." },
  { q: "why is this module useful", keywords: ["why", "fee status", "useful"], a: "Students can track fee payments and dues." },
  { q: "table stores fee information", keywords: ["table stores", "fee table"], a: "Fees table." },
  
  // Notifications
  { q: "what are notifications", keywords: ["what are", "notifications"], a: "They inform students about exams, events, holidays, assignments, and announcements." },
  { q: "who sends notifications", keywords: ["who sends", "notifications sender"], a: "The administrator or faculty." },
  { q: "can students delete notifications", keywords: ["delete notifications"], a: "Usually, they can mark them as read but cannot delete them." },
  { q: "sql operation is used", keywords: ["sql", "notifications sql"], a: "SELECT." },
  { q: "why are notifications important", keywords: ["why", "notifications", "important"], a: "They keep students informed about important academic updates." },
  
  // Logout
  { q: "why is the logout feature necessary", keywords: ["why", "logout", "necessary"], a: "It securely ends the student's session." },
  { q: "happens when logout is clicked", keywords: ["happens", "logout clicked", "logout behavior"], a: "The JWT token/session is invalidated or removed, and the student is redirected to the login page." },
  { q: "why should students always log out", keywords: ["always log out", "why log out"], a: "To protect their account from unauthorized access." },
  { q: "security concept is used here", keywords: ["security concept", "logout security"], a: "Session management and authentication." },
  { q: "http method is commonly used", keywords: ["http method", "logout method"], a: "POST (or GET in some applications, though POST is preferred for logout actions)." },
  
  // Studies & Research Questions
  { q: "why do educational institutions implement erp systems", keywords: ["implement erp", "why erp", "institutions erp"], a: "Educational institutions implement ERP systems to centralize student information, automate administrative tasks, reduce paperwork, improve communication, and provide real-time access to academic records. Research shows that ERP systems improve operational efficiency and reduce manual errors." },
  { q: "how does an erp system improve student performance", keywords: ["improve student performance", "improve performance", "student performance"], a: "ERP systems help students monitor attendance, marks, assignments, timetables, and exam schedules in one place. This improves time management, engagement, and academic planning, which can contribute to better performance." },
  { q: "why is a student dashboard important", keywords: ["why", "dashboard important", "student dashboard importance"], a: "The dashboard provides quick access to attendance, grades, notifications, fee status, and assignments, helping students make informed academic decisions without searching through multiple systems." },
  { q: "what is the biggest advantage of a centralized database", keywords: ["biggest advantage", "centralized database"], a: "A centralized database ensures that every department uses the same student information, reducing duplicate records, inconsistencies, and data redundancy." },
  { q: "how does the attendance module help students", keywords: ["how", "attendance module help"], a: "Students can monitor their attendance percentage regularly, identify shortages early, and improve attendance before examinations." },
  { q: "why should students have read-only access to marks", keywords: ["read-only access", "marks access"], a: "Marks are official academic records. Allowing students to edit them would compromise data integrity and security. Only authorized faculty members should update marks." },
  { q: "why is role-based authentication important", keywords: ["role-based", "authentication important", "rbac"], a: "Role-based authentication ensures that students, faculty, parents, and administrators only access the information relevant to their responsibilities, improving security and protecting confidential data." },
  { q: "what challenges do students face while using erp systems", keywords: ["challenges", "students face", "using erp"], a: "Research has found that students may initially struggle with learning the ERP interface, require training, and sometimes feel that more practice time is needed to become comfortable with the system." },
  { q: "why is data validation necessary", keywords: ["data validation", "validation necessary"], a: "Validation prevents incorrect or incomplete information from being stored in the database. For example, email format, phone number length, and mandatory fields are checked before saving." },
  { q: "how does the notification module improve communication", keywords: ["notification module improve", "communication erp"], a: "Notifications inform students about assignment deadlines, exams, fee due dates, holidays, and important announcements instantly, improving communication between the institution and students." },
  { q: "why is jwt used in the project", keywords: ["jwt used", "why jwt", "jwt"], a: "JWT (JSON Web Token) provides secure authentication after login. Once authenticated, students can access authorized resources without repeatedly entering their credentials." },
  { q: "what problem does the erp system solve compared to manual management", keywords: ["problem does", "solve", "manual management"], a: "Manual systems involve paper records, duplicate data, delays, and human errors. ERP digitizes these processes, making data retrieval faster, more accurate, and easier to manage." },

  // ================= NEW UNIQUE QUESTIONS =================
  { q: "how does the dashboard load personalized data", keywords: ["load personalized data", "load personalized"], a: "After login, the backend identifies the student (using the JWT token payload claims) and fetches their specific profile and academic records from the database." },
  { q: "why is a dashboard better than separate pages", keywords: ["better than separate pages", "why dashboard better"], a: "It provides immediate quick access to critical, highly-requested summary information in one screen, reducing routing and search friction." },
  { q: "how can dashboard performance be improved", keywords: ["performance be improved", "dashboard performance", "optimize dashboard"], a: "By implementing server caching, writing optimized relational SELECT queries, indexing foreign keys, and lazy-loading individual widget components." },
  { q: "what happens if dashboard data cannot be loaded", keywords: ["cannot be loaded", "dashboard fails"], a: "The client displays a user-friendly error message or placeholder skeleton screen, and the backend exceptions are logged to the audit files." },
  { q: "which profile fields can students update", keywords: ["profile fields can students update", "fields update"], a: "Typically non-academic records like contact phone numbers, current addresses, personal emails, and profile photographs." },
  { q: "why is profile validation important", keywords: ["profile validation important", "why validation important"], a: "It prevents invalid, incomplete, or corrupted records (like wrong phone lengths or incorrect email patterns) from being committed to the database." },
  { q: "how is profile data protected", keywords: ["profile data protected", "protect profile"], a: "JWT-based request authentication and strict resource ownership checks ensure that only the profile owner or administrator can modify details." },
  { q: "what sql operation updates profile information", keywords: ["updates profile information", "sql updates profile"], a: "UPDATE." },
  { q: "who is authorized to modify attendance records", keywords: ["modify attendance records", "authorized attendance"], a: "Only authorized faculty instructors or academic administrators have write access." },
  { q: "why do students have read-only access to attendance", keywords: ["read-only access to attendance"], a: "To ensure academic integrity, prevent proxies, and protect official attendance statistics from tamper inputs." },
  { q: "how are absent records stored", keywords: ["absent records stored", "absent stored"], a: "Absent logs are stored as database entries linking the student's foreign key, selected date, and marked status set to 'ABSENT'." },
  { q: "what happens if attendance is not marked", keywords: ["attendance is not marked"], a: "The system defaults to a blank state for that session, and authorized faculty can retroactively log it using standard administration panels." },
  { q: "who publishes examination marks", keywords: ["publishes examination marks", "publishes marks"], a: "Faculty members enter student grades, which are verified by the department heads and then published by the exam registrar." },
  { q: "how does the system ensure marks accuracy", keywords: ["marks accuracy", "ensure marks"], a: "Using strict frontend range checks (e.g. score cannot exceed max marks), input validation middleware, and locking logs post-submission." },
  { q: "can marks be edited after publication", keywords: ["marks be edited after publication", "marks edited after"], a: "Usually no. Any changes post-publication require official registrar overrides and register audit log entries." },
  { q: "which sql operation retrieves marks", keywords: ["retrieves marks", "sql retrieves marks"], a: "SELECT." },
  { q: "why are marks displayed subject-wise", keywords: ["marks displayed subject-wise", "subject-wise"], a: "It helps students evaluate performance indicators and identify specific courses where they need improvement." },
  { q: "why are assignment deadlines enforced", keywords: ["assignment deadlines enforced", "deadlines enforced"], a: "To maintain structured academic schedules, ensure fair student assessment, and prevent grading backlogs for instructors." },
  { q: "what happens after an assignment is submitted", keywords: ["after an assignment is submitted", "submitted assignment"], a: "The file is uploaded (to storage like Cloudinary or local disks), a database entry is created with submission timestamp, and faculty portals are updated." },
  { q: "how can duplicate submissions be handled", keywords: ["duplicate submissions", "multiple submissions"], a: "The system handles it by either overwriting the old file in database records or saving version increments depending on settings." },
  { q: "why is file validation required", keywords: ["file validation required", "why file validation"], a: "To restrict upload sizes and block dangerous executable extensions (like .exe, .sh) that pose security threats." },
  { q: "which database table stores assignment submissions", keywords: ["table stores assignment submissions", "submissions table"], a: "An AssignmentSubmissions (or generic Assignment) table containing student references and uploaded URLs." },
  { q: "who creates the timetable", keywords: ["creates the timetable", "timetable creator"], a: "Academic deans or designated timetable coordinators." },
  { q: "why is conflict detection important", keywords: ["conflict detection", "timetable conflict"], a: "It programmatically prevents scheduling double-bookings for the same physical classroom, subject, faculty member, or student cohort." },
  { q: "what information is shown in fee status", keywords: ["shown in fee status", "fee status information"], a: "Billed tuition, hostel/mess tallies, transport bus balances, due deadlines, and previous invoice history." },
  { q: "how does online fee payment improve the system", keywords: ["online fee payment improve", "payment improve"], a: "It automates transaction matching, generates instant digital invoices, and reduces paper processing workloads." },
  { q: "why are courses linked to semesters", keywords: ["courses linked to semesters", "linked to semesters"], a: "It organizes academic progression, ensuring students can select and view only the subjects relevant to their current term." },
  { q: "can a student enroll in a course directly", keywords: ["enroll in a course directly", "student enroll course"], a: "No. Course allocations are managed by deans or administrative registrars during standard admission cycles." },
  { q: "what details are displayed for each subject", keywords: ["details are displayed for each subject", "subject details"], a: "Subject code, academic credits, department syllabus name, semester term, and assigned faculty name." },
  { q: "why are credits assigned to subjects", keywords: ["credits assigned to subjects", "why credits"], a: "Credits represent the academic weight and weekly lecture hours, acting as multipliers for GPA and CGPA calculations." },
  { q: "why should exam schedules be published early", keywords: ["exam schedules be published early", "published early"], a: "It allows students enough preparation buffer time and helps out-of-town students plan logistics." },
  { q: "what happens when the exam schedule changes", keywords: ["exam schedule changes"], a: "The database dates are modified, and automated notifications (emails, notice boards) are sent to students and faculty." },
  { q: "how is gpa calculated", keywords: ["how is gpa calculated", "gpa calculation"], a: "GPA is calculated by dividing total grade points earned (Credit Weight × Grade Score) by the total number of credits attempted." },
  { q: "why are results locked after publication", keywords: ["results locked after publication", "results locked"], a: "To secure institutional record integrity and prevent unauthorized grades manipulation." },
  { q: "why should study materials be categorized by subject", keywords: ["study materials be categorized", "materials categorized"], a: "To make navigation intuitive, helping students find notes, slide decks, and reference guides efficiently." },
  { q: "can students download study materials offline", keywords: ["download study materials offline", "materials offline"], a: "Yes. Materials can be downloaded in PDF or document format for offline study." },
  { q: "why are push notifications useful", keywords: ["push notifications useful", "why push"], a: "They instantly catch user attention on screens, reducing delays in reading deadline alerts or emergencies." },
  { q: "can students mark notifications as read", keywords: ["mark notifications as read", "notifications read"], a: "Yes. Marking notices as read hides them from active alert grids, improving clean UI navigation." },
  { q: "what is the purpose of the events module", keywords: ["purpose of the events module", "events module purpose"], a: "To display institutional events, dates, locations, and guest lectures to keep students engaged." },
  { q: "how do event reminders help students", keywords: ["event reminders help", "reminders help"], a: "Reminders reduce missing important academic, extracurricular, or physical campus events." },
  { q: "why should strong passwords be enforced", keywords: ["strong passwords be enforced", "why strong passwords"], a: "To prevent brute-force entries, account compromises, and protect student information." },
  { q: "what validations are applied while changing a password", keywords: ["validations are applied while changing a password", "changing password"], a: "Current password must match stored records, and the new password must meet length and complexity metrics." },
  { q: "why should users log out on shared computers", keywords: ["users log out on shared", "shared computers"], a: "To prevent subsequent computer users from hijacking active browser sessions and editing details." },
  { q: "why are rest apis used", keywords: ["why are rest apis used", "why rest"], a: "They provide scalable, standard, and stateless communication between Next.js clients and Express servers." },
  { q: "why are foreign keys important", keywords: ["why are foreign keys important", "foreign keys"], a: "They enforce relational integrity, linking records across tables (like mapping a grade to a valid Student ID) and preventing orphaned rows." },
  { q: "how does an erp system improve student experience", keywords: ["erp system improve student experience", "student experience"], a: "By centralizing administrative needs (finance, courses, grades) into a single, cohesive, self-service dashboard portal." },
  { q: "how can database indexing improve student search performance", keywords: ["database indexing improve student search", "indexing improve"], a: "Indexes create quick lookup paths (e.g. on roll number), reducing full table scans and accelerating query times." },
  { q: "why is pagination used in large student lists", keywords: ["pagination used in large", "why pagination"], a: "It loads database rows in smaller pages (e.g., 20 at a time), lowering server memory loads and network sizes." },
  { q: "why should mandatory fields be validated on both frontend and backend", keywords: ["validated on both frontend and backend", "both frontend and backend"], a: "Frontend checks provide instant UI feedback; backend validation serves as a security check in case frontend scripts are bypassed." },
  { q: "how is email uniqueness enforced", keywords: ["email uniqueness enforced", "unique email"], a: "Using UNIQUE constraints in the database schema (e.g. Prisma `@unique`) and performing verify lookups during sign-up." },
  { q: "why should passwords be hashed instead of stored as plain text", keywords: ["hashed instead of stored", "why hash password"], a: "Hashing ensures that if the database is leaked, user passwords cannot be read. Hashing is a one-way cryptographic check." },
  { q: "what is role-based authorization", keywords: ["what is role-based authorization", "rbac authorization"], a: "A security pattern ensuring users access only endpoints assigned to their role group (Admin, Student, Faculty, Parent)." },
  { q: "why should apis return proper http status codes", keywords: ["apis return proper", "http status codes"], a: "They communicate the outcome of requests uniformly: 200 for OK, 400 for bad parameters, 401 for unauthorized, 500 for server bugs." },
  { q: "what is the purpose of input sanitization", keywords: ["purpose of input sanitization", "sanitization"], a: "It cleans input values, stripping malicious tags to prevent XSS (Cross-Site Scripting) and SQL injection threats." },
  { q: "why are transactions important when updating multiple tables", keywords: ["transactions important", "database transactions"], a: "They ensure 'All-or-Nothing' database changes, keeping tables consistent if a query fails midway." },
  { q: "what is normalization", keywords: ["what is normalization", "normalization"], a: "Organizing database fields to minimize data duplication and isolate modifications cleanly." },
  { q: "why is unit testing important", keywords: ["why is unit testing important", "unit testing"], a: "It checks individual functions or code sections in isolation to detect bugs early in developer builds." },
  { q: "what is integration testing", keywords: ["what is integration testing", "integration testing"], a: "It verifies that distinct components (like Express controllers calling SQL tables via Prisma) interface correctly." },
  { q: "why use a layered architecture", keywords: ["why use a layered architecture", "layered architecture"], a: "It divides systems into layers (routing, controller, business, database), making code maintenance, updates, and testing simple." },
  { q: "what is the role of the service layer", keywords: ["role of the service layer", "service layer role"], a: "It encapsulates complex business logic and workflows, keeping controllers thin and focused on HTTP request/responses." },
  { q: "what is a key challenge in erp implementation", keywords: ["key challenge in erp", "erp challenge"], a: "User adoption resistance, data migration complications, and change management requirements." },
  { q: "how can erp improve communication", keywords: ["how can erp improve communication", "erp improve communication"], a: "By centralizing notice boards, messaging, alerts, and report sheets into one dashboard accessible by all roles." },
  { q: "why should frequently accessed data be cached", keywords: ["frequently accessed data be cached", "caching"], a: "Caching avoids repeating expensive database reads, lowering server CPU loads and accelerating load times." },
  { q: "why use environment-specific configuration files", keywords: ["environment-specific", "configuration files env"], a: "To separate local development databases from live production API keys and hosts safely." },
  { q: "why are regular database backups necessary", keywords: ["regular database backups", "backups necessary"], a: "They guard against server failures, human errors, or database corruptions, facilitating quick system recovery." },
  { q: "name one future enhancement for the student module", keywords: ["future enhancement for the student", "student enhancement"], a: "Integrating automated AI performance predictions or building biometric QR attendance systems." },
  { q: "how can ai improve an erp student management system", keywords: ["how can ai improve", "ai improve erp"], a: "By predicting student failure risks early, offering smart chat assistants, and scheduling classroom slots automatically." },
  { q: "why integrate biometric attendance", keywords: ["why integrate biometric", "biometric attendance"], a: "It eliminates manual attendance records, prevents proxy entries, and saves class instruction time." },
  { q: "why develop a mobile app for the erp", keywords: ["develop a mobile app", "mobile app erp"], a: "It enables push notification alerts and allows students/parents to access tools on the move." },
  { q: "what is the benefit of cloud deployment", keywords: ["benefit of cloud", "cloud deployment"], a: "Cloud hosts offer automatic system scaling, high server availability, and global access without physical hardware costs." },
  { q: "how can analytics help students", keywords: ["analytics help students", "student analytics"], a: "Visual charts highlight study patterns, track attendance dips, and show performance metrics over semesters." },
  { q: "why is student data privacy important", keywords: ["student data privacy important", "privacy important"], a: "To secure sensitive data (like contact numbers or grades) from identity theft or leaks." },
  { q: "why should educational software follow data protection policies", keywords: ["follow data protection", "protection policies"], a: "To comply with national legal statutes (like FERPA or GDPR) and protect student information." },
  { q: "why integrate email and SMS services", keywords: ["integrate email and sms", "email and sms"], a: "To deliver alerts immediately for fee deadlines, attendance warnings, or class schedule adjustments." },
  { q: "how does a chatbot help students", keywords: ["chatbot help students", "chatbot helper"], a: "It resolves simple informational requests instantly (like asking about exam schedules), lowering staff workloads." },
  { q: "why should the erp be accessible", keywords: ["why should the erp be accessible", "erp accessible"], a: "To ensure that users with diverse abilities or screen-readers can navigate institutional tools seamlessly." },
  { q: "why should the system support increasing users", keywords: ["support increasing users", "system scale"], a: "To ensure the server doesn't crash during peaks (like grades publication days) when user traffic surges." },
  { q: "why is software maintenance important", keywords: ["software maintenance important", "maintenance important"], a: "To patch zero-day security vulnerabilities, optimize slow code paths, and update package dependencies." },
  { q: "what is the biggest advantage of this erp project", keywords: ["biggest advantage of this erp", "project advantage"], a: "It integrates multiple administrative and academic tools into one single unified database platform." },
  { q: "what did you learn from developing this project", keywords: ["learn from developing", "what did you learn"], a: "I learned database relation mapping, JWT security middleware design, responsive Tailwind styling, and ERP workflow business logic." },
  { q: "why did you choose spring boot for this project", keywords: ["choose spring boot", "why spring boot"], a: "Spring Boot simplifies Java enterprise backend coding with modular dependencies, automated configuration wrappers, and robust Spring Security." }
];
