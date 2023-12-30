# Wish.com Jarvis
#### Description: A personal task manager
#### Hosted on: https://hbfan2305.pythonanywhere.com/

## [app.py](app.py)
A python flask application was used as the backend of the project. imports sqlite3, a SQL database manager that has all the necessary functionality for my use case. Initializes the flask application with `app = Flask(__name__)`

### create_connection
A function that connects to a sqlite database, gracefully handles exceptions

### index
Homepage of website, implements the SAD(System to Alleviate Depression). 
- On `GET`(`else:`), data from the 'sad' table is obtained and processed into a python list. A random item in the array is selected, and passed into the jinja placeholder `SAD` in `index.html`, and an `active` class is passed into the `active1` placeholder, to highlight the active tab in the navigation bar
- On `POST`, the json input is parsed into a string(`"".join(txt)`) and placed into a list so that it plays nice with `db.execute()`. The code tries to input the POSTed text into the 'sad' table, and takes advantage of the `UNIQUE` condition of the only column in the table to prevent duplicates in the table by catching the `sqlite3.IntegrityError` exception, and returns a human-friendly response to the client that performed the POST.

### todo
Implements the "to-do" tab. 
- On `GET`(`else:`), the `to-do.html` template is rendered and the second link set to `active` with the jinja placeholder `active2`
- On `POST`, the code checks for the included flag in the second item of the POSTed json array, and manipulates the dictionary in the first item of the array
    - A `0` flag indicates an insertion into the 'todo' table of the text(`txt`) of the task, and sets the flag of the task as 0, representing an unfocused task. 
    - A `1` flag indicates a task has been focused on. The task is found by its id, and its flag updated to 1, indicating a focused task
    - A `2` flag indicates a task has been completed. The task is selected as above, and its flag is updated to 2, indicating a finished task
    - A `3` flag indicates a task has been unfocused. The task is selected, and its flag is updated to 0, an unfocused task
    - A `4` flag indicates a clearing of all completed tasks, using `DELETE FROM` and selecting tasks with a 2 flag

### todo_data
Implements the bulk retrieval of data from the 'todo' table
Each row of of `db.execute("SELECT * FROM todo")` parsed into a dictionary, with `db.row_factory = dict_factory`, and each row is added to a list which is parsed into json and returned to the client

### plans
Implements the "future-plans" tab.
- On `GET`, the `plans.html` template is rendered with the third navigation link set to `active`
- On `POST`, the code also checks for an included flag on the second item in the POSTed json array, and manipulates the dictionary in the first item of the array
    - A `0` flag indicates inserting a new plan item. The log in the POSTed dictionary is parsed from a list into a string, with a "|" delimiter. The text(`data[0]["txt"]`), urgency(`data[0]["urg"]`), importance(`data[0]["impt"]`), and the stringified log(`data[0]["log"]`) is placed in a list and inserted into the "todo" table
    - A `1` flag indicates updating a plan item. Again the log is parsed into a string, and text, urgency, importance and log updated. The correct plan is selected with the included id.
    - A `2` flag indicates a delete operation. The correct plan is found with the id, and the plan item deleted.

### plans_data
Implements the bulk retrieval of plans data. As with todo_data, each row of `db.execute("SELECT * FROM plans")` is parsed into a dictionary, but before adding the dictionary to the output list, the log is parsed from a string into a list by splitting at the "|" delimiter. The output list is then returned to the client

### tnw
Implements the 'Time and Weather' tab. Nothing spectacular, just rendering `tnw.html` and setting the fourth navigation link to active

