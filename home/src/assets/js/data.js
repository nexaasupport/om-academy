/*
Author       : OM Academy
Description  : Home page content: WhatsApp number, announcements, gallery photos, important dates,
               individual courses (course-details.html) and government schemes (schemes.html)
*/

// Enquiries are handed off to this WhatsApp number (Hisar center).
export const WHATSAPP_NUMBER = "919992887708";

// Pre-filled text for the Announcements "Get updates on WhatsApp" link.
export const WHATSAPP_UPDATES_TEXT = "Hi OM Academy, please send me updates on new batches, scholarships and notices.";

// Announcements, newest first; the first match is pinned as the latest notice.
// tag must be IMPORTANT, NOTICE, UPDATE or SCHOLARSHIP to appear under a filter; date is "DD Mon YYYY".
export const announcements = [
  { tag: "IMPORTANT", date: "23 Aug 2026", time: "10:00 AM", image: "1541339907198-e08756dedf3f", title: "Skill Assistant Fellowship in Advanced IT Learning (SAFAL) Scheme", desc: "Haryana Government is offering a 75% scholarship on course fee for eligible students under the SAFAL scheme. Apply before the last date." },
  { tag: "IMPORTANT", date: "20 May 2026", time: "9:30 AM", title: "New Batches Starting Soon!", desc: "Admissions open for various skill development courses. Secure your seat now." },
  { tag: "UPDATE", date: "18 May 2026", title: "Document Verification Drive", desc: "Document verification at all OM Academy centers from 20 May 2026." },
  { tag: "SCHOLARSHIP", date: "15 May 2026", title: "Scholarship Opportunity", desc: "Eligibility-based scholarship available for eligible students. Apply now." },
  { tag: "NOTICE", date: "12 May 2026", title: "Holiday Notice", desc: "All OM Academy centers will remain closed on 15 May 2026 (Friday)." },
  { tag: "UPDATE", date: "08 May 2026", title: "Computer Lab Timings Revised", desc: "Lab practice slots have been updated for all NIELIT and HKCL batches." },
  { tag: "SCHOLARSHIP", date: "05 May 2026", title: "HKCL Merit Scholarship Applications Open", desc: "Meritorious students of HS-CIT can apply for fee concession this term." },
  { tag: "NOTICE", date: "02 May 2026", title: "Exam Form Submission", desc: "Students appearing in the upcoming NIELIT examination must submit exam forms at their centre." },
  { tag: "IMPORTANT", date: "28 Apr 2026", title: "Placement Drive Registration", desc: "Register for the campus placement drive with an updated resume at the front desk." },
  { tag: "UPDATE", date: "22 Apr 2026", title: "New Course: Digital Marketing Fundamentals", desc: "A new short-term digital marketing course is now open for admission." },
];

export const announcementFilters = ["All", "Important", "Notice", "Update", "Scholarship"];

// Colour per announcement tag: a .tone-* class from scss/components/_tones.scss.
export const tagTones = {
  IMPORTANT: "green",
  NOTICE: "blue",
  UPDATE: "purple",
  SCHOLARSHIP: "amber",
};

// Gallery. Only the Hisar photo is real; the rest are Unsplash stand-ins until real photos arrive.
// Put real photos in src/assets/img/ and give them full (lightbox), card (grid) and thumb (lightbox strip) paths.
const unsplash = (id, width, quality) => "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=" + quality;

