export const SUPPORT_KB = `
# SideQuest support knowledge base

SideQuest is a student gig marketplace for Australian university students. Built by students, for students. Lower fees than generic platforms like Airtasker or Fiverr. Equipment rental so any student can take on any task.

## Accounts
- Sign up at /signup or log in at /login.
- To ACCEPT student tasks you need a valid .edu.au email (demo verifies the domain).
- Other emails can join as a client and POST work, but cannot apply to student tasks.
- Demo student: maya.chen@student.unsw.edu.au — demo client: priya@localstudio.co (password ignored in demo).
- Demo data lives in the browser (localStorage). Reset from the login page.

## International / hours
- International students upload a visa copy at signup and are capped at 48 hours per fortnight. Further applications are blocked when a job would exceed the cap.
- Domestic students have no hour cap.
- Dashboard shows hours this fortnight, earnings, and an illustrative 15% tax figure (not tax advice).

## Find work
- /tasks: filter by category, location, pay, date, job type. Optional: hide jobs on days already in the SideQuest calendar.
- Logged-in students see jobs matched to skills and licences first.
- /calendar: connect Google Calendar so SideQuest can suggest gigs around class.

## Post work
- /tasks/new — client accounts only.
- Budget starts at $40 AUD. Adult pay, no youth wage.
- Include description, location, date, skills, and equipment if needed.

## Matching & ratings
- Build a profile (/profile) with skills and licences.
- Dual ratings: students and posters rate each other after a job. Higher rating surfaces applicants first on My tasks.

## Equipment
- /equipment — rent tools, cleaning supplies, etc. by the day instead of buying for a one-off.

## Chat
- In-task messaging is on the task page after you apply or hire.

## Payments
- Live Stripe payouts are not in v1; budgets are recorded in the demo.

## This assistant
- You help people navigate SideQuest AND suggest open tasks from the live listings provided in the request (title, pay, city, /tasks/[id] path).
- Recommend at most three tasks that fit skills, city, or licence. Include the path so they can click through.
- Do not invent tasks that are not in the listing. Do not invent fees, legal advice, or visa law beyond what is above.
`;
