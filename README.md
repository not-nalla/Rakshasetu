# Rakshasetu / Kavach

Kavach is a disaster awareness and preparedness application for India. It provides
disaster information, alerts, shelters, authorities, preparedness guidance, events,
authentication, and an AI assistant.

## Project Features

### User Access and Authentication

- **Email sign-up** - Users can create an account with their name, email, password, role, district, and preferred language.
- **Email login** - Existing users can authenticate with their email address and password.
- **Google sign-in** - Users can sign in through Google OAuth 2.0 with verified identity details and an optional profile picture.
- **Profile completion** - Google users with missing details are guided to choose their role, district, and language before using protected features.
- **Role-based access** - The system supports citizen, student, and official roles, with administrative actions limited to officials.
- **Session authentication** - JWT bearer tokens are stored for the browser session and attached to protected API requests.
- **Session restoration** - A previously authenticated browser session is checked against the backend when the app loads.
- **Sign out** - Users can end their session, clear the local token, and return to the login page.
- **Protected navigation** - Unauthenticated users are redirected to login, while incomplete profiles are redirected to profile setup.
- **Input validation** - Account and profile fields validate required values, email format, password length, allowed roles, and supported languages.

### Home Dashboard

- **District-focused dashboard** - The home screen presents disaster preparedness information for the signed-in user's district.
- **Active alert indicator** - The dashboard shows whether an active emergency alert is currently available.
- **Upcoming drill count** - The dashboard displays the number of upcoming preparedness events.
- **Registration count** - The dashboard displays total event enrollment statistics returned by the backend.
- **Nearby relief camp count** - The dashboard displays a relief-camp summary for the user's area.
- **District search control** - Users can enter a district search term from the dashboard interface.
- **Interactive map** - A Leaflet map displays the district center, event locations, and shelter markers with popups.
- **Nearest shelter preview** - The dashboard displays the nearest available shelter returned by the shelter service.
- **Featured drill preview** - The first upcoming mock drill is highlighted on the dashboard when available.
- **Preparedness preview** - The dashboard previews selected disaster-specific do's and don'ts and links to the full guide.

### Alerts and Emergency Information

- **Emergency banner** - Authenticated users can see the current active alert in the application header area.
- **Alert severity levels** - Alerts support critical, warning, and informational severity classifications.
- **District-specific alerts** - Alerts include the district they affect so officials can target local information.
- **Alert expiry handling** - Scheduled backend jobs automatically deactivate alerts after their expiry time.
- **Government alert ingestion** - The backend fetches NDMA SACHET CAP XML alerts and converts them into stored alerts.
- **Alert persistence** - Alerts are stored in MongoDB with active state, creation time, message, severity, district, and expiry data.

### Events, Drills, and Registration

- **Events and drills feed** - Users can browse disaster preparedness events from the backend.
- **Event type filtering** - Users can filter events by Mock Drill, SSP, CAP, or all event types.
- **Event detail view** - Each event has a detail page with description, date, time, location, district, tags, and enrollment information.
- **Event location map** - Event detail pages show the event coordinates on an interactive map.
- **Event registration** - Authenticated users can register for an event from its detail page.
- **Duplicate registration prevention** - The backend rejects a second registration for the same user and event.
- **Registration status display** - The interface shows confirmation status after a user registers for an event.
- **Enrollment tracking** - Event enrollment counts and maximum capacity are stored and displayed.
- **Upcoming drill endpoint** - The backend provides a dedicated feed for upcoming mock drills used by the dashboard.
- **Event statistics** - The backend calculates total events, upcoming events, and total enrollments.
- **Automatic event completion** - A scheduled backend job marks past upcoming events as completed.

### Preparedness and Disaster Knowledge

