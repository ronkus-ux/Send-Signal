# General skills rules
This file defines basline engineering and product standards applied across this repository. 

## Code Organisation
Readable and maintainable codes is prioritised.

Large files are avoided. Features are organized into modules such as

- leads
- templates
- campaigns
- analytics
- settings

## Naming Conventions

- Files are named in kebab-case
- Components are named in PascalCase
- Functions are named in camelCase
- Constants are named in UPPER_SNAKE_CASE
- Variables are named in camelCase


## Data Validation
Client input is treated as untrustworthy. All inputs is validated and sanitized before use.

Validation occurs on the server side before data becomes persistent or before message is being sent to users.

Phone numbers are normalised before storage.

Messaging operations includes idempotency safeguards.

## Compliance enforcement
Messaging operations must respect opt-in and unsubscribe requirements.

Unsubscribe keywords are to be recognised and enforced.

Duplicate messages are to be prevented.

## User Interface (UI) Rules
UI styling follows the design tokens defined in design-tokens.tokens.json

Color usage must reference tokens defined in design-tokens.css

Typography must reference tokens defined in design-tokens.css

Spacing, border, radii, shadows will make use of Tailwind CSS utility classes.

Color and typography must reference tokens defined in design-tokens.css and not use Tailwind CSS utility classes.

Direct hex color usage is prohibited. 

Arbitrary font sizes are prohibited. All font sizes must be defined in design-tokens.css


## Product safety rules
Large message send must require user confirmation

Campaign execution must have controls for:
- pause
- stop
- resume
- cancel
- see progress review

## Testing expectations
Each feature includes verification of

- successful primary workflows
- invalid input behaviour
- compliance behaviour
- edge case behaviour