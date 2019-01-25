# Version 0.90.3a
## User Visible Changes
* Division and grouping brackets now render better
* Fixed bug where MathJax stopped rendering
## System Changes
* Removed unused MathJax config values
* Changed default MathJax config file
* Disabled CAS-simplification of user input

# Version 0.90.2a
## System Changes
* Restricted MathJax access to PNG-fonts
* Removed approximately 30.000(12MB) of image fonts to improve file handling  

# Version 0.90.1a
## User Visible Changes
### Additions & Tweaks
* Fixed wrapping in CAS Commands tab
* Changed to using name of function instead of declaration in CAS Commands tab
* Converted Changelog to Markdown for better reading

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