# Pathfinder
Vanessa, Lawrence, Corrin and Jessica's spring 2015 final project.
----
New Link: <a href = "http://yolorpg.chickenkiller.com/">http://yolorpg.chickenkiller.com/</a>
Link: <a >http://stuypathfinder.mooo.com</a> (May not be running yet but it's set up)
(never mind someone broke it)
<p>
[project video???]

Lawrence - Server + mongo/json/sorta js

Jessica - (CSS? + )mongo + flask + droplet stuff

Vanessa - js/html (w/ Corrin)

Corrin - js/html (w/ Vanessa)

idek????

Elements:
------
* Storing info (login, data, etc)
 * Auto save?
* Auto fill/calculate views
* Random dice generator

Timeline
-----
* Storing information
  *	Login (2 days)
  *	Tying login to information (3 days)
* Views that can get info from other views (1 week)
  *	References from other views (2 weeks)
  *	Views that are tied to the existence of other views (1 week)
* Random dice generator (1 day)

5/12/15 - Elements: login present. Using chat as basis for storage. Working on adapting it to database structure required for project. Working on js meant to show on the page itself.

5/20/15 - IP address working eey
<a href = "http://freedns.afraid.org/subdomain/">note to self</a> Continuing stat page stuff

5/21/15 - Got website working instead of studying for Ap's, I'm so good.

5/22/15 - Set up dns (stuypathfinder.mooo.com) and more stat page stuff.

5/23/15 - Char page setup.


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
