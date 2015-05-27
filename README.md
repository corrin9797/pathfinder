# pathfinder
Vanessa, Lawrence, Corrin and Jessica's spring 2015 final project.
----
Link: <a href="http://stuypathfinder.mooo.com">http://stuypathfinder.mooo.com</a> (May not be running yet but it's set up)
[project video???]

Lawrence - Server + mongo/json/sorta js

Jessica - (CSS? + )mongo + flask + droplet stuff

Vanessa - js/html (w/ Corrin)

Corrin - js/html (w/ Vanessa)

idek????

Elements:
------
* storing info (login, data, etc)
 * auto save?
* auto fill/calculate views
* random dice generator

Timeline
-----
* Storing information
  *	Login (2 days)
  *	Tying login to information (3 days)
* Views that can get info from other views (1 week)
  *	References from other views (2 weeks)
  *	Views that are tied to the existence of other views (1 week)
* Random dice generator (1 day)

5/12/15 - elements: login present. using chat as basis for storage. working on adapting it to database structure required for project. working on js meant to show on the page itself.

5/20/15 - ip address working eey
<a href = "http://freedns.afraid.org/subdomain/">note to self</a> Continuing stat page stuff

5/21/15 - got website working instead of studying for aps I'm so good

5/22/15 - set up dns (stuypathfinder.mooo.com) and more stat page stuff

5/23/15 - char page setup


Database Structures

Database: User Info
{user: username,
pass: password}

Database: Modules
{type: pathfinder,
[stuff specific to pathfinder]}

Database: Character_Sheets
{user: name, 
type: pathfinder,
[stuff specific to type of game]}
