Build a complete fictional university website intended specifically for accessibility testing.

The project should feel like a real, large public university website, but it must be entirely fake and self-contained.

## Goal

Create a static university website with approximately **100 distinct pages/routes** covering the kinds of content, interfaces, navigation patterns, forms, tables, applications, portals, and marketing pages commonly found on a real university website.

The site should be realistic enough that someone could use it as a large accessibility-testing target for tools such as:

* WAVE
* axe
* Lighthouse
* Accessibility Insights
* Browser screen reader/manual testing
* Automated accessibility scanners

The site intentionally needs to contain a large number and variety of accessibility defects.

The important requirement is that these defects are **deliberately engineered, categorized, reproducible, and reversible**.

---

# Core Architecture

This is a **static website only**.

There should be:

* No backend
* No database
* No authentication server
* No API dependency
* No external state persistence required

Use client-side JavaScript to simulate dynamic functionality.

Fake data should be stored locally in:

* JSON
* JavaScript objects
* Static fixtures
* Generated seed data

Interactions should behave realistically during the current browser session.

However:

**Refreshing/reloading the page must always reset the website to its original default state.**

Do not use persistent storage for application state.

(Amendment, plan 11 / ADR-061: the CTF leaderboard is the one exception. It lives in `localStorage` so scores outlive reloads on a shared event laptop. Nothing on the site reads it, so a reload still resets the site.)

Avoid:

* localStorage
* IndexedDB
* cookies for application state
* external databases

Session-only JavaScript state is fine.

---

# Fictional University

Invent a believable university brand.

Example:

**Redwood State University**

Create:

* University name
* Logo
* Colors
* University seal
* Mascot
* Campus imagery/placeholders
* Address
* Departments
* Colleges
* Faculty
* Programs
* Student organizations
* Campus services
* News
* Events
* Athletics
* Admissions content

Everything must be fictional.

Do not clone an existing university.

The visual design should feel like a legitimate university website developed over many years by multiple departments.

That means the site should have some intentional design inconsistency between different sections.

For example:

* Admissions may look newer
* Academic department pages may look older
* Student portal pages may resemble enterprise software
* News pages may use a different template
* Library pages may have dense navigation
* Athletics may have a visually different style

Despite these differences, the site should still clearly belong to the same fictional university.

---

# Scale

Create approximately **100 usable pages/routes**.

Do not create 100 nearly identical placeholder pages.

There should be meaningful variation in:

* content
* layouts
* controls
* components
* accessibility problems
* navigation
* interaction patterns

Create reusable templates and generated data where appropriate so maintaining the site remains practical.

---

# Suggested Site Structure

Include sections similar to the following.

## University Home

* Homepage
* About
* University leadership
* Mission
* History
* Campus map
* Contact
* Accreditation
* Strategic plan

## Admissions

* Admissions homepage
* Undergraduate admissions
* Graduate admissions
* International admissions
* Transfer admissions
* Freshman requirements
* Application process
* Tuition
* Scholarships
* Financial aid
* Request information
* Schedule a campus visit
* Admissions FAQ

## Academics

Create multiple college landing pages such as:

* College of Engineering
* College of Business
* College of Arts & Humanities
* College of Science
* College of Education
* College of Health Sciences

Create departments such as:

* Computer Science
* Mathematics
* Biology
* Chemistry
* English
* History
* Psychology
* Nursing
* Mechanical Engineering
* Business Administration

Create multiple degree/program pages.

Include:

* Undergraduate programs
* Graduate programs
* Minors
* Certificates
* Course catalog
* Academic calendar

## Faculty

Include:

* Faculty directory
* Search/filter interface
* Faculty profile pages
* Research interests
* Publications
* Office information
* Contact cards

## Students

Include:

* Student resources
* Registrar
* Academic advising
* Career services
* Counseling services
* Student health
* Housing
* Dining
* Parking
* Transportation
* Campus safety
* Student organizations
* Campus recreation

