# Implementation Plan - GlobalPath Visa

Build a premium, fully responsive, and highly interactive visa consultancy website named **GlobalPath Visa**, inspired by `easyglobalvisa.co.uk`. The website will offer a seamless experience for visitors looking to apply for Schengen, UK, US, and Canadian visas.

To provide a state-of-the-art feel, the application will feature:
1. **Interactive Visa Eligibility Checker**: Users can quickly select their citizenship and destination to get instant visa guidelines and checklist of required documents.
2. **Multi-step Application & Booking Form**: A guided questionnaire for submitting a visa assessment and booking consultancy.
3. **Live Application Tracking Dashboard**: Users can enter a tracking ID (e.g. `GP-78932`) to view a visual, step-by-step progress timeline of their visa file (simulating real-time updates).
4. **Responsive Premium UI**: Glassmorphic elements, modern gradients (deep indigo, premium gold, and clean slates), micro-animations, and full mobile responsiveness.

---

## User Review Required

> [!IMPORTANT]
> The current workspace is an e-commerce template. We will repurpose and redesign the frontend to fully represent the visa consultancy website. The old product-specific pages (`Cart`, `Checkout`, `Products`, etc.) will be replaced with clean, visa-focused routes.

> [!NOTE]
> We will add a mock submission database in `localStorage` so that when a user submits an application through the "Apply Now" form, it generates a real tracking ID that they can immediately track on the "Track Application" page!

---

## Proposed Changes

We will restructure the React frontend to point to the following pages and components:

### 1. Navigation & Layout

#### [MODIFY] [Navbar.jsx](file:///d:/aura/frontend/src/components/Navbar.jsx)
- Redesign the Navbar with a premium brand logo for **GlobalPath Visa**.
- Navigation items: *Home*, *Services*, *Track Application*, *About Us*, *FAQs*, *Contact*.
- Add a prominent primary CTA button: **Apply Now**.
- Fully responsive mobile drawer.

#### [MODIFY] [footer.jsx](file:///d:/aura/frontend/src/components/footer.jsx)
- Update branding to **GlobalPath Visa**.
- Add visa resources links, contact info, office address, and disclaimer (clarifying it is a private consultancy, not an embassy).

### 2. Core Pages

#### [MODIFY] [Home.jsx](file:///d:/aura/frontend/src/pages/Home.jsx)
- Replace e-commerce home content with a high-conversion visa consultancy homepage.
- **Hero Section**: Sleek gradient background, trust stats, and main CTA.
- **Visa Eligibility & Document Finder**: Dynamic dropdown widget (Citizen of X traveling to Y -> instantly displays visa requirements, estimated processing times, and fees).
- **Popular Destinations Grid**: Card carousel/grid for France, Italy, Spain, UK, USA, Canada with hover micro-animations.
- **How It Works**: Modern vertical/horizontal progress timeline steps.
- **Trustpilot Integration Mock & Reviews**: Testimonials from satisfied clients.

#### [MODIFY] [About.jsx](file:///d:/aura/frontend/src/pages/About.jsx)
- Re-write the content to describe GlobalPath Visa's history, mission, values, and legal compliance indicators.

#### [MODIFY] [Contact.jsx](file:///d:/aura/frontend/src/pages/Contact.jsx)
- Update styling to a modern glassmorphic contact page.
- Add an interactive contact form with state validation.
- Provide clear office locations (London address), contact numbers, email, and a direct WhatsApp chat button.

#### [MODIFY] [FAQ.jsx](file:///d:/aura/frontend/src/pages/FAQ.jsx)
- Add specialized visa FAQs (Schengen rule changes, document legalisation, interview prep, processing times, flight/hotel bookings).

### 3. New Visa Features

#### [NEW] [Services.jsx](file:///d:/aura/frontend/src/pages/Services.jsx)
- Detail pages for the four major visa types (Schengen, UK, US, Canada) detailing documents required (bank statements, employment letters, insurance, flight bookings) and pricing tiers.

#### [NEW] [Apply.jsx](file:///d:/aura/frontend/src/pages/Apply.jsx)
- Multi-step interactive application wizard:
  - **Step 1: Travel Details** (Choose destination, travel date, purpose of travel).
  - **Step 2: Personal Information** (Name, email, phone, nationality).
  - **Step 3: Document Upload Simulator** (Upload mock files: passport scan, bank statement).
  - **Step 4: Book Consultation** (Select date and time slot).
  - **Step 5: Review & Submit** (Displays pricing summary and generates a unique Tracking ID `GP-XXXXX`).

#### [NEW] [Track.jsx](file:///d:/aura/frontend/src/pages/Track.jsx)
- Visual tracker page.
- Input box to enter Tracking ID.
- Displays a beautiful visual stepper tracking the status of the file:
  - `Submitted` -> `Under Document Review` -> `Appointment Scheduled` -> `Documents Dispatched to Embassy` -> `Decision Ready / Passport Dispatched`.
  - Populate some default mock tracking IDs (e.g. `GP-SAMPLE123`) so the user can see it work immediately, or enter the ID generated from their own booking.

### 4. Application Routing

#### [MODIFY] [App.jsx](file:///d:/aura/frontend/src/App.jsx)
- Clean up unused imports and update router definitions to point to the new visa pages:
  - `/` (Home)
  - `/services` (Services)
  - `/apply` (Apply Now Form)
  - `/track` (Track Application)
  - `/about` (About Us)
  - `/faq` (FAQs)
  - `/contact` (Contact Us)

---

## Verification Plan

### Automated Verification
- Run ESLint to ensure code matches guidelines and has no compilation/routing errors:
  ```bash
  npm run lint
  ```
- Run a production build to check for bundle errors:
  ```bash
  npm run build
  ```

### Manual Verification
- Start the local dev server (`npm run dev`) and test:
  1. **Navbar Responsiveness**: Verify hamburger menu toggles on mobile viewports.
  2. **Eligibility Checker**: Select different countries and verify requirements update dynamically.
  3. **Apply Now Form**: Fill out all steps, submit, copy the generated tracking ID.
  4. **Tracking Page**: Paste the generated tracking ID and check if the stepper details appear correctly with dynamic status changes.
  5. **Design Aesthetics**: Check spacing, hover states, fonts, colors, and shadows for a premium look.
