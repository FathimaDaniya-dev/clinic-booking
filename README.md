# Smile Dental Clinic – Clinic Booking System

A responsive web app that lets patients browse a clinic's services, meet the team, and **book appointments online with real-time availability and no double-bookings**.

It's designed to be **reusable for any type of clinic** (dental, physio, GP): settings such as opening hours, services and brand colours are kept in one place.

🔗 **Live site:** https://fathimadaniya-dev.github.io/clinic-booking/

> ⚠️ Portfolio project. Smile Dental Clinic and its staff are fictional.

## Features (Version 1)
- **5 pages:** Home, Services, Our Team, Contact, Book Now
- **Online booking:** choose a service, practitioner, date and an available time
- **Smart time slots:** based on each service's length and opening hours (8:30am–5pm)
- **No double-bookings:** times that overlap an existing appointment are blocked
- Weekends, past dates and past times can't be booked
- **Your bookings** list with **cancel**, which frees the time again
- Form validation (required fields, email format, phone pattern)
- **Responsive** design for phone, tablet and desktop
- **Accessible:** labelled fields, keyboard focus styles, ARIA attributes, alt text

## Quality
Lighthouse (homepage, Incognito): **100** Performance · **100** Accessibility · **100** Best Practices · **100** SEO

## How the double-booking check works
A new appointment clashes with an existing one if:

`new start < existing end` **and** `new end > existing start`

Example: if Dr Aroha is booked 11:00–11:45, a 45-minute appointment at 11:30 would overlap, so it's blocked, while 12:00 is free.

## Tech stack
- **Frontend:** HTML5, CSS3 (Flexbox, Grid, custom properties), JavaScript
- **Storage (Version 1):** browser `localStorage`
- **Tools:** Git, GitHub, VS Code, Chrome DevTools, Lighthouse, Prettier
- **Deployment:** GitHub Pages with GitHub Actions (automatic on every push)

## Limitations of Version 1
Bookings are stored in the browser, so they're only visible on the device that made them, and validation runs only in the browser. Version 2 moves this to a server and database.

## Roadmap
- **Version 2:** backend API in C# (.NET) with a SQL database, server-side validation and double-booking checks, confirmation emails
- **Version 3:** React + TypeScript frontend, admin dashboard and reports, mobile hamburger menu

## What I learned
- Planning with user stories, use cases and a data model before coding
- Fixing a CSS specificity bug using Chrome DevTools, by narrowing the rule with `:not(.btn)` rather than adding overrides
- Why front-end validation checks format but can't prove an email or phone number is real
- Designing for mobile: making the header scroll away on small screens
- Repeating the header and footer on every page showed me why frameworks like React use reusable components
- Testing in Incognito: browser extensions lowered my Lighthouse scores

## Credits
Hero photo by Ozkan Guner on Unsplash

## Author
Fathima Daniya – [GitHub](https://github.com/FathimaDaniya-dev)