- **Do's and don'ts guide** - Users can view safety guidance for earthquakes, floods, fires, cyclones, and tsunamis.
- **Expandable disaster sections** - Each disaster guide expands and collapses to show its safety checklist.
- **Separate action lists** - Guidance is divided into recommended actions and actions to avoid.
- **Read-aloud guidance** - Users can listen to a disaster guide using the browser text-to-speech capability.
- **Historical disaster records** - Users can browse disaster history with type, date, district, casualty, displacement, damage, and summary information.
- **Disaster type filtering** - Historical records can be filtered by disaster type.
- **Disaster year filtering** - Historical records can be filtered by available year.
- **Disaster metadata endpoints** - The backend provides available disaster types and years for filter controls.
- **CSV disaster ingestion** - Government-style CSV records can be normalized and imported into the disaster collection.

### Authorities and Shelters

- **Emergency authority directory** - Users can view local disaster management officials and emergency contacts.
- **Authority search** - Users can search authorities by name, role, or department.
- **District authority filtering** - Authority records can be filtered by district.
- **Authority contact details** - Authority cards show department, role, phone number, email, and district.
- **Shelter directory** - Users can retrieve available relief shelters with distance, occupancy, status, and coordinates.
- **Nearest shelter lookup** - The backend provides a nearest-shelter result for dashboard display.
- **Shelter map markers** - Shelter locations can be represented on the Leaflet map with geographic coordinates.

### AI Assistant

- **Disaster preparedness chat** - Authenticated users can ask Kavach AI about emergency procedures, safety, response, and alerts.
- **Suggested questions** - The chat page offers starter questions about earthquakes, disaster kits, Indian emergency numbers, and floods.
- **Conversation history** - Recent conversation messages are sent to the backend to maintain chat context.
- **Typing response effect** - Assistant replies are displayed with a typewriter-style presentation.
- **Markdown-style responses** - AI output supports formatted headings, bullets, bold text, and links through the message renderer.
- **Freshness-aware search** - Time-sensitive questions can trigger Tavily web search context before the AI response is generated.
- **Current-year filtering instructions** - The AI service is instructed to prioritize current-year disaster information and reject outdated search results.
- **Groq-powered responses** - Groq generates assistant replies and optional disaster impact summaries.
- **Chat error handling** - Failed AI requests show an error message and a fallback assistant response.

### Official Administration

- **Official-only admin page** - Users with the official role can access the administrative dashboard.
- **Emergency alert creation** - Officials can create an alert with a title, message, severity, and district.
- **Event publishing** - Officials can publish a new preparedness event with type, date, location, district, description, and capacity data.
- **Pending approval listing** - Officials can view pending approval records with type, title, submitter, date, and status.
- **Approval feedback** - The admin interface provides an approval action with success feedback in the current UI.
- **Administrative alert listing API** - The backend exposes all alerts for official administration.
- **Administrative event listing API** - The backend exposes all events for official administration.
- **Admin authorization guard** - Backend admin endpoints reject users whose role is not official.

### Interface and Application Experience

- **Responsive layout** - The interface adapts between desktop navigation and a mobile bottom navigation bar.
- **Desktop navigation** - Authenticated desktop users can navigate between Home, Events, Do's & Don'ts, Authorities, Past Disasters, Ask AI, and Admin when eligible.
- **Mobile navigation** - Authenticated mobile users receive compact navigation for the core application sections.
- **Animated page transitions** - Route changes use fade and vertical-motion transitions.
- **Scroll reveal animations** - Page sections and cards animate into view as users scroll.
- **Loading states** - Pages show loading indicators or loading text while API data is being retrieved.
- **Empty and error states** - Lists and API failures show user-readable empty, not-found, unauthorized, and error messages.
- **Toast notifications** - Actions such as registration, alert creation, event publishing, and approvals provide temporary status feedback.
- **Language resources** - English and Hindi translation resources are included, with Marathi represented in the language choices and constants.
- **Icon-based interface** - Lucide icons communicate navigation, alerts, maps, users, events, and preparedness actions.
- **Progressive web app support** - The manifest configures Kavach for standalone installation with app icons and theme colors.
- **Automatic route scroll reset** - Navigation changes smoothly return the page to the top.