## Library

Include:

* Library homepage
* Search
* Databases
* Research guides
* Study rooms
* Hours
* Policies
* Account-style interface

## News

Create a news system with:

* News homepage
* Categories
* Individual articles
* Featured stories
* Related stories
* Article archive
* Search

Create at least 10–15 realistic fake articles.

## Events

Include:

* Event calendar
* Event search
* Event categories
* Event detail pages
* Registration interaction

## Athletics

Include:

* Athletics homepage
* Teams
* Schedules
* Rosters
* Scores
* Athlete profiles

## Giving

Include:

* Giving homepage
* Donation form
* Giving priorities
* Alumni giving
* Scholarships
* Campaigns

## Employee Resources

Include:

* HR
* Benefits
* Employment opportunities
* Policies
* Payroll information
* Employee directory

## Fake Student Portal

Create an authenticated-looking area without actual authentication.

Include interfaces such as:

* Dashboard
* Class schedule
* Grades
* Degree progress
* Financial account
* Registration
* Holds
* To-do list
* Messages
* Profile

The portal should load fake student information from JavaScript.

Refreshing resets everything.

---

# Fake Interactivity

Implement realistic JavaScript-driven behavior.

Examples:

### Course Search

Allow users to:

* Search courses
* Filter by department
* Filter by semester
* Expand course details
* Add a fake course
* Remove a fake course

Reloading resets registration.

### Faculty Directory

Allow filtering by:

* department
* name
* research topic

### University Search

Create a fake global site search.

Search against locally stored fake university content.

### Event Registration

Allow:

* selecting an event
* choosing attendee count
* submitting registration
* showing a confirmation

Reload resets it.

### Donation Form

Create realistic fields and validation but never transmit data anywhere.

### Admissions Application

Create a simplified multi-step application.

Data exists only in JavaScript memory.

### Student Portal

Allow interactions such as:

* adding/removing a class
* changing tabs
* opening messages
* acknowledging alerts
* expanding degree requirements

Everything resets on reload.

---

# Accessibility Testing System

This is the most important part of the project.

The site must intentionally contain many realistic accessibility problems.

Create a centralized **Accessibility Scenario Engine**.

Accessibility issues should not simply be random malformed markup scattered throughout the application.

Instead, accessibility scenarios should be identifiable and controllable.

Create three major categories:

1. **Automated Errors**
2. **Automated Alerts**
3. **Manual Testing Issues**

These should broadly resemble issues commonly encountered when using tools such as WAVE.

---

# Floating Accessibility Control

Create a persistent floating control visible on every page.

Place it in a corner of the viewport.

Call it something like:

**Accessibility Test Controls** (since plan 11 / ADR-063: the **Pope Tech Accessibility Lab** widget, which adds an assistive technology CTF mode; see `docs/CTF.md`)

It must contain three independent toggles:

* Fix Errors
* Fix Alerts
* Fix Manual Testing Issues

Each category can independently be ON or OFF.

Default state:

* Fix Errors: OFF
* Fix Alerts: OFF
* Fix Manual Testing Issues: OFF

Therefore the site loads in its deliberately inaccessible state.

Turning a toggle ON should dynamically correct issues belonging to that category.

Turning it OFF should restore those defects.

Reloading the page returns all toggles to OFF.

Do not persist toggle state between reloads.

Also include:

* Reset All
* Fix All

Optionally show counts such as:

Errors: 37 active
Alerts: 54 active
Manual Issues: 28 active

Counts may vary by page.

---

# Error Category

Create examples of common detectable accessibility errors.

Examples include:

* Images without alt attributes
* Empty alt where meaningful text is required
* Form controls without associated labels
* Empty buttons
* Empty links
* Missing document language
* Duplicate IDs
* Broken ARIA references
* Invalid ARIA attributes
* Missing iframe titles
* Missing page title
* Empty headings
* Incorrect table header associations
* Required ARIA children missing
* Required ARIA parents missing
* Invalid form structure
* Select controls without labels
* Inputs with inaccessible names
* Buttons using only background images/icons without accessible names
* SVG controls without accessible labels

