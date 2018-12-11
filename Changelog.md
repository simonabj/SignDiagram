# Version 0.90a
## User Visible Changes

### Additions & Tweaks
* Canvas now scales with size of viewport to avoid overlap.
* Added Changelog for recording changes
* Added SignDiagram Title to startup modal
* New panel for tools and settings added.
* When typing function declaration or limit, enter works as the Add Function button
* Added button to re-render display canvas
* Added button to render user-defined sized image
* Added panel to display CAS-commands and output

### Fixes
* Fixed bug where duplicate x-value appeared when the upper bound and the highest root are equal.
* Fixed bug where a function could be added with an empty limit, or non-finite numeric value.
* Fixed bug where one could add a function with a lower limit greater than the upper limit

## System Changes

## Additions & Tweaks
* Function-adding now checks for validation using try-catch instead of elifs.
* More CSS-classes and IDs surrounding startup modal.
* More clauses added to function validation
