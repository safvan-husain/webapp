# **AI-Powered Agentic Job Portal — Product Overview**

## **1. Introduction**

This platform is a next-generation job and talent-matching system powered by AI agents.
Unlike traditional job portals, it emphasizes **rich, high-context profiles** from both sides—job seekers/freelancers and companies/clients—to enable **deep semantic matching**, **AI-led clarifications**, and **assisted decision-making**.

The goal:
**Maximize information → enable intelligent reasoning → create meaningful, high-fit matches.**

---

# **2. Key User Roles**

## **2.1 Job Seekers / Freelancers**

Individuals looking for:

* Full-time jobs
* Part-time jobs
* Freelance projects
* Consulting
* Startup collaborations

They create rich profiles including:

* Skills + experience levels
* Work history
* Project history
* Personal goals
* Work style
* Vision
* Detailed descriptions via AI-assisted interview
* Links to portfolios (no file uploads)

They can:

* Receive matches
* Chat with the AI to refine matches
* Approve contact sharing with companies
* Receive AI suggestions and compromise recommendations (but AI never updates their “ideal” unless they approve)

---

## **2.2 Companies / Clients**

Includes:

* Businesses (any size)
* Startups
* Solo founders
* Freelance clients

They provide:

* Company overview
* Product/service details
* Team structure
* Work culture
* Links to work/products
* Additional contextual descriptions collected via AI interview
* For companies ≤ 200 employees: **separate founder profile** (vision, background, past projects)

They can:

* Post job/project requirements
* Let AI retrieve additional clarification from matched candidates
* Approve contact sharing
* Ask the AI to compare candidates
* Get recommended compromises when a perfect match doesn’t exist

---

## **2.3 AI Agent (System Role)**

The AI is a **fully autonomous assistant** within the platform.

It:

* Uses structured + unstructured profile data
* Extracts deeper personal/professional context through chat
* Contacts matched individuals on behalf of a company (with clear disclosure)
* Gathers missing details
* Suggests compromises (never automatically updates profiles)
* Helps filter candidates through natural language (“Show me someone with fintech background strong in backend scaling”)
* Summarizes matches
* Helps compare candidates
* Assists in refining search criteria
* Supports decision-making but never dictates order or ranking

It cannot:

* Reorder matches
* Share contact without user approval
* Auto-update key profile preferences (only update after explicit user agreement)

---

# **3. Core System Philosophy**

## **3.1 Maximum Data Approach**

The platform collects:

* **Structured data** (skills, experience, location, job type, etc.)
* **Unstructured data** (vision, personal goals, leadership style, founder history)
* **Contextual data** gathered through AI chat
* **Cross-linked work/project samples from URLs**

All unstructured text is later converted into embeddings to enable:

* Semantic search
* Deep relational matching
* Contextual reasoning

This enables matching beyond typical filters:

> “Find people who led a small engineering team and previously shipped fast MVPs for fintech products.”

---

## **3.2 Hybrid Matching Logic**

Matching =
**Traditional Filters + Embeddings + AI Reasoning**

Traditional filters include:

* Skills
* Experience
* Location
* Job type
* Availability
* Compensation range
* Industry preference

Embeddings capture:

* Vision
* Culture fit
* Work philosophy
* Founder/individual background
* Project semantics

AI reasoning handles:

* Compromise suggestions
* “Near-match” discovery
* Missing info retrieval
* Comparison and summary generation
* Contextual compatibility assessment

There is **no numeric ranking**.
Filtering + reasoning + human review = final experience.

---

# **4. User Flow (High-Level)**

---

## **4.1 Job Seeker / Freelancer Flow**

### **1. Sign up & Basic Info**

* Email/phone login
* Role selection: Job Seeker / Freelancer

### **2. Structured Profile Setup**

* Skills + years + proficiency
* Work history
* Projects with role descriptions
* Preferred job type
* Location preference
* Links (GitHub, portfolio, LinkedIn, etc.)

### **3. AI-Driven Deep Profile Chat**

AI asks dynamic, contextual questions to extract:

