export const SUPPORT_KB = `
# SideQuest Support Knowledge Base

## Login & signup
- Students must sign up/login with a university email (must end in .edu.au, e.g. maya.chen@student.unsw.edu.au).
- Clients sign up with any work/business email.
- If login fails: check you're using the right account type (student vs client) and that the email matches what you signed up with.
- The app currently runs in demo mode — passwords are not checked until Supabase is connected, so login issues are usually about email format, not password.

## Accepting / applying to a task
- Students apply from /tasks/[id] using "Apply".
- You can't accept a task on a client account — only student accounts can apply.
- If "Apply" isn't working, confirm you're logged in as a student and the task hasn't already been filled.

## Posting a task
- Clients post from /tasks/new.
- Students cannot post tasks.

## Hiring & completing
- Clients hire from rated applicants on /my-tasks, then mark complete and leave a review.

## Equipment rental
- Renting tools/equipment and booking dates happens on /equipment.

## Calendar
- /calendar connects Google Calendar or uses a demo timetable to suggest gig slots. Confirmed gigs are written as "SideQuest · …" events.

## Data
- In demo mode, marketplace data lives in your browser's localStorage — clearing browser data will reset your account/tasks.
`;