When **Fix Errors** is enabled, these errors should be corrected dynamically where practical.

Example:

Bad:

```
<img src="campus.jpg">
```

Fixed:

```
<img src="campus.jpg" alt="Students walking across Redwood State University's central quad">
```

---

# Alert Category

Create patterns that accessibility tools commonly flag for review.

Examples:

* Suspicious alternative text
* Redundant links
* Repeated link text
* Links to PDF/documents without context
* Very long alternative text
* Images with title attributes
* Underlined non-link text
* Skipped heading levels
* Possible heading misuse
* Very small text
* Nearby duplicate links
* Device-dependent event handlers
* Orphaned form labels
* Placeholder used as label
* Tables that may require captions
* Layout tables
* Redundant title attributes
* Links opening new windows without warning
* Generic link text such as:

  * Click here
  * Read more
  * Learn more

When **Fix Alerts** is enabled, replace those implementations with stronger accessible alternatives.

---

# Manual Testing Issues

Create accessibility problems that automated testing may not reliably identify.

Examples:

## Keyboard

* Custom dropdown cannot be opened with keyboard
* Modal traps focus incorrectly
* Focus disappears after modal closes
* Menu only works on mouse hover
* Drag-and-drop interaction has no keyboard equivalent
* Carousel controls cannot be reached
* Custom tabs have incorrect keyboard behavior

## Focus

* Missing visible focus indicator
* Focus order does not match visual order
* Positive tabindex values create confusing navigation
* Focus moves unexpectedly
* Focus is not restored after closing dialogs

## Screen Readers

* Status changes are not announced
* Dynamically loaded results have no live region
* Form errors are visually displayed but not announced
* Modal context is unclear
* Accordion state is not exposed correctly
* Decorative elements are announced unnecessarily

## Visual

* Low text contrast
* Low UI component contrast
* Information conveyed only through color
* Required fields indicated only by color
* Error states indicated only by color

## Zoom/Reflow

Create components that:

* overflow at 200% zoom
* require horizontal scrolling
* clip important text
* use fixed dimensions badly
* break when text spacing increases

## Motion

Create:

* Auto-rotating carousel
* Animated announcement
* Moving promotional content

Initially give users insufficient or missing controls to pause it.

## Forms

Create examples where:

* Instructions disappear
* Error messages are vague
* Required status is unclear
* Related controls are not grouped
* Long forms lack meaningful structure

When **Fix Manual Testing Issues** is ON, repair these behaviors.

For example:

* Add keyboard handling
* Correct focus management
* Add live regions
* Improve contrast
* Add non-color indicators
* Add pause controls
* Correct tab behavior
* Repair responsive/reflow behavior

---

# Accessibility Issue Registry

Create a centralized registry describing each intentional accessibility defect.

Something conceptually similar to:

```
{
  id: "course-search-label-001",
  category: "error",
  rule: "missing-form-label",
  page: "/courses",
  description: "Course keyword search has no programmatic label",
  wcag: ["1.3.1", "3.3.2", "4.1.2"]
}
```

Do not obsess over this exact schema.

The important idea is to have a single discoverable system where developers can understand:

* what accessibility problems exist
* which category they belong to
* where they occur
* how they are intentionally introduced
* how the corresponding fix works

Provide enough metadata that this website can eventually become an accessibility testing benchmark.

---

# Distribution of Accessibility Problems

Do not put every accessibility problem on every page.

Instead, create realistic variation.

Some pages should have:

* only 2–3 issues

Others:

* 10+
* 20+
* particularly problematic legacy pages

Create several intentionally terrible pages.

Examples:

### Legacy Financial Aid Form

A particularly inaccessible old form.

### Old Course Catalog

Dense HTML with tables, poor heading structure, repeated links, and keyboard problems.