* Vision
* Long-term goals
* Working style
* Personality-based preferences
* Culture preferences
* Problem-solving approach
* Past project stories

### **4. Profile Completion**

* Unstructured data added to embeddings
* User reviews and approves

### **5. Receiving Matches**

* System shows list of matches (order fixed, AI cannot reorder)
* User can query AI to filter:

  > “Show me backend-focused fintech roles with small teams”

### **6. AI-Assisted Decision Support**

* Summaries
* Comparisons
* Clarification collection
* Compromise suggestions

### **7. Contact Approval**

Only after the candidate approves:

* Contact exchanged with company
* AI can then connect both via in-app messaging

---

## **4.2 Company / Client Flow**

### **1. Sign up & Basic Info**

* Company/client type selection
* Basic business info

### **2. Structured Data**

* Industry
* Team size
* Role requirement
* Location/work model
* Project details

### **3. Founder Profile (if ≤200 employees)**

Collect:

* Founder background
* Previous company history
* Vision
* Past products
* Philosophies
* Links to work

### **4. AI Deep Context Chat**

Dynamic questions to capture:

* Culture
* Expectations
* Constraints
* Ideal team setup
* Technical/non-technical preferences

### **5. Posting a Job/Project**

Structured + narrative components.

### **6. Receiving Matches**

List of matches appears (fixed order).
Filters available.

### **7. AI-Assisted Internal Processes**

The AI can:

* Fetch missing info from candidates
* Compare candidates
* Provide match summaries
* Narrow down results with NLP queries
* Suggest compromises
* Help build a team of individuals (not pre-existing groups)

### **8. Contact Approval**

Company approves → AI contacts candidate to get permission → contact unlocked.

---

# **5. AI Agent Capabilities**

## **5.1 Information Collection**

From both sides:

* Psychographic info
* Project semantics
* Context behind decisions
* Expectations

AI will only ask for more info when:

* Many matches require deeper filtering
* Company needs more clarity
* Candidate needs more context

---

## **5.2 In-App Interactions**

The AI can chat with:

* Candidates on behalf of a company
* Companies on behalf of a candidate

Disclosure always included:

> “I am the AI assistant for XYZ reviewing your match.”

---

## **5.3 Negotiation System**

AI can:

* Suggest compromises
* Reframe expectations (e.g., “He has 4 years but built complex scalable systems”)
* Identify combinations of talents (e.g., one strong at scaling, another strong at architecture)

AI cannot:

* Update the user’s ideal requirement
* Change their profile without explicit approval
* Change the order of matches

---

# **6. Platform Interaction & Tools**

## **6.1 Natural Language Search**

Users can ask:

* “Find candidates who worked in fintech and built distributed systems.”
* “Show me designers with experience in mobile onboarding flows.”

AI filters based on structured + embedded data.

---

## **6.2 Match Summaries**

For each match, the system can generate:

* Quick overview
* Strengths
* Weaknesses
* Relevant experience
* Similar projects
* Fit reasoning

---

## **6.3 Comparison Tools**

Side-by-side AI comparison:

* Skills
* Experience
* Cultural match
* Strength analysis
* Project similarity

---

## **6.4 In-App Messaging Only**

All communications occur:

* Inside the platform
* Through AI-assisted threads

No external messaging.

---

# **7. Privacy & Contact Sharing**

* No contact sharing unless explicitly approved
* AI asks permission before connecting both sides
* All chats are logged within platform

---

# **8. Limitations (Prototype Scope)**

* No monetization
* No file uploads (links only)
* No availability/timeline tracking
* No interview scheduling
* Only individual matching (not existing teams)
* AI suggestions require user confirmation before profile updates

---

# **9. Summary**

This platform is built around **deep profile context**, **hybrid matching**, and **AI-mediated interactions**, enabling a richer, more intelligent hiring experience than traditional portals. Both sides supply extensive structured and unstructured data, which the AI uses to reason, filter, compare, and collaboratively refine matches. Human control remains, while AI accelerates discovery, clarification, and compromise.

---