### Backend and Operations

- **REST API** - FastAPI exposes authentication, home statistics, events, alerts, authorities, disasters, shelters, AI, and admin endpoints.
- **Automatic API documentation** - FastAPI provides interactive API documentation at `/docs`.
- **Health check** - The `/health` endpoint reports whether the backend is running.
- **Database indexes** - Startup creates indexes for user identity, districts, event fields, alert state, authorities, and registrations.
- **Asynchronous request handling** - Database access, external API calls, routes, and scheduled jobs use asynchronous execution where applicable.
- **Environment configuration** - Database URLs, OAuth credentials, JWT settings, frontend origin, and external API keys load from `.env` settings.
- **CORS configuration** - The backend allows the configured frontend origin to make browser requests.
- **Seed data script** - A backend script can reset and populate MongoDB with sample events, authorities, shelters, disasters, and alerts.
- **Automated backend checks** - Included test scripts exercise app loading, authentication, protected endpoints, duplicate sign-up rejection, and invalid credentials.
- **Combined startup script** - `start-all.ps1` starts the backend and frontend together, checks ports, and reports service health.

## Technology Stack

### Frontend

- **JavaScript (ES modules) and JSX** - The browser application is written in JavaScript with JSX components.
- **React 18** - Builds the component-based user interface and manages application state through hooks and context providers.
- **React DOM** - Mounts the React application into the browser DOM.
- **Vite** - Provides the frontend development server, fast module loading, and production build tooling.
- **React Router DOM** - Handles client-side routing, protected routes, login redirects, and event detail URLs.
- **Tailwind CSS** - Provides utility-first styling and the project's custom colors, typography, spacing, and animations.
- **PostCSS** - Processes the CSS pipeline used by Tailwind CSS.
- **Autoprefixer** - Adds browser vendor prefixes during CSS processing for wider browser compatibility.
- **Framer Motion** - Provides page transitions, animated components, reveal effects, and other interface motion.
- **Leaflet** - Supplies the interactive map engine used to display geographic locations.
- **React Leaflet** - Connects Leaflet map features to React components such as markers, popups, and map containers.
- **Lucide React** - Supplies reusable interface icons used throughout the application.
- **Fetch API** - Sends JSON requests from the browser to the FastAPI backend and attaches JWT bearer tokens.
- **Web Storage API (`sessionStorage`)** - Keeps the current authentication token for the browser session.
- **Web Speech API** - Supports text-to-speech functionality through the frontend speech hook.
- **Progressive Web App manifest** - Defines the Kavach app name, standalone display mode, theme colors, and installable icons.
- **Plus Jakarta Sans** - The interface font loaded from Google Fonts.

### Backend

- **Python** - Implements the backend application, services, scheduled jobs, data ingestion, and test scripts.
- **FastAPI** - Provides the asynchronous REST API, route organization, dependency injection, request validation, and automatic API documentation.
- **Uvicorn** - Runs the FastAPI application as the ASGI web server.
- **MongoDB** - Stores users, events, alerts, authorities, disasters, shelters, registrations, and pending approvals.
- **Motor** - Provides the asynchronous MongoDB client used by the FastAPI application.
- **PyMongo** - Provides MongoDB driver functionality and the `bson.ObjectId` type used for document IDs.
- **Pydantic** - Defines request and response models and validates API data.
- **Pydantic Settings** - Loads typed application configuration from environment variables and the backend `.env` file.
- **CORS middleware** - Allows the configured frontend origin to call the backend API from a browser.
- **JWT authentication** - Creates and verifies signed access tokens for authenticated API requests.
- **bcrypt password hashing** - Hashes and verifies email-login passwords.
- **APScheduler** - Runs periodic background jobs for expired alerts, completed events, and SACHET alert ingestion.
- **pandas** - Reads and normalizes government disaster data from CSV files before importing it into MongoDB.
- **Async HTTP clients** - Makes non-blocking requests to Google OAuth, Groq, Tavily, and NewsAPI using `httpx`.