### dict_factory
Implements parsing an sqlite row tuple into a dictionary. Iterates through `cursor.description` to get each column name, and for each item in `row` the corresponding column name is paired with it using `zip(fields, row)`, and added to a dictionary (Credit: https://docs.python.org/3/library/sqlite3.html#how-to-create-and-use-row-factories)

## [data.sqlite](data.sqlite)
Implements the backend SQL database for Wish.com Jarvis.

### todo
Table that stores the text of a task item under the column "txt" and the status of a task in the column "flag". A simpler implementation than a table each for unfocused, focused and completed tasks as shifting between each status is as simple as updating a value in a single column

### plans
Table that stores plan items. The name for each plan is stored under "txt", the urgency of the plan is stored under "urg", the importance of the plan is stored under "impt" and the plan's log is stored under "log". The log is stored as text, delimited by "|", as text is a well-supported sqlite datatype and parsing between a string and a list is relatively trivial in python, using `join()` and `split()`

### sad
Table that stores encouraging statements in a single column as part of the SAD(System to Alleviate Depression)

## [templates/layout.html](templates/layout.html)
Implements the following:
- In `head`: UTF-8 charset, responsive viewport, links to [bootstrap](https://getbootstrap.com/), links to the overall stylesheet [styles.css](static/styles.css), and jinja templates to additional links and titles
- In `body`: 
    - Responsive navigation bar, with vertical bars (`class="vert"`) delimiting tabs when fully expanded. The active tab is underlined, and activated by passing `active` into one of the four jinja placeholders(`active1`-`4`)
    - When the viewport width decreases beyond the bootstrap `sm` breakpoint, the navigation bar becomes a dropdown with a button to reveal the dropdown. Some text (`Navigation menu:`) indicates the purpose of the dropdown button
    - A 'responsive buffer' which displaces the content of the website from the top of the page as if the navigation bar was there; prevents content from disappearing behind the fixed navigation bar
    - jinja placeholders to add additional content

## [templates/index.html](templates/index.html)
Implements the following:
- In `head`: 
    - [plans.css](static/plans.css) which provides css for the "plans" section of index
    - [index.css](static/index.css) providing css for most other elements in index
    - [time-colors.css](static/time-colors.css) which provides gradient backgrounds for greeting header, credit to [Peter Bork](https://codepen.io/bork/pen/WNrmWr)
    - [to-do.js](static/to-do.js) which provides functionality to the "to-do" side of index
    - [index-plans.js](static/index-plans.js) which provides functionality to the "plans" side of index
    - [index.js](static/index.js) provides functionality for the remaining components of index
- In `body` (from top to bottom, left to right):
    - a "widget" for temperature in New Orleans, LA, a greeting header with a background header that changes as the day progressess, and a "widget" for humidity in New Orleans, all in a horizontal header
    - A readout of the current time and date in New Orleans
    - An input box (hidden during the day, appears at night) for the SAD
    - An output for erroneous inputs
    - A `h3` tag for an encouraging statement
    - A task menu with
        - an input box
        - a `p` tag for warnings of erroneous inputs
        - `list-group`s for focus tasks, unfocused tasks, and completed tasks and their associated headers
    - A grid of long-term plans

## [templates/to-do.html](templates/to-do.html)
- In `head`: links to [to-do.css](static/to-do.css) and [to-do.js](static/to-do.js) to provide styling and functionality
- In `body`: A task menu as in [index.html](#templatesindexhtml) with
    - an input box
    - a `p` tag for warnings of erroneous inputs
    - list-group`s for focus tasks, unfocused tasks, and completed tasks and their associated headers

## [templates/plans.html](templates/plans.html)
- In `head`: links to [plans.css](static/plans.css) and [plans.js](static/plans.js) to provide styling and functionality
- In 'body':
    - A text input for the names of new plans
    - Two sliders for urgency and importance, with their associated labels and a `p` tag to indicate the value of the slider position
    - An output for warnings of erroneous inputs
    - A submit button
    - A scatterplot graph background, with dots representing an individual plan. The information in each plan can be viewed by clicking on the dot

## [templates/tnw.html](templates/tnw.html)
- In `head`: links to [tnw.css](static/tnw.css) and [plans.js](static/tnw.js) to provide styling and functionality
- In `body`: A header for `New Orleans, LA, USA` on the left, along with a date/time readout for New Orleans below the header and widgets for temperature, humidity and climate. The right side is similar, but for Singapore

## [static/index.js](static/index.js)

### global variables
- month: a list of the months of the year
- weekday: a list of the days of the week
- prev: represents the previous hour, to check for a change in time
- prevmin: similar to prev but for minutes
- Cols: a dictionary of r, g, and b values for a color that corresponds to a word
- NOLA_COORD: coordinates of New Orleans, LA, USA

### Cols
Constructor that represents a color with r, g, and b values

### postJSONSAD
posts an encouraging statement inputted by the user, and displays the error if the server responds with an error

### getDate
returns a list, the first two being a HTML-formatted date/time string and the second the current hour in New Orleans' timezone

### setLayout
sets the background of the greeting header based on the current hour and selects the correct layout of the homepage based on the current hour

### updateTime
calls [getDate](#getdate) for the date/time string(`time`) and a multiline date/time string for slimmer viewports(`altTime`) every 50 milliseconds

### updateLayout
gets the current hour using [getDate](#getdate) and checks if the hour has advanced every 2 seconds by checking against the global `prev` variable. If the hour has advanced, set `prev` to the current hour and call [setLayout](#setlayout) to set the appropriate homepage layout

### tempColMix
gets a colour based on a weighted average of r,g and b values of two different temperature colors, with the weights being the temperature's proximity to various threshold values. Calls [ColMix](#colmix) to "mix" the colors

### precipColMix
similar to [tempColMix](#tempcolmix), but for precipitation values and colours

### ColMix
generates a new color based on how much of the first color should be in the resultant color

### tempStat
returns a brief description of an input temperature

### precipStat
returns a brief description of an input humidity

### updateTemp
Sets the color, temperature, and description of the temperature widget

### updatePrecip
Sets the color, temperature, and description of the humidity widget. Changes the color of text to improve contrast for different background colors

### updateWeather
gets weather data from [Open Weather Map](https://api.openweathermap.org), and calls [updateTemp](#updatetemp) and [updatePrecip](#updateprecip)

### mornLayout
sets the greeting header to "Good Morning!"

### aftnLayout
sets the greeting header to "Good Afternoon!"

### nitelayout
sets the greeting header to "Good Night!" and reveals the encouraging sentence input

### addZero
a helper function to as a zero in front of one-digit numerals

### makePlanGrid
Clears all plans displayed in the plans section of index, and creates a new tooltip for each plan in itemList in [index-plans.js](#staticindex-plansjs)

### killChildren
a helper function to clear all child elements of a parent element

### inputSAD
POSTs the encouraging sentence inputted by the user, and clears the input field

### docuemnt.addEventListener
initalises input fields, sets the layout of index and begins updating weather widgets every minute

## [static/index-plans.js](static/index-plans.js)

### global variables
- itemList: A list that stores dictionaries that represent plan items

### logJSONData
calls `fetch("/plans/data")` and loads the requested data in the JSON array into itemList, then calling [makePlanGrid](#makeplangrid) in [index.js](#staticindexjs) to display the plan items

### postJSON
calls `fetch` with `method: "POST"` to POST a dictionary representing a plan along with the necessary operation indicated by the [flag](#plans), then calling [logJSONData](#logjsondata) if the flag is `0` or `2`, indicating a new insertion and a deletion, respectively

### makeToolTip

### editSwitch
refer to [editSwitch](#editswitch-1) in [plans.js](#staticplansjs)

### showEdit
refer to [showEdit](#showedit-1) in [plans.js](#staticplansjs)

### hideEdit
refer to [hideEdit](#hideedit-1) in [plans.js](#staticplansjs)

### logSwitch
refer to [logSwitch](#logswitch-1) in [plans.js](#staticplansjs)

### showLog
refer to [showLog](#showlog-1) in [plans.js](#staticplansjs)

### hideLog
refer to [hideLog](#hidelog-1) in [plans.js](#staticplansjs)

### focusSwitch
alternates between calling [setFocus](#setfocus) and [removeFocus](#removefocus)

### setFocus
makes the background of a tooltip green

### removeFocus
makes the background of a tooltip white

### addLog
refer to [addLog](#addlog-1) in [plans.js](#staticplansjs)

## [static/to-do.js](static/to-do.js)

### global variables
- todo: a list of unfocused tasks
- focus: a list of focused tasks
- done: a list of completed tasks
- reEmpty: a regular expression for whitespace

### logJSONDataTodo
Fetches the latest tasks from the server and slots each task into the correct list (`todo`, `focus`, or `done`) based on their flag, where
- `0` represents an unfocused task
- `1` represents a focused task
- `2` represents a completed task.
Calls [clearDone](#cleardone) to clear the completed task list if necessary, and updates the task lists with [updateLists](#updatelists)

### postJSONTodo
POSTs a list containing a dictionary representing a task that includes the task's id, its text the task's flag, and another [flag](#todo) that indicates an operation to be carried out. If the flag was an insertion (`0`), then the task data is updated with [logJSONTodo](#logjsondatatodo)

### makeForm
Generates the unfocused task list, and initializes each item to move to the focused list when it is clicked if the task belongs to the unfocused list

### makeFormFocus
Generates the focused task list, while adding a button that will move the task to the completed  list when clicked(`btn1`) by calling [returnItem](#returnitem) and another button which will return the task to the unfocused list(`btn2`)

### killChildren
Clears child elements of any parent element

### updateLists
Clears child elements of all three tasklists, and generates all three tasklists with data updated in [logJSONDataTodo](#logjsondatatodo)

### returnItem
moves a task from the focus list to the unfocused list, and POSTing the shifted task to the server with a [flag](#todo) of `1` to update the database accordingly

### completeItem
moves a task from the focus list to the completed list, and POSTing the shifted task to the server with a [flag](#todo) of `2` to update the database accordingly

### clearDone
Checks the current date against the date of the first item in the completed list, and POSTs a [flag](#todo) of `4` to clear all completed items if the dates do not match (a day has passed)

### addTask
Gets the value of the task text input field(`input`), checks if the valuse is empty, and if not POSTs the new task to the server with a [flag](#todo) of `0` to insert a new task into the database, else issue a warning for an empty input

### warning
issues a warning for an empty input which clears after 3 seconds

### docuemnt.addEventListener
initializes the task input field and gets task data from the server with [logJSONDataTodo](#logjsondatatodo)

## [static/plans.js](static/plans.js)

### global variables
- itemList: A list that stores dictionaries that represent plan items
- reEmpty: A regular expression for whitespace
- data: A wild debug variable :D pls ignore thx

### Item
creates a new Item object representing a plan item

### logJSONData
calls `fetch("/plans/data")` and loads the requested data in the JSON array into itemList, then calls [makScatter](#makescatter) to generate a scatterplot based on urgency and importance

### postJSON
calls `fetch` with `method: "POST"` to POST a dictionary representing a plan along with the necessary operation indicated by the [flag](#plans), updating the scatterplot with [makScatter](#makescatter) only when the flag is 0 or 2, indicating an insertion and deletion respectively

### initSlider
Initialises sliders to output the value of the slider on every input

### addItem
Gets the slider elements for urgency and importance (`range2` and `range1` respectively) and the input field element of the new plan item(`itemInput`). Checks if the input field is empty, and if not creates a new plan item(`newItem`) using the `Item` constructor and the values of the input fields above, posts the new item and empties the text input field. Else, issue a warning for an empty input

### makeToolTip
creates a tooltip with (bear with me here):
- the tooltip itself (`tTip`)
- the name of the plan (`h5`)
- its urgency and importance in plaintext (`p1` and `p2`)
- a button to hide the tooltip (`exit`) and an image to indicate its purpose of concealment (`img`)
- a button to delete the plan item (`del`)
- a button to show or hide the plan's log (`logShow`)
- a button to show or hide input fields to edit the plan's urgency and importance, or add log items (`edit`)
- two number input fields and their associated labels for
importance and urgency, which updates both the stored values or urgency and importance and updates the position of the dot that represents the plan upon user input (`number 1`, `number2`, `label1` and `label2`)
- A button to revert recent changes in urgency or importance(`cancel`)
- A text input field for new log items that also adds log items upon pressing enter (`loginput`)
- A button to add a log item (`logSubmit`)

### editSwitch
A function to alternate between calling [showEdit](#showedit) and [hideEdit](#hideedit)

### showEdit
Updates button text to "Save", stores initial values in variables, initializes the "cancel" button with those initial values, replaces text with input fields by changing the `display` property

### hideEdit
Updates button text to "Edit", hides input fields, and displays plaintext fields by changing the "display" property, while updating values displayed in plaintext

### logSwitch
A function to alternate between calling [showEdit](#showlog) and [hideEdit](#hidelog)

### showLog
Updates button text to "Show Log", iterates through each item in `d.log` (the log for a plan item) and adds each item as a `li` into the tooltip

### hideLog
Gets all `li` elements in the tooltip, and while there are still `li` elements, remove the first `li` element

### addLog
Adds a log item to the log list of a dictionary representing a plan item, refreshes the displayed loglist by calling [hidelog](#hidelog-1) and [showLog](#showlog-1), updates [logSwitch](#logswitch-1) to account for the displayed log list, and POSTs the updated plan item with [postJSON](#postjson-1), with a `1` flag to indicate an update operation

### makeScatter
For each item in itemList, the function makes a scatterplot of dots(`dot`) with a position based on urgency(`d.urg`) and importance(`d.impt`) which will display a tooltip(`tTip`) when clicked

### updatePlot
clears the plan scatterplot and refreshes itemList with up-to-date data from [logJSONData](#logjsondata-1)

### clearpoints
clears all children of the scatterplot element which does not have an id of `img-bg`

### warning
issues a warning to input content

### document.addEventListener
initialises input fields and gets the latest list of plan items

## [static/tnw.js](static/tnw.js)

### global variables
- month: a list of the months of the year
- weekday: a list of the days of the week
- API_KEY: an API_KEY for weather data from [Open Weather Map](https://openweathermap.org/api). If you wish to use this for your own purposes, please use a different API_KEY
- prev: represents the previous minute, to check for a change in time
- ICON_MAP: each key represents an icon symbol used to the API, mapped to a filename of SVG files with weather icons (Credit: [basmilius](https://github.com/basmilius/weather-icons.git))
- SG_COORD: coordinates of Singapore, Singapore
- NOLA_COORD: coordinates of New Orleans, LA, USA
- Cols: a dictionary of r, g, and b values for a color that corresponds to a word

### Cols
refer to [Col](#cols) in [index.js](#staticindexjs)

### tempCol
refer to [tempColMix](#tempcolmix) in [index.js](#staticindexjs)

### precipCOlMix
refer to [precipColMix](#precipcolmix) in [index.js](#staticindexjs)

### ColMix
refer to [ColMix](#colmix) in [index.js](#staticindexjs)

### tempStat
refer to [tempStat](#tempstat) in [index.js](#staticindexjs)

### precipStat
refer to [precipStat](#precipstat) in [index.js](#staticindexjs)

### updateTemp
refer to [updateTemp](#updatetemp) in [index.js](#staticindexjs)

### updatePrecip
refer to [updatePrecip](#updateprecip) in [index.js](#staticindexjs)

### updateClim
Sets the icon and text of the climate widget based on the icon code in the weather API data and the description given in the same API data

### updateWeather
calls [updatePrecip](#updateprecip), [updateTemp](#updatetemp) and [updateClim](#updateclim) for Singapore(`sg`) and New Orleans(`nola`) weather data

### updateTime
Calls [getDate](#getdate-1) for a date/time string every 50 milliseconds

### getDate
Gets the time in Singapore and New Orleans based on the zone inputted (`1` or `2`), bu setting the timezone of the `Date` object with `toLocaleString`

### addZero
A helper function to add a zero in front of single-digit numbers

### document.addEventListener
Begin updating time and weather for Singapore and New Orleans, and make an API call every 10 minutes

# This was Wish.com Jarvis