export const galleryItems = [
  { title: "OM Academy – Hisar Center", tag: "INFRASTRUCTURE", group: "Infrastructure", tone: "green", caption: "Hisar Center", full: "assets/img/om-academy-building.jpeg", card: "assets/img/om-academy-building-800.jpg", thumb: "assets/img/om-academy-building-800.jpg" },
  { title: "Digital Marketing Workshop", tag: "WORKSHOP", group: "Workshops", tone: "blue", photo: "1657812670261-7b76ba04525c" },
  { title: "Computer Lab Training", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1569653402334-2e98fbaa80ee" },
  { title: "Certificate Distribution", tag: "EVENT", group: "Events", tone: "purple", photo: "1541339907198-e08756dedf3f" },
  { title: "Campus Placement Drive", tag: "PLACEMENT", group: "Placements", tone: "amber", photo: "1521791136064-7986c2920216" },
  { title: "Spoken English Class", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1522202176988-66273c2fd55f" },
  { title: "Web Development Workshop", tag: "WORKSHOP", group: "Workshops", tone: "blue", photo: "1522071820081-009f0129c71c" },
  { title: "Hardware & Networking Lab", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1544197150-b99a580bb7a8" },
  { title: "Career Counselling Session", tag: "EVENT", group: "Events", tone: "purple", photo: "1519389950473-47ba0277781c" },
  { title: "Retail Skills Workshop", tag: "WORKSHOP", group: "Workshops", tone: "blue", photo: "1556742049-0cfed4f6a45d" },
  { title: "Hospitality Training Lab", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1577219491135-ce391730fb2c" },
  { title: "Placement Interview Round", tag: "PLACEMENT", group: "Placements", tone: "amber", photo: "1600880292203-757bb62b4baf" },
  { title: "Front Office Practical", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1414235077428-338989a2e8c0" },
  { title: "Tally & GST Workshop", tag: "WORKSHOP", group: "Workshops", tone: "blue", photo: "1581092918056-0c4c3acd3789" },
  { title: "Health & Safety Training", tag: "TRAINING", group: "Training Sessions", tone: "green", photo: "1576091160399-112ba8d25d1d" },
  { title: "Annual Day Celebration", tag: "EVENT", group: "Events", tone: "purple", photo: "1541339907198-e08756dedf3f" },
].map((item, index) => Object.assign({}, item, { index }, item.photo
  ? { caption: "Representative photo", full: unsplash(item.photo, 1400, 75), card: unsplash(item.photo, 600, 60), thumb: unsplash(item.photo, 200, 60) }
  : {}));

export const galleryFilters = ["All", "Events", "Training Sessions", "Workshops", "Placements", "Infrastructure"];

// Individual courses shown on course-details.html (?course=<slug>). category/tone match a
// homepage "Popular Learning Categories" card so course pages stay visually consistent with it.
export const courses = [
  {
    slug: "ccc-plus", title: "CCC+ – Advanced Computer Course", category: "NIELIT", tone: "blue",
    summary: "A government recognized course conducted by NIELIT. It builds basic knowledge of computers, internet, office productivity tools and digital services.",
    rating: 4.7, reviews: 184, hours: 80, students: "1.1k",
    highlights: ["Government Recognized", "Beginner Friendly", "Practical Learning", "Certification by NIELIT", "Useful for Jobs & Education"],
    learn: ["Fundamentals of Computers", "Operating System & File Management", "Word Processing, Spreadsheets & Presentations", "Internet & Email Usage", "Digital Services & Online Safety", "Basics of Information Technology", "Practical Hands-on Training", "Preparation for NIELIT CCC Examination"],
  },
  {
    slug: "digital-marketing", title: "Digital Marketing Fundamentals", category: "Other Skill Programs", tone: "amber",
    summary: "Short-term, industry-focused training in SEO, social media and online advertising to make you job-ready for digital marketing roles.",
    rating: 4.8, reviews: 320, hours: 60, students: "2.3k",
    highlights: ["Industry-Ready", "Hands-on Training", "Certification Support", "In-Demand Skills"],
    learn: ["Search Engine Optimization (SEO)", "Social Media Marketing", "Google & Meta Ads Basics", "Content & Email Marketing", "Analytics & Reporting"],
  },
  {
    slug: "web-designing", title: "Web Designing with HTML & CSS", category: "NIELIT", tone: "blue",
    summary: "Learn to design and build responsive websites from scratch using HTML, CSS and the fundamentals of modern web layout.",
    rating: 4.6, reviews: 210, hours: 60, students: "1.8k",
    highlights: ["Beginner Friendly", "Practical Learning", "Portfolio Projects", "Certification Support"],
    learn: ["HTML5 Structure & Semantics", "CSS3 Styling & Responsive Layout", "Forms & Basic Interactivity", "Publishing a Website", "Web Design Best Practices"],
  },
  {
    slug: "hs-cit", title: "HS-CIT – Haryana State Certificate in IT", category: "HKCL", tone: "purple",
    summary: "HKCL's flagship digital literacy course, recognized for Haryana Government jobs and further study within the state.",
    rating: 4.5, reviews: 260, hours: 90, students: "3k",
    highlights: ["Govt. Recognized in Haryana", "Digital Literacy", "Certification by HKCL", "Useful for State Jobs"],
    learn: ["Computer & Internet Basics", "Digital Payments & Governance Services", "Office Productivity Tools", "Online Safety & Etiquette", "HS-CIT Examination Preparation"],
  },
  {
    slug: "tally-gst", title: "Tally + GST", category: "Vocational & Safety Programs", tone: "rust",
    summary: "Practical accounting and GST compliance training on Tally, built for job-ready bookkeeping and small-business accounting skills.",
    rating: 4.6, reviews: 150, hours: 100, students: "1.4k",
    highlights: ["Job-Ready", "Practical Learning", "Certification Support"],
    learn: ["Tally Fundamentals & Ledgers", "Inventory & Billing", "GST Registration & Returns", "Payroll Basics", "Financial Statements in Tally"],
  },
  {
    slug: "online-degree", title: "UGC-Entitled Online Degree Programs", category: "Online Degree Programs", tone: "navy",
    summary: "UGC-entitled online degree programs from recognized universities, learn from anywhere on a flexible semester schedule.",
    rating: 4.5, reviews: 96, hours: null, students: "800",
    highlights: ["UGC Entitled", "Flexible Learning", "Recognized Universities", "Affordable Education"],
    learn: ["Semester-wise Curriculum (university-defined)", "Recorded & Live Online Classes", "Assignments & Proctored Exams", "Study Material & Library Access"],
  },
];

// Government schemes shown on the homepage, schemes.html and scheme-details.html (?scheme=<slug>).
// Distinct from the "awarding body" categories above (NIELIT/HARTRON/HKCL/etc.). Batch dates, eligibility and
// scheme details are unverified placeholders until the owner confirms them.
export const schemes = [
  {
    slug: "ddu-gky", short: "DDU-GKY", tone: "purple", tag: "Rural Youth | Better Career",
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana", authority: "Ministry of Rural Development, Government of India",
    summary: "A placement-linked skill development programme for rural youth, offering free training, stipend support and industry-approved courses.",
    photo: "1522071820081-009f0129c71c",
    highlights: ["Ministry of Rural Development", "Free Quality Training", "Stipend & Placement Support", "Industry Approved Courses"],
    tiles: [["Government Initiative", "Supported by the Ministry of Rural Development"], ["Rural Youth Focus", "Training for youth from rural households"], ["Skill-Based Training", "Practical and industry-relevant training"], ["Employment Focused", "Placement-linked programme"]],
    eligibility: ["Indian citizen", "Rural youth, age 15–35 years", "Poor household as per SECC data"],
    careerCourses: [
      { name: "Retail & Customer Care", desc: "Sales floor, billing and customer handling skills.", tone: "purple", photo: "1556742049-0cfed4f6a45d" },
      { name: "Hospitality Assistant", desc: "Guest service and basic hospitality operations.", tone: "green", photo: "1414235077428-338989a2e8c0" },
      { name: "IT & Digital Skills", desc: "Computer basics, office tools and digital services.", tone: "blue", photo: "1522071820081-009f0129c71c" },
      { name: "Healthcare Assistant", desc: "Patient care basics and clinic support skills.", tone: "rust", photo: "1576091160399-112ba8d25d1d" },
    ],
    batches: [["Retail & Customer Care", "10 Mar 2026", "15 Apr 2026", "20 May 2026", "25 Jun 2026", "Available"], ["Hospitality Assistant", "12 Mar 2026", "18 Apr 2026", "22 May 2026", "28 Jun 2026", "Available"], ["IT & Digital Skills", "15 Mar 2026", "20 Apr 2026", "25 May 2026", "30 Jun 2026", "Upcoming"]],
  },
  {
    slug: "pmkvy", short: "PMKVY", tone: "amber", tag: "Skill. Employ. Empower.",
    name: "Pradhan Mantri Kaushal Vikas Yojana", authority: "Ministry of Skill Development & Entrepreneurship, Government of India",
    summary: "India's flagship skill certification scheme, offering short-term training and monetary reward on successful assessment and certification.",
    photo: "1600880292203-757bb62b4baf",
    highlights: ["Ministry of Skill Development", "Short Term Skill Training", "Industry Relevant Courses", "Certification by Govt. of India"],
    tiles: [["Government Initiative", "Ministry of Skill Development & Entrepreneurship"], ["Short-Term Training", "Quick, job-focused courses"], ["Skill-Based Training", "Practical and industry-relevant training"], ["Certification", "Certified by Government of India"]],
    eligibility: ["Indian citizen", "Unemployed or school/college dropout", "Minimum age 18 years"],
    careerCourses: [
      { name: "IT & Digital Skills", desc: "Computer operation and digital literacy.", tone: "blue", photo: "1522071820081-009f0129c71c" },
      { name: "Retail & Customer Care", desc: "Retail operations and service skills.", tone: "amber", photo: "1556742049-0cfed4f6a45d" },
      { name: "Beauty & Wellness", desc: "Salon skills and personal care services.", tone: "purple", photo: "1560066984-138dadb4c035" },
      { name: "Construction & Electric", desc: "Site safety and basic electrical work.", tone: "rust", photo: "1504307651254-35680f356dfd" },
    ],
    batches: [["IT & Digital Skills", "10 Mar 2026", "15 Apr 2026", "20 May 2026", "25 Jun 2026", "Available"], ["Retail & Customer Care", "12 Mar 2026", "18 Apr 2026", "22 May 2026", "28 Jun 2026", "Available"], ["Beauty & Wellness", "15 Mar 2026", "20 Apr 2026", "25 May 2026", "30 Jun 2026", "Upcoming"]],
  },
  {
    slug: "hsrt", short: "HSRT", tone: "green", tag: "Hospitality Skills for a Bright Career",
    name: "Hunnar Se Rozgar Tak", authority: "Ministry of Tourism, Government of India",
    summary: "Hunnar Se Rozgar Tak (HSRT) is a skill development initiative by the Ministry of Tourism, Government of India, focused on creating employment opportunities for youth through practical training in the hospitality sector.",
    photo: "1577219491135-ce391730fb2c",
    highlights: ["Hospitality & Tourism Sector", "Practical Hands-on Training", "Industry Exposure", "Job-oriented Programmes"],
    tiles: [["Government Initiative", "Supported by Ministry of Tourism, Govt. of India"], ["Hospitality Sector", "Focus on tourism & hospitality industry"], ["Skill-Based Training", "Practical and industry-relevant training"], ["Employment Focused", "Build skills for a better future"]],
    eligibility: ["Indian citizen", "Minimum age 18 years (as per scheme guidelines)", "Educational qualification: 10th pass or above (as per course requirements)"],
    careerCourses: [
      { name: "Multi Cuisine Cook", desc: "Professional food preparation, kitchen operations and culinary skills.", tone: "rust", photo: "1577219491135-ce391730fb2c" },
      { name: "Front Office Associate", desc: "Guest handling, reception, reservations and front-office operations.", tone: "blue", photo: "1414235077428-338989a2e8c0" },
      { name: "F&B Service – Steward", desc: "Food & beverage service and guest management.", tone: "green", photo: "1551434678-e076c223a692" },
      { name: "Room Attendant", desc: "Housekeeping operations, room servicing and hospitality standards.", tone: "purple", photo: "1519389950473-47ba0277781c" },
    ],
    batches: [["Multi Cuisine Cook", "10 Mar 2026", "15 Apr 2026", "20 May 2026", "25 Jun 2026", "Available"], ["Front Office Associate", "12 Mar 2026", "18 Apr 2026", "22 May 2026", "28 Jun 2026", "Available"], ["F&B Service – Steward", "15 Mar 2026", "20 Apr 2026", "25 May 2026", "30 Jun 2026", "Upcoming"], ["Room Attendant", "18 Mar 2026", "24 Apr 2026", "29 May 2026", "05 Jul 2026", "Upcoming"]],
  },
  {
    slug: "other-skill", short: "Other Skill Courses", tone: "blue", tag: "Learn New Skills. Build Your Future.",
    name: "Other Skill Development Courses", authority: "OM Academy, industry-oriented short courses",
    summary: "Short-term, customized courses across multiple industry domains for students who don't fall under a specific government scheme.",
    photo: "1544197150-b99a580bb7a8",
    highlights: ["Short Term / Customized Courses", "Multiple Industry Domains", "Practical & Job-focused Training", "Certification Support"],
    tiles: [["Flexible Duration", "Short-term and customized courses"], ["Multiple Domains", "IT, marketing, accounting and more"], ["Skill-Based Training", "Practical and job-focused"], ["Certification Support", "Guidance for recognized certificates"]],
    eligibility: ["Open to all students, no scheme-specific eligibility"],
    careerCourses: [
      { name: "Digital Marketing Fundamentals", desc: "SEO, social media and online advertising.", tone: "amber", photo: "1657812670261-7b76ba04525c" },
      { name: "Web Designing with HTML & CSS", desc: "Build responsive websites from scratch.", tone: "blue", photo: "1522071820081-009f0129c71c" },
      { name: "Tally + GST", desc: "Accounting and GST compliance on Tally.", tone: "rust", photo: "1581092918056-0c4c3acd3789" },
    ],
    batches: [["Digital Marketing Fundamentals", "10 Mar 2026", "15 Apr 2026", "20 May 2026", "25 Jun 2026", "Available"], ["Web Designing with HTML & CSS", "12 Mar 2026", "18 Apr 2026", "22 May 2026", "28 Jun 2026", "Available"], ["Tally + GST", "15 Mar 2026", "20 Apr 2026", "25 May 2026", "30 Jun 2026", "Upcoming"]],
  },
];

// "Popular Job Roles & Training Domains" tiles on the homepage.
export const jobRoles = [
  { title: "Hospitality & Tourism", icon: "chef", blurb: "Cook, front office, F&B service and housekeeping careers.", tags: ["Multi Cuisine Cook", "Front Office", "Steward"], href: "scheme-details.html?scheme=hsrt", photo: "1577219491135-ce391730fb2c" },
  { title: "IT & Digital Skills", icon: "monitor", blurb: "CCC, HS-CIT and web skills for office and digital jobs.", href: "course-details.html?course=ccc-plus", photo: "1522071820081-009f0129c71c" },
  { title: "Retail & Customer Care", icon: "bag", blurb: "Sales floor, billing and service roles.", href: "scheme-details.html?scheme=pmkvy", photo: "1556742049-0cfed4f6a45d" },
  { title: "Healthcare", icon: "pulse", blurb: "Patient care and clinic support assistants.", href: "scheme-details.html?scheme=ddu-gky", photo: "1576091160399-112ba8d25d1d" },
  { title: "Beauty & Wellness", icon: "sparkle", blurb: "Salon, spa and personal care services.", href: "scheme-details.html?scheme=pmkvy", photo: "1560066984-138dadb4c035" },
  { title: "Construction & Electric", icon: "wrench", blurb: "Site safety, wiring and technician roles.", href: "scheme-details.html?scheme=pmkvy", photo: "1504307651254-35680f356dfd" },
];

export const stockPhoto = (id, width = 600, quality = 60) => "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=" + quality;

// Important dates shown on the homepage Announcements panel and on important-dates.html.
// date is "DD Mon YYYY" (same format as announcements); category groups the filters/calendar dots.
export const importantDates = [
  { date: "23 Aug 2026", time: "11:59 PM", title: "Last Date to Submit Scholarship Form", category: "Scholarship", desc: "Submit your application under the SAFAL Scholarship Scheme." },
  { date: "25 Aug 2026", time: "All Day", title: "New Batch Classes Commence", category: "Admissions", desc: "New batch classes for all selected courses will commence." },
  { date: "31 Aug 2026", time: "11:59 PM", title: "Last Date for Admission (Current Batch)", category: "Admissions", desc: "Last date to complete the admission process for the current batch." },
  { date: "05 Sep 2026", time: "10:00 AM", title: "Orientation Program", category: "Events", desc: "Orientation program for new students." },
  { date: "15 Sep 2026", time: "All Day", title: "Internal Assessment – I", category: "Exams", desc: "First internal assessment for all ongoing batches." },
  { date: "02 Oct 2026", time: "11:59 PM", title: "Fee Payment Last Date", category: "Admissions", desc: "Last date for payment of course fee without late fee." },
];

export const importantDateFilters = ["All Dates", "Admissions", "Exams", "Scholarship", "Events", "Holidays"];

// Colour per important-date category: a .tone-* class from scss/components/_tones.scss.
export const dateTones = {
  Admissions: "green",
  Exams: "blue",
  Scholarship: "amber",
  Events: "purple",
  Holidays: "rust",
};