### External Services and Data Sources

- **Google OAuth 2.0** - Supports sign-in with Google and retrieves verified Google identity information.
- **Groq API** - Powers the Kavach AI chat assistant and AI-generated disaster summaries.
- **Tavily Search API** - Supplies recent web-search context for time-sensitive disaster questions.
- **NewsAPI** - Provides disaster-related news for a selected district when configured.
- **NDMA SACHET CAP feed** - Supplies government emergency alerts in Common Alerting Protocol XML format.
- **Data.gov CSV input** - Provides an optional import path for historical or government disaster records.

## Python Standard-Library Modules Used

These modules are included with Python and do not need to be installed separately:

- **`asyncio`** - Runs asynchronous seed and service operations from scripts.
- **`contextlib`** - Provides the asynchronous lifespan context manager for FastAPI startup and shutdown handling.
- **`datetime`** - Handles timestamps, token expiry, alert expiry, event dates, and scheduler comparisons.
- **`functools`** - Provides `lru_cache` for caching application settings.
- **`json`** - Encodes and decodes JSON in backend test requests.
- **`re`** - Removes model thinking tags from Groq responses.
- **`subprocess`** - Starts the backend process in the self-test script.
- **`sys`** - Adjusts the Python import path and accesses the active Python interpreter in tests.
- **`time`** - Waits for the backend to start during the self-test script.
- **`typing`** - Supplies type hints such as `Optional` and `List`.
- **`urllib.request` and `urllib.error`** - Makes HTTP requests and handles HTTP errors in the self-test script.
- **`xml.etree.ElementTree`** - Parses NDMA SACHET CAP XML alerts.

## Python Dependencies

The versions below are declared in `kavach-backend/requirements.txt`.

- **`fastapi==0.115.0`** - Web framework used to define the REST API and its route dependencies.
- **`uvicorn[standard]==0.30.0`** - ASGI server used to run `app.main:app` locally.
- **`motor==3.5.0`** - Async MongoDB driver used by application routes and services.
- **`pymongo==4.8.0`** - MongoDB driver package that also provides BSON utilities such as `ObjectId`.
- **`pydantic==2.9.0`** - Validation and serialization models for API requests and responses.
- **`pydantic-settings==2.5.0`** - Environment-based settings management for database, API, OAuth, JWT, and frontend configuration.
- **`python-jose[cryptography]==3.3.0`** - Encodes and decodes JWT access tokens; the cryptography extra supplies cryptographic support.
- **`authlib==1.3.1`** - OAuth and authentication toolkit declared for the backend authentication stack; the current Google flow directly uses `google-auth` and `httpx`.
- **`httpx==0.27.0`** - Async HTTP client for Google token exchange and external AI, search, and news APIs.
- **`apscheduler==3.10.4`** - Schedules recurring asynchronous maintenance and alert-ingestion jobs.
- **`pandas==2.2.2`** - Loads and transforms Data.gov-style CSV disaster data.
- **`python-dotenv==1.0.1`** - Supports loading environment variables from `.env` configuration files.
- **`google-auth==2.34.0`** - Verifies Google OAuth ID tokens and extracts trusted user identity claims.
- **`passlib[bcrypt]==1.7.4`** - Declared password-hashing dependency with bcrypt support; the current implementation imports and calls the `bcrypt` package directly.

The `bcrypt` package is required by the `passlib[bcrypt]` extra and is used directly by
`kavach-backend/app/password.py` for password hashing and verification.

## Running Locally

- **Frontend:** from `kavach-frontend`, run `npm install` and then `npm run dev`.
- **Backend:** from `kavach-backend`, run `pip install -r requirements.txt`, configure `.env`, and run `uvicorn app.main:app --reload --port 8000`.
- **Both services:** run `start-all.ps1` from the repository root after configuring the backend environment and starting MongoDB.
