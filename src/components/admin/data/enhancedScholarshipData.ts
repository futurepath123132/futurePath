import type { Scholarship } from '../ScholarshipDialog';

type ProgramLevel = "BS" | "MS" | "PhD" | "Diploma" | "Certificate";

// Enhanced scholarship data with detailed descriptions and structured eligibility
export const enhancedScholarships: Partial<Scholarship>[] = [
    // BNU Scholarships
    {
        title: 'BNU Scholarship for National Talent',
        description: `**About the Scholarship**

Beaconhouse National University (BNU) proudly offers 100 fully funded scholarships through the BNU Scholarship for National Talent program, designed to empower bright, deserving students from across Pakistan to pursue their dreams of higher education.

**Benefits**
• 100% tuition fee waiver for the entire duration of the program
• Access to world-class faculty and facilities at BNU
• Opportunity to study in a vibrant, multicultural environment
• Special mentorship and career guidance support
• Priority consideration for on-campus accommodation

**Application Process**
1. Apply through BNU Fall 2025 Regular Admissions
2. Submit scholarship application form along with required financial documents
3. Applicants will be evaluated based on financial need and academic merit
4. Selected candidates will be notified via email`,
        eligibility: `**Basic Requirements**
• Must be admitted through Fall 2025 Regular Admissions at BNU
• Pakistani nationals only
• Demonstrated financial need

**Preferred Candidates**
• Female applicants (given special preference)
• Students from remote or underrepresented regions
• Students from marginalized communities

**Academic Criteria**
• Good academic standing in previous examinations
• Meet BNU's standard admission requirements for the chosen program

**Retention Requirements**
• Maintain satisfactory academic performance throughout the program
• Continue to demonstrate financial need
• Adhere to BNU's code of conduct and scholarship policies`
    },
    {
        title: "Chief Minister's Honhaar Undergraduate Scholarship Program",
        description: `**About the Scholarship**

The Chief Minister's Honhaar Undergraduate Scholarship Program is a prestigious government initiative offering 30,000 scholarships to talented students pursuing undergraduate degrees at leading universities across Punjab, including BNU.

**Benefits**
• Full tuition fee coverage for the entire undergraduate program
• Recognition as a Honhaar Scholar
• Access to exclusive networking opportunities
• Government certification upon completion
• No repayment required (fully funded grant)

**Application Process**
1. Apply online via Punjab HEC portal at https://honhaarscholarship.punjabhec.gov.pk
2. Submit required documents (CNIC, domicile, income certificate, admission letter)
3. Applications reviewed by provincial scholarship committee
4. Shortlisted candidates may be called for verification
5. Final selection announced on official portal
6. Last date to apply: September 15, 2025`,
        eligibility: `**Eligibility Criteria**
• Must be a Pakistani national with Punjab domicile
• Enrolled or seeking admission in an undergraduate program at BNU or other partner universities
• Family income below specified threshold (check portal for current limits)

**Academic Requirements**
• Meet the admission criteria of the chosen university/program
• Maintain minimum GPA as specified by the program (typically 2.5 or higher)

**Documentation Required**
• Valid CNIC (Computerized National Identity Card)
• Punjab domicile certificate
• Family income certificate
• Admission/acceptance letter from university
• Academic transcripts and certificates

**Continuation Requirements**
• Maintain regular attendance (minimum 75%)
• Achieve satisfactory academic progress each semester
• Annual renewal subject to performance review`
    },
    {
        title: 'BNU VC Scholarship',
        description: `**About the Scholarship**

The Vice Chancellor Scholarship is BNU's most prestigious merit-based scholarship, recognizing and supporting exceptional academic achievers who demonstrate outstanding performance in their pre-university education.

**Benefits**
• 100% tuition fee waiver for the complete program duration
• Recognition at university convocation ceremonies
• Mentorship from senior faculty members
• Priority access to research opportunities
• Certificate of academic excellence

**Application Process**
1. No separate application required
2. Automatically considered upon admission if criteria are met
3. Submit personal statement highlighting achievements
4. University scholarship committee reviews eligible candidates
5. Announcement of awards before semester commencement`,
        eligibility: `**Academic Excellence Requirements**
• 3 A*s in A-Level (all three complete subjects) OR
• 90% or above marks in Intermediate (FA/FSc) or equivalent examination

**Mandatory Submissions**
• Personal statement (maximum 500 words)
• Academic transcripts from all previous institutions
• Two letters of recommendation (optional but encouraged)

**Performance Standards**
• Maintain minimum CGPA of 3.2 in each semester to continue receiving scholarship
• Full-time enrollment required (minimum credit hours as per program requirements)
• No academic probation or disciplinary actions

**Selection Criteria**
• Academic performance (70% weightage)
• Personal statement quality (20% weightage)
• Extracurricular achievements (10% weightage)`
    },
    {
        title: "BNU Dean's Scholarship",
        description: `**About the Scholarship**

The Dean's Scholarship is a comprehensive need-cum-merit based award that recognizes talented students who demonstrate both academic excellence and financial need, ensuring that deserving candidates can access quality education at BNU.

**Benefits**
• 100% tuition fee coverage
• Renewable annually based on performance
• Access to academic support services
• Career counseling and placement assistance
• Networking with Dean's Scholars community

**Application Process**
1. Submit scholarship application during admission process
2. Provide complete financial documentation
3. Appear for BNU Admissions Test/Interview
4. Submit portfolio (for relevant programs)
5. Scholarship committee evaluates applications
6. Results announced with admission decisions`,
        eligibility: `**Composite Score Requirement**
• Minimum 80% aggregate score calculated as:
  - 35% weightage: Matric/O-Level marks
  - 35% weightage: Intermediate/A-Level marks  
  - 30% weightage: BNU Admissions Test/Interview and portfolio

**Financial Need**
• Demonstrated financial hardship (mandatory prerequisite)
• Family income documentation required
• Assets and liabilities declaration
• Priority given to students from low-income backgrounds

**Merit Requirements**
• Must meet department-specific merit-based scholarship eligibility criteria
• Minimum academic standards vary by program
• Strong performance in BNU entrance assessment

**Continuation Policy**
• Maintain satisfactory CGPA (varies by program, typically 2.65-3.0)
• Regular semester enrollment
• Annual financial need verification
• Good disciplinary standing`
    },
    {
        title: 'BNU Merit Based Scholarship',
        description: `**About the Scholarship**

BNU's Merit-Based Scholarship program automatically rewards academic excellence, recognizing students' previous educational achievements with substantial tuition support ranging from 50% to 75% based on their academic performance.

**Benefits**
• 75% tuition fee waiver for students with 90%+ or 3 A's in A-Level
• 50% tuition fee waiver for students with 80%+ or 2 A's in A-Level
• Automatically awarded - no separate application needed
• Renewable each semester based on academic performance
• Recognition as Merit Scholar

**Application Process**
1. No separate application required
2. Automatically determined during admission process
3. University evaluates academic transcripts
4. Award notification included with admission letter
5. Scholarship activated upon enrollment confirmation

**For Graduate Programs**
• 75% scholarship for 3.9+ CGPA in undergraduate degree
• 50% scholarship for 3.8+ CGPA in undergraduate degree`,
        eligibility: `**Undergraduate Programs**

*For 75% Scholarship:*
• 90% or above marks in FA/FSc examination OR
• 3 A's in A-Level or equivalent international qualification

*For 50% Scholarship:*
• 80% or above marks in FA/FSc examination OR
• 2 A's in A-Level or equivalent international qualification

**Graduate Programs (Masters/MS)**

*For 75% Scholarship:*
• CGPA of 3.9 or above in 16-year undergraduate degree

*For 50% Scholarship:*
• CGPA of 3.8 or above in 16-year undergraduate degree

**Retention Criteria**
• Maintain program-specific minimum CGPA
• Full-time student status required
• Automatic renewal each semester if criteria maintained
• No separate renewal application needed

**Note:** Scholarship percentage is fixed based on entry qualifications and does not increase or decrease during studies.`
    },
    {
        title: 'PEEF Scholarships for Arts & Culture',
        description: `**About the Scholarship**

BNU partners with the Pakistan Education Endowment Fund (PEEF), supported by the Ministry of Federal Education & Professional Training, to offer 100% tuition and hostel fee waivers for talented students in arts and culture programs.

**Benefits**
• 100% tuition fee waiver (50% PEEF + 50% BNU contribution)
• Hostel fees covered (where applicable)
• Duration: Full program length (typically 4 years)
• Federal government backing and support
• Access to exclusive PEEF scholar network

**Application Process**
1. Download PEEF Scholarship Form from BNU website
2. Complete application with all required documents
3. Submit to Registrar's Office before deadline (typically October)
4. Financial background verification by PEEF and BNU
5. Shortlisted candidates may be interviewed
6. Results announced within 4-6 weeks

**Contact Information**
• Ms. Somia Maqsood, Assistant Registrar
• Email: somia.maqsood@bnu.edu.pk
• Phone: 042-38100156, Ext: 312`,
        eligibility: `**Program-Specific Eligibility**
• Must be enrolled in approved disciplines at BNU:
  - Mariam Dawood School of Visual Arts & Design
  - Department of Theater, Film and TV (School of Media & Mass Communication)
  - Department of Liberal Arts (Seeta Majeed School of Liberal Arts and Social Sciences)

**Basic Requirements**
• Pakistani national (mandatory)
• Full-time enrollment in 4 or 5-year undergraduate program
• Admission secured as per BNU's admission policy

**Financial Criteria**
• Demonstrated financial need as per BNU and PEEF assessment
• Family income below specified threshold
• Not receiving any other educational scholarship in the current academic year

**Performance Requirements (For Continuation)**
• Minimum 75% attendance in all courses
• Minimum 60% academic performance each semester
• Good conduct and disciplinary record

**Required Documents**
• Completed PEEF application form
• Income declaration and undertaking
• Family income certificate
• CNIC copies of student and parents/guardians
• Domicile certificate
• Academic transcripts`
    },
    {
        title: 'Madanjeet Singh Art Scholarships',
        description: `**About the Scholarship**

The Madanjeet Singh Art Scholarships, awarded by the South Asia Foundation, represent a remarkable regional initiative that brings together talented art students from eight South Asian countries to study at BNU with full financial support.

**Benefits**
• Complete tuition fee coverage for entire program
• Living expenses and accommodation support
• International exposure and cross-cultural learning
• Access to BNU's state-of-the-art art facilities
• Networking with artists across South Asia
• Travel and visa support (for international students)

**Application Process**
1. Contact South Asia Foundation or BNU International Office
2. Submit portfolio of artistic work
3. Provide academic transcripts and achievements
4. Complete scholarship application form
5. May require virtual or in-person interview
6. Selection by joint committee

**Regional Integration**
• Part of South Asia Foundation's regional scholarship program
• Promotes cultural exchange and artistic collaboration
• Students join diverse cohort from multiple countries`,
        eligibility: `**Nationality Requirements**
Eligible candidates must be nationals of:
• Afghanistan
• Bangladesh  
• Bhutan
• India
• Maldives
• Nepal
• Pakistan
• Sri Lanka

**Academic & Artistic Criteria**
• Demonstrated exceptional talent in visual arts or fine arts
• Strong portfolio showcasing original artwork
• Meeting BNU's admission requirements for art programs
• Good academic record from previous institutions

**Portfolio Requirements**
• 10-15 original artworks (physical or high-quality digital)
• Artist statement explaining creative vision
• Description of each work (medium, dimensions, inspiration)
• Letters of recommendation from art teachers/mentors

**Program Enrollment**
• Must be enrolled in or seeking admission to BNU art programs
• Full-time student status required
• Commitment to complete the entire program

**Selection Criteria**
• Artistic talent and creativity (60%)
• Academic performance (25%)
• Financial need (10%)
• Diversity and regional representation (5%)`
    },

    // FAST (NU) Scholarships
    {
        title: 'FAST Merit Scholarship for Bachelor Students',
        description: `**About the Scholarship**

FAST National University's flagship Merit Scholarship program recognizes and rewards Pakistan's top performing students with comprehensive four-year tuition support, fostering academic excellence in technology and computing fields.

**Benefits**
• Complete tuition fee waiver for 4 years of uninterrupted studies
• Full course load support
• Recognition at university events
• Access to research and internship opportunities
• Merit Scholar status and certification

**Application Process**
1. No separate application required for board position holders
2. For admission merit list toppers: automatic consideration during admission
3. Verification of board position or admission test performance
4. Scholarship activated upon enrollment
5. Must maintain minimum GPA for continuation`,
        eligibility: `**Eligibility Pathways**

**Board Position Holders:**
• Top 3 position holders from each Examination Board in the year of admission
• Must have appeared in SSC and HSSC examinations
• Position certificate from board required

**FAST Admission Merit:**
• Top 3 position holders in FAST admission merit list
• Based on entrance test, interview, and academic record composite score
• Applies to all FAST campuses

**Academic Requirements**
• Must be enrolled in a Bachelor's degree program
• Full course load required each semester
• No backlog courses or academic violations

**Performance Standards**
• Maintain semester GPA of 3.0 or higher
• Any semester below 3.0 results in scholarship termination
• No probation or disciplinary actions
• Regular attendance and participation

**Duration**
• Maximum 4 years for uninterrupted studies
• Additional semesters due to fails/drops not covered
• No gap years allowed during scholarship period`
    },
    {
        title: 'HEC Scholarships for MS and PhD',
        description: `**About the Scholarship**

The Higher Education Commission provides comprehensive financial support for graduate students pursuing advanced degrees at FAST, covering all major expenses through a fully-funded scholarship package that enables students to focus entirely on their research and studies.

**Benefits**
• Complete tuition fee coverage for entire program duration
• Monthly stipend for living expenses
• Book and research material allowance
• Access to HEC digital library and resources
• Conference participation support
• Research funding for thesis/dissertation

**Application Process**
1. Apply for admission to MS or PhD program at FAST
2. Submit HEC scholarship application on HEC portal
3. Provide academic transcripts and research proposal
4. Await HEC scholarship committee decision
5. If selected, sign scholarship agreement
6. Monthly stipend disbursed through university

**Additional Support**
• Possibility of research assistantship
• Teaching assistantship opportunities
• Access to HEC faculty development programs`,
        eligibility: `**Program Requirements**
• Must be admitted to MS or PhD program at FAST National University
• Pakistani nationals given priority
• Full-time enrollment required

**MS Program Eligibility**
• Minimum CGPA of 3.0 in 16-year Bachelor's degree OR
• Minimum CGPA of 2.5 with 60% marks in GAT-General
• Strong academic background in relevant field

**PhD Program Eligibility**
• Minimum CGPA of 3.0 in 18-year MS/MPhil degree
• Valid GAT-Subject score (minimum 60%)
• Research proposal approval by academic committee

**Merit Criteria**
• Academic performance in previous degrees
• Research potential and publications (for PhD)
• GAT scores
• Recommendation letters from faculty

**Continuation Requirements**
• Maintain minimum CGPA (3.0 for MS, 3.0 for PhD)
• Satisfactory research progress
• Timely thesis/dissertation submission
• Follow HEC and university guidelines
• Annual progress reports to HEC

**Commitment**
• Complete program within stipulated time
• May require teaching or research assistant duties
• Post-graduation service bond may apply (check HEC policy)`
    },
    {
        title: 'Punjab Educational Endowment Fund (PEEF)',
        description: `**About the Scholarship**

The Government of Punjab's PEEF scholarship provides crucial financial assistance to deserving students with Punjab domicile, supplemented by FAST's Qarz-e-Hasna (interest-free loan) to cover remaining tuition, making quality education accessible to indigent students.

**Benefits**
• Covers significant portion of tuition fee for 4 years
• Remaining amount available as Qarz-e-Hasna from FAST
• Renewable annually based on performance
• Provincial government backing
• No interest charges on university loan portion

**Application Process**
1. Newly admitted students apply through PEEF portal
2. Submit income and domicile documents
3. PEEF committee evaluates financial need
4. Selected students receive PEEF portion
5. FAST covers remaining through Qarz-e-Hasna
6. Annual renewal application required`,
        eligibility: `**Domicile Requirement**
• Must hold valid Punjab domicile certificate (mandatory)
• Available to students at any FAST campus
• Priority for students from underdeveloped areas

**Financial Criteria**
• Family income below PEEF threshold (updated annually)
• Demonstrated financial hardship
• Unable to afford university tuition
• Assets and income declaration required

**Academic Requirements**
• Newly admitted students in undergraduate programs
• Meet FAST's admission criteria
• Maintain satisfactory academic performance

**Application Timeline**
• Apply immediately after securing admission
• Early application recommended (limited slots)
• Complete documentation required for processing

**Renewal Conditions**
• Satisfactory academic progress (typically CGPA 2.5+)
• Continued financial need
• Regular enrollment without long gaps
• Submit renewal application before each academic year

**Loan Component (Qarz-e-Hasna)**
• Interest-free loan from FAST
• Covers tuition not covered by PEEF
• Repayment schedule agreed upon graduation
• Flexible repayment terms for genuine hardship cases`
    },
    {
        title: 'Sindh Government Endowment Board Scholarship',
        description: `**About the Scholarship**

The Sindh Government Endowment Board offers comprehensive tuition support to deserving students at FAST Karachi campus, with a special focus on rural areas to promote educational equity across Sindh province.

**Benefits**
• Complete tuition fee coverage for program duration
• Renewable every year subject to performance
• Available for both undergraduate and graduate studies
• Provincial government guarantee
• No repayment required

**Application Process**
1. Apply through FAST Karachi campus during admission
2. Submit Sindh domicile and income documentation
3. Appear for need-cum-merit assessment interview
4. Scholarship board makes final selection
5. Approximately 25 new scholarships awarded annually

**Rural-Urban Distribution**
• 60% quota reserved for rural sector students
• 40% quota for urban sector students
• Ensures equitable access across Sindh`,
        eligibility: `**Location & Domicile**
• Must be enrolled at FAST Karachi campus only
• Valid Sindh domicile required (mandatory)
• Preference for rural areas (60% quota)

**Program Eligibility**
• Available for undergraduate (BS) programs
• Also available for graduate (MS/PhD) studies
• Full-time enrollment required

**Selection Criteria**
• Need-cum-merit basis evaluation
• Financial need assessment (60% weightage)
• Academic merit (30% weightage)
• Interview performance (10% weightage)

**Rural vs Urban Quota**
• Rural sector: 60% of total slots (15 scholarships)
• Urban sector: 40% of total slots (10 scholarships)
• Rural classification as per government definition

**Financial Requirements**
• Family income below specified threshold
• Income certificate from relevant authority
• Asset declaration
• Sindh resident proof

**Academic Standards**
• Meet FAST admission requirements
• Maintain minimum CGPA for renewal (typically 2.5-3.0)
• Regular attendance and good conduct
• Progress through program without excessive delays

**Annual Renewal**
• Submit renewal application each year
• Updated income documentation
• Academic transcript from previous year
• Scholarship committee review and approval`
    },
    {
        title: 'Khyber Pakhtunkhwa Education Foundation Scholarship',
        description: `**About the Scholarship**

The KP Government's scholarship program supports talented students from Khyber Pakhtunkhwa at FAST Peshawar campus, with equal gender representation ensuring both male and female students have equal access to quality technical education.

**Benefits**
• 80% tuition fee coverage for entire program duration
• Equal opportunities for male and female students
• Provincial government support
• Available for BS and MS programs
• Renewable annually

**Application Process**
1. Apply online through KPEF website after admission call
2. Submit application with required documents
3. Appear for campus interview at FAST Peshawar
4. Interview assesses need and merit
5. Selection results announced on KPEF website`,
        eligibility: `**Domicile Requirement**
• Valid Khyber Pakhtunkhwa domicile (mandatory)
• Enrolled at FAST Peshawar campus only
• KP residents given exclusive access

**Gender Equality**
• Equal male to female ratio maintained
• 50% scholarships reserved for female students
• 50% scholarships reserved for male students
• Promotes gender balance in technical education

**Program Coverage**
• Bachelor's (BS) degree programs
• Master's (MS) degree programs
• Must be enrolled as full-time student

**Selection Criteria**
• Need-cum-merit basis
• Financial need assessment
• Academic performance evaluation
• Interview performance
• Separate merit lists for male and female candidates

**Financial Assessment**
• Family income certificate required
• Income must be below KP Education Foundation threshold
• Complete financial documentation
• Priority for low-income families

**Academic Requirements**
• Meet FAST Peshawar admission criteria
• Maintain satisfactory CGPA (varies by program)
• Regular attendance and class participation
• Good disciplinary record

**Application Process**
• Apply directly on KPEF website
• Application opens after annual call announcement
• Complete online form with accurate information
• Upload all required documents
• Attend campus interview when called

**Coverage Details**
• 80% of tuition fees covered by scholarship
• Remaining 20% student's responsibility
• Students may seek additional support for remaining amount`
    },

    // UCP Scholarships
    {
        title: 'UCP Merit-Based Scholarship',
        description: `**About the Scholarship**

The University of Central Punjab's Merit-Based Scholarship recognizes and rewards academic excellence across all programs, offering substantial tuition reductions to high-achieving students in both undergraduate and graduate studies.

**Benefits**
• Up to 75% tuition fee reduction
• Automatic consideration during admission
• Available for both undergraduate and graduate programs
• Merit-based - no financial documentation needed
• Renewable each semester based on CGPA

**Scholarship Tiers**

*Undergraduate Programs:*
• 75% scholarship: 80% or above marks
• 50% scholarship: 75% or above marks
• 12.5% scholarship: Meeting admission criteria

*MBA/MS Programs:*
• 75% scholarship: CGPA 3.80+ in 16-year degree
• 50% scholarship: CGPA 3.50-3.79
• 25% scholarship: CGPA 3.00-3.49

**Application Process**
• No separate application required
• Automatically evaluated during admission
• Award mentioned in admission/acceptance letter
• Activated upon fee payment and enrollment`,
        eligibility: `**Undergraduate Programs**

*For 75% Scholarship:*
• 80% or above marks in Intermediate/FA/FSc
• Equivalency certificate for international qualifications
• Must meet program admission requirements

*For 50% Scholarship:*
• 75% or above marks in Intermediate/FA/FSc
• Good academic standing
• Clear admission to chosen program

**Graduate Programs (MBA/MS/M.Phil)**

*For 75% Scholarship:*
• CGPA 3.80 or above in 16-year Bachelor's degree
• Relevant undergraduate degree
• Meet MBA/MS admission requirements

*For 50% Scholarship:*
• CGPA 3.50-3.79 in Bachelor's degree

*For 25% Scholarship:*
• CGPA 3.00-3.49 in Bachelor's degree

**Continuation Requirements**

*For 50% Scholarships:*
• Maintain CGPA of 3.00 or higher

*For 25% Scholarships:*
• Maintain CGPA between 2.00-3.00

*Credit Hour Requirements:*
• Must complete minimum of 9 credit hours to avail merit scholarship in subsequent semesters
• Full-time student status required

**PGC Students (Punjab Group of Colleges)**
• Special 50% scholarship for PGC students
• Maintain CGPA 3.00 or higher
• Entering specified faculties

**Important Notes**
• Merit scholarships cannot be combined with other concessions
• Performance-based scholarships available after first semester (up to 50% for CGPA 3.5+)
• Scholarship recalculated each semester based on cumulative GPA`
    },
    {
        title: 'UCP Need-Based Scholarship',
        description: `**About the Scholarship**

UCP's Need-Based Scholarship program ensures that financial constraints do not prevent talented students from accessing quality education, with awards ranging from 25% to 100% based on individual family circumstances evaluated by a dedicated scholarship committee.

**Benefits**
• Financial assistance from 25% up to 100% of tuition
• Available for all undergraduate programs
• Tailored to individual financial situations
• Renewable annually with performance maintenance
• No repayment required

**Application Process**
1. Fill out need-based scholarship form on UCP Admission Portal
2. Submit complete financial documentation
3. Provide income certificates, asset statements
4. Scholarship committee evaluates case individually
5. Decision communicated within 2-3 weeks
6. May require interview or home verification

**Committee Evaluation**
• Case-by-case assessment
• Family income and expenses reviewed
• Number of dependents considered
• Overall financial situation analyzed`,
        eligibility: `**Program Eligibility**
• Available exclusively for undergraduate programs
• Full-time enrollment required
• Pakistani nationals preferred

**Financial Criteria**
• Demonstrated financial hardship (mandatory)
• Family income below specified threshold
• Unable to afford full tuition fees
• Complete financial disclosure required

**Required Documentation**
• Need-based scholarship application form (from UCP portal)
• Family income certificate from relevant authority
• Salary slips or income proof of parents/guardians
• Utility bills and rent agreements
• Asset declaration
• CNIC copies of student and parents
• Any other financial documents requested

**Academic Requirements**
• Must meet UCP admission requirements
• Maintain minimum CGPA of 2.50 or higher
• Regular attendance required
• Good disciplinary standing

**Workload Requirements for Continuation**
• Minimum 30 credit hours workload in two consecutive semesters
• Satisfactory academic progress required
• Full course load as per program requirements

**Priority Consideration**
• Orphans and students with single parents
• Students from economically disadvantaged backgrounds
• Families with multiple dependents
• First-generation university students
• Students with deceased parent/guardian (SSDP program)

**Scholarship Range**
• Committee determines percentage (25%-100%)
• Based on severity of financial need
• No predetermined fixed amounts
• Personalized evaluation

**Renewal Process**
• Annual renewal application required
• Updated financial documents
• Academic transcript from previous year
• Continued financial need verification
• Maintain 2.50+ CGPA mandatory`
    },
    {
        title: 'UCP Scholarship for Gilgit-Baltistan Students',
        description: `**About the Scholarship**

Recognizing the unique challenges faced by students from Gilgit-Baltistan, UCP offers a dedicated regional scholarship providing a 30% tuition reduction to encourage and support talented students from this region to pursue higher education.

**Benefits**
• 30% tuition fee waiver for program duration
• Available for undergraduate and graduate programs
• Simple eligibility criteria
• Regional development support
• Automatic consideration with domicile

**Application Process**
1. Submit valid Gilgit-Baltistan domicile during admission
2. No separate scholarship application needed
3. Discount automatically applied upon verification
4. Activated with admission confirmation
5. Renewable each semester`,
        eligibility: `**Domicile Requirement**
• Valid Gilgit-Baltistan domicile certificate (mandatory)
• Must be submitted during admission process
• Original document verification required

**Program Coverage**
• All undergraduate (BS/BBA/etc.) programs
• MBA programs
• MS/M.Phil programs
• Full-time enrollment required

**Academic Requirements**
• Meet UCP's standard admission criteria for chosen program
• No additional academic requirements beyond normal admission
• Maintain satisfactory academic performance

**Regional Focus**
• Exclusive to Gilgit-Baltistan domicile holders
• Supports regional educational development
• Promotes diversity at UCP

**Continuation Requirements**
• Maintain regular enrollment
• Satisfactory academic performance
• No specific CGPA requirement mentioned
• Good disciplinary standing
• Continued GB domicile validity

**Combination with Other Awards**
• Check with admission office about combining with other scholarships
• Some restrictions may apply
• Merit scholarships may have different policies

**Additional Information**
• Part of UCP's regional diversity initiative
• Encourages students from GB to pursue quality education
• Fixed 30% reduction - does not vary by financial need or merit
• Applied semester by semester upon enrollment`
    },

    // NCA Scholarships
    {
        title: 'NCA Endowment Fund Scholarship',
        description: `**About the Scholarship**

The National College of Arts Endowment Fund represents the institution's commitment to supporting talented artists and designers regardless of financial background, providing need and merit-based support to students across all NCA departments.

**Benefits**
• Variable scholarship amounts based on need and merit
• Available to students from all departments
• Institutional financial support
• Access to NCA's world-class arts facilities
• Mentorship from renowned faculty
• Networking within arts community

**Application Process**
1. Apply during NCA admission process
2. Submit financial need form from Admissions Office
3. Provide complete financial documentation
4. Include portfolio and academic records
5. Committee evaluates combined need and merit
6. Awards announced with admission decisions`,
        eligibility: `**Department Coverage**
Available to students from all NCA departments:
• Faculty of Fine Arts
• Faculty of Design
• Faculty of Multimedia Art
• Faculty of Architecture
• Faculty of Film & Television
• Faculty of Performing Arts
• Faculty of Humanities

**Selection Criteria**
• Financial need assessment (primary consideration)
• Academic and artistic merit
• Portfolio quality
• Previous educational achievements
• Commitment to arts and design field

**Financial Documentation**
• Family income certificate
• Income tax returns or salary slips
• Utility bills
• Asset declaration
• CNIC copies
• Bank statements (if applicable)

**Merit Assessment**
• Portfolio evaluation by faculty
• Academic transcripts from previous studies
• Entrance test/interview performance
• Demonstrated artistic talent and potential

**Retention Requirements**
• Maintain good academic performance (typically 2.5+ CGPA)
• Regular attendance (minimum 75%)
• Active participation in classes and workshops
• No major disciplinary violations
• Continued financial need

**Important Restrictions**
• Students on self-support/self-finance programs NOT eligible
• Cannot hold multiple NCA scholarships simultaneously
• Can compete for awards and prizes
• False information may result in expulsion

**Application Integrity**
• All information must be accurate and truthful
• Financial need form must be completed honestly
• Supporting documents must be genuine
• Severe disciplinary action for false information`
    },
    {
        title: 'PEEF Scholarships for NCA',
        description: `**About the Scholarship**

As a designated Center of Excellence by the Pakistan Education Endowment Fund, NCA offers comprehensive PEEF scholarships to financially deserving students from Punjab, making world-class arts education accessible to talented individuals from low-income families.

**Benefits**
• Full funding for deserving students
• Recognized by federal government
• Covers tuition and related academic expenses
• Duration: Complete undergraduate program
• Access to PEEF scholar network and events

**NCA as Center of Excellence**
• Specially designated by PEEF
• Enhanced support for arts and culture programs
• Part of national talent development initiative

**Application Process**
1. Apply for NCA admission first
2. Submit PEEF scholarship application
3. Provide Punjab domicile and income certificate
4. Financial background verification
5. Selection by joint NCA-PEEF committee
6. Results announced with admission decisions`,
        eligibility: `**Nationality & Domicile**
• Must be Pakistani national (mandatory)
• Valid Punjab domicile certificate required
• Punjab domicile holders given exclusive access

**Financial Criteria**
• Parental/guardian monthly income: PKR 60,000 or less
• This is a strict income ceiling
• Complete income verification required
• Priority for families below poverty line

**Program Eligibility**
• Enrolled in NCA undergraduate programs
• Full-time student status required
• Programs must be PEEF-approved arts disciplines

**Academic Requirements**
• Meet NCA's admission criteria
• Secure admission through regular admission process
• Demonstrate artistic talent through portfolio
• Pass entrance test/interview

**Performance Standards (For Continuation)**
• Maintain minimum 75% attendance
• Achieve at least 60% academic performance each semester
• Satisfactory progress in studio work and projects
• Good disciplinary record

**Required Documents**
• PEEF scholarship application form
• Punjab domicile certificate (original and copy)
• Family income certificate from competent authority
• CNIC copies (student and both parents/guardians)
• Salary slips or income proof
• Utility bills
• Academic transcripts and certificates
• NCA admission letter

**Special Requirements**
• Not receiving any other educational scholarship
• First-generation university students preferred
• Portfolio demonstrating artistic potential

**NCA Center of Excellence Benefits**
• Higher number of scholarship slots
• Priority processing of applications
• Enhanced support services
• Direct coordination between PEEF and NCA`
    },
    {
        title: 'Asim Butt Scholarship',
        description: `**About the Scholarship**

Named in honor of the renowned Pakistani artist Asim Butt, this scholarship celebrates his legacy by supporting talented Fine Arts students who demonstrate both artistic promise and financial need, ensuring that the next generation of artists can pursue their creative vision.

**About Asim Butt**
• Pioneering Pakistani contemporary artist (1978-2010)
• Known for graffiti, stencil art, and social activism
• Co-founder of Stuckism Pakistan art movement
• Left lasting impact on Pakistani art scene

**Benefits**
• Variable financial support based on need and merit
• Access to Fine Arts resources at NCA
• Mentorship from senior faculty
• Connection to Asim Butt's artistic legacy
• Recognition in arts community

**Application Process**
1. Submit during NCA admission for Fine Arts programs
2. Provide financial need documentation
3. Submit comprehensive portfolio
4. Write artist statement explaining your vision
5. Selection by scholarship committee`,
        eligibility: `**Program Requirement**
• Exclusively for Fine Arts students at NCA
• Must be enrolled in Faculty of Fine Arts
• Full-time student status required
• Covers specializations: painting, sculpture, printmaking, etc.

**Selection Criteria**
• Merit: Artistic talent and portfolio quality (60%)
• Need: Financial hardship and family income (40%)
• Balanced approach ensuring talented but needy students benefit

**Merit Assessment**
• Portfolio evaluation by Fine Arts faculty
• Quality and originality of artwork
• Technical skills demonstration
• Artistic vision and conceptual development
• Previous achievements and exhibitions

**Financial Need**
• Family income below specified threshold
• Complete financial disclosure required
• Income certificate from relevant authority
• Asset and liability statement
• Priority for first-generation artists from low-income backgrounds

**Portfolio Requirements**
• 10-15 original artworks showcasing range
• Multiple mediums encouraged
• Artist statement (500-1000 words)
• Description of each work
• Evidence of artistic development

**Academic Standards**
• Meet NCA Fine Arts admission requirements
• Maintain satisfactory CGPA (typically 2.5+)
• Active participation in studio classes
• Regular attendance and engagement
• Progress in artistic development

**Continuation Requirements**
• Continued financial need
• Maintained artistic excellence
• Good academic standing
• Regular portfolio reviews
• Participation in NCA exhibitions and events

**Special Considerations**
• Students working in experimental/contemporary art encouraged
• Social activism through art appreciated (aligned with Asim Butt's legacy)
• First-generation university students prioritized
• Students from marginalized communities given preference`
    },

    // National Programs
    {
        title: 'Ehsaas Undergraduate Scholarship Program',
        description: `**About the Scholarship**

The Ehsaas Undergraduate Scholarship Program is a flagship initiative by the Government of Pakistan, representing the nation's commitment to educational equity by providing comprehensive financial support to talented students from economically disadvantaged backgrounds across all public universities.

**Program Vision**
• Part of Ehsaas nationwide poverty alleviation strategy
• Promotes merit-based scholarships for deserving students
• Creates pathways from poverty to prosperity
• Largest undergraduate scholarship program in Pakistan's history

**Benefits**
• Complete tuition fee coverage for entire degree duration
• Annual stipend for books, accommodation, and living expenses
• No repayment required - fully funded government grant
• Valid for 4-5 years depending on program
• Access to Ehsaas scholar network
• Career guidance and placement support
• Priority consideration for government jobs upon graduation

**National Coverage**
• Available at ALL public sector universities in Pakistan
• Includes federal and provincial universities
• Covers all academic disciplines and programs
• Thousands of scholarships awarded annually

**Application Process**
1. Apply online through HEC Ehsaas Portal (ehsaas.hec.gov.pk)
2. Upload required documents (CNIC, income certificate, admission letter)
3. Biometric verification at designated centers
4. Socio-economic survey and need assessment
5. Merit-based evaluation through committee
6. Results announced on official portal
7. Scholarship agreement signing
8. Disbursement in semesterlyinstallments`,
        eligibility: `**Basic Eligibility**
• Pakistani nationals only
• Enrolled in undergraduate programs at public universities
• Full-time student status required
• Not holding any other government scholarship

**Financial Criteria**
• Must be from economically disadvantaged background
• Family income below specified poverty threshold (updated annually)
• Unable to afford university education without support
• Socio-economic scoring through government database

**Academic Requirements**
• Secured admission in any public university in Pakistan
• Meet university's admission criteria
• Minimum academic threshold varies by institution
• Preference for students with strong academic record despite financial constraints

**Priority Categories**
1. Orphans and students from single-parent households
2. Students with disabilities
3. Students from remote and underdeveloped areas
4. Female students (special quota reserved)
5. Students from minority communities
6. Transgender students
7. First-generation university students

**Provincial Distribution**
• Quotas allocated proportionally to each province
• Balochistan, Gilgit-Baltistan, and FATA given additional consideration
• AJK and merged districts special allocation
• Urban-rural balance maintained

**Retention Criteria**
• Maintain minimum CGPA (typically 2.5 or as per university requirement)
• Regular attendance (minimum 75%)
• Complete required credit hours each semester
• No major disciplinary violations
• Continued enrollment without long gaps

**Documentation Required**
• Valid Pakistani CNIC (student and parents/guardians)
• Domicile certificate
• Income certificate from relevant authority (<PKR 45,000 monthly typical threshold)
• Admission/enrollment letter from public university
• Academic transcripts and certificates
• Bank account details for disbursement
• Utility bills (electricity/gas)
• Rent agreement (if applicable)

**Application Timeline**
• Applications open annually (typically September-November)
• Deadlines strictly enforced
• Early application recommended
• Results usually within 2-3 months

**Disbursement**
• Tuition paid directly to university
• Stipend disbursed to student's bank account
• Semester-wise installments
• Requires semester enrollment verification

**Additional Benefits**
• Access to HEC digital library
• Career counseling services
• Skill development workshops
• Networking opportunities
• Leadership training programs

**Important Notes**
• Cannot hold Ehsaas with other HEC/government scholarships
• Must complete degree within standard duration
• Service bond may apply (check current policy)
• Beneficiaries tracked through NADRA database
• Fraud detection mechanisms in place

**Contact & Information**
• Website: https://ehsaas.hec.gov.pk
• HEC Helpline: 051-9044000
• Regional HEC offices for assistance
• University financial aid offices for guidance`
    }
];