### Campus Map

Interactive custom map with keyboard and screen-reader problems.

### Athletics Schedule

Dense tables and icon-only controls.

### Student Registration

Complex SPA-style interaction with ARIA/focus issues.

### Donation Form

Form labeling, instructions, error messaging, and grouping problems.

These should generate particularly interesting testing results.

---

# Accessibility Fix Behavior

The fix toggles must actually change the DOM/behavior.

Do not simply hide accessibility scanner warnings.

For example:

If an image lacks alt text:

**Fix Errors OFF**

Actual DOM has no alt attribute.

**Fix Errors ON**

Add a meaningful alt attribute.

If contrast is poor:

**Fix Manual Testing Issues OFF**

Use the poor-contrast CSS.

**Fix Manual Testing Issues ON**

Apply an accessible contrast token.

If a menu is mouse-only:

**Fix Manual Testing Issues OFF**

Keyboard interaction fails.

**Fix Manual Testing Issues ON**

Keyboard behavior is implemented correctly.

This allows someone to run WAVE before and after applying fixes and observe meaningful changes.

---

# Important Toggle Architecture

Try to implement the toggles through global classes/state such as:

```
accessibilityState = {
    fixErrors: false,
    fixAlerts: false,
    fixManual: false
}
```

Components can respond to this global state.

Potential body classes:

```
.a11y-fix-errors
.a11y-fix-alerts
.a11y-fix-manual
```

Use whichever architecture fits the selected framework cleanly.

The accessibility-control implementation must be easy for developers to understand and extend.

---

# Navigation

The university site should have realistic navigation.

Include:

* Mega navigation
* Breadcrumbs
* Search
* Audience navigation

Audience links might include:

* Students
* Faculty & Staff
* Alumni
* Parents
* Visitors

Include a large footer containing:

* Contact information
* Colleges
* Resources
* Policies
* Accessibility
* Campus safety
* Employment
* Maps
* Directory

---

# Search

Create realistic fake search.

Example query:

```
computer science
```

Should return:

* Computer Science department
* BS Computer Science
* MS Computer Science
* Faculty members
* Relevant news
* Relevant courses

Search everything locally.

---

# Content Quality

Do not fill the university with Lorem Ipsum.

Generate realistic university copy.

Examples:

* Admissions requirements
* Degree descriptions
* Course descriptions
* Faculty biographies
* Event descriptions
* News stories
* Financial aid explanations
* Campus services
* Housing information

Content can be generated from seeded datasets and reusable templates.

---

# Design

The website should look polished enough that a person seeing a screenshot would initially believe it was a real university.

Use:

* Responsive layout
* University branding
* Hero sections
* Cards
* Tables
* Forms
* Accordions
* Tabs
* Modals
* Alerts
* Breadcrumbs
* Calendars
* Directories
* Search interfaces
* Data tables
* Pagination

Do not make it look like a component demo.

It should feel like a real interconnected university ecosystem.

---

# Routing

Use static-compatible client-side routing or generated static routes.

All approximately 100 routes must be directly navigable.

The project should work when hosted from a static platform such as:

* Cloudflare Pages
* GitHub Pages
* Netlify
* Vercel static hosting

Avoid architecture requiring a persistent application server.

---

# Performance

Because the site may contain approximately 100 routes, avoid copying large amounts of markup manually.

Prefer:

* Page templates
* Seeded datasets
* Shared layouts
* Reusable components
* Generated routes

The source code should remain understandable.

---

# Development Tools Page

Create a hidden or clearly labeled development page:

```
/accessibility-lab
```

This page should show all intentional accessibility scenarios.

Group them by:

* Errors
* Alerts
* Manual Testing

Display:

* Issue
* Page
* Component
* WCAG criterion if known
* Current status
* Whether the relevant fix toggle resolves it

Also provide links directly to pages containing each issue.

This page itself should default to being accessible.

---

# Test Pages

Create a few dedicated test pages with controlled examples.

Examples:

```
/accessibility-lab/errors
/accessibility-lab/alerts
/accessibility-lab/manual
/accessibility-lab/forms
/accessibility-lab/keyboard
/accessibility-lab/tables
/accessibility-lab/aria
```

These pages complement the naturally distributed accessibility defects throughout the university site.

---

# Validation

Build automated tests confirming the accessibility defect system works.

For representative components verify:

1. Defective markup/behavior exists with fixes OFF.
2. Corrected markup/behavior exists with the appropriate fix ON.
3. Switching the toggle OFF restores the defect.
4. Reloading restores the initial defective state.

Do not write automated tests that require the site itself to pass accessibility validation by default.

The inaccessible state is intentional.

---

# Documentation

Create documentation explaining:

## README

Explain:

* Purpose of the project
* Installation
* Running locally
* Building
* Deploying as a static site
* Approximate number of pages
* Accessibility testing purpose

## ACCESSIBILITY_TESTING.md

Explain:

* Accessibility issue categories
* Difference between Errors, Alerts, and Manual Testing Issues
* How toggles work
* How issues are registered
* How developers can add a new accessibility scenario
* How to test with WAVE
* How to test with axe
* How to perform keyboard testing
* How to perform basic screen-reader testing

## SITE_MAP.md

List all major routes.

Aim for approximately 100 routes.

---

# Seeded / Deterministic Content

Make generated data deterministic.

Do not generate random names/content differently every reload.

The same page should display the same fake data each time.

This is important because accessibility scan results must be reproducible.

---

# Reset Behavior

Refreshing the browser must restore:

* Accessibility toggles OFF
* Forms to initial state
* Registration selections to initial state
* Fake application progress
* Student portal changes
* Search state
* Modal state
* Event registration state
* Course selections

The website should behave like a fresh test fixture after every reload.

---

# Key Requirement

This project is not merely a university-themed frontend.

It is a **large-scale accessibility testing fixture disguised as a realistic university website**.

Someone should be able to:

1. Open a university page.
2. Run WAVE.
3. See realistic errors and alerts.
4. Perform manual accessibility testing and find additional problems.
5. Enable one or more Accessibility Test Controls (the Pope Tech Accessibility Lab widget's Fixes tab).
6. Run the tests again.
7. Observe that the corresponding accessibility problems have actually been corrected.

The implementation should make these differences obvious and repeatable.

---

# Implementation Philosophy

Favor realistic accessibility mistakes over absurd broken markup.

Accessibility defects should resemble things developers genuinely ship, such as:

* Icon buttons without names
* Placeholder-only inputs
* Incorrect custom widgets
* Skipped headings
* Poor focus handling
* Generic links
* Missing form associations
* Incorrect ARIA
* Low contrast
* Dynamic updates not announced
* Inaccessible tables
* Mouse-dependent functionality

Avoid intentionally corrupt HTML purely to inflate scanner counts.

The goal is a realistic accessibility training, testing, and benchmarking environment.

---

# Final Deliverable

Deliver a complete runnable repository containing:

* Approximately 100 routes
* Fully functional static university website
* Realistic fictional content
* Fake interactive JavaScript functionality
* Deterministic data
* Responsive design
* Intentional accessibility defects
* Accessibility Scenario Registry
* Fix Errors toggle
* Fix Alerts toggle
* Fix Manual Testing Issues toggle
* Fix All
* Reset All
* Accessibility Lab
* Automated tests for the scenario system
* Static production build
* Documentation

Before considering the project complete, inventory all routes and accessibility scenarios and verify that the website provides broad coverage across:

* navigation
* images
* links
* headings
* forms
* tables
* ARIA
* keyboard operation
* focus
* contrast
* responsive/reflow
* dynamic content
* dialogs
* tabs
* accordions
* carousels
* custom controls

Treat the university itself as the product and the accessibility scenario engine as the testing infrastructure underneath it.
