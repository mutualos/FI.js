/*!
  FI.js v1.2.2 (https://fijs.net/)
*/

/* Globals */
const fiContainerDataElement = document.getElementById('FIContainerData');
const fiContainer = JSON.parse(fiContainerDataElement.textContent || fiContainerDataElement.innerText);
let presenterObjects = {}; // Renamed global array
let presenterCategories = {};
let presentSorted = [];
let isDebugMode = true;

/* Search Globals */
const presenterTable = document.getElementById('presenterTable');
const presenterThead = document.getElementById('presenterThead');
const presenterTbody = document.getElementById('presenterTbody');

function $$maskString(str) {
    var shift_string  = mask_encryption; //document.getElementById('mask_encryption').innerHTML;
    var encrypted_string = '';
    for (let i = 0; i < str.length; i++) {
        let shiftCode = shift_string.charCodeAt(Math.min(i, shift_string.length-1));
        if (shiftCode >= 48 && shiftCode <= 57) {
            shift = shiftCode - 48;
        } else if (shiftCode >= 65 && shiftCode <= 90) {
            shift = shiftCode - 65;
        } else {
            shift = shiftCode - 97;
        }                 

        let charCode = str.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            encrypted_string += String.fromCharCode((charCode - 48 + shift) % 26 + 97);
        } else if (charCode >= 65 && charCode <= 90) {
            encrypted_string += String.fromCharCode((charCode - 65 + shift) % 26 + 65);
        } else if (charCode >= 97 && charCode <= 122) {
            // lowercase letters
            encrypted_string += String.fromCharCode((charCode - 97 + shift) % 26 + 97);
        } else {
            // non-alphabetic characters
            encrypted_string += str.charAt(i);
        }
    }
    return encrypted_string;
}

function highlightJSON(jsonInput) {
    try {
        // Ensure jsonInput is an object by parsing if it's a string
        const jsonObj = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;

        // Convert back to string with formatting for easy processing
        const prettyJson = JSON.stringify(jsonObj, null, 4);

        // Apply replacements in a specific order to avoid conflicts
        let highlightedJson = prettyJson
            .replace(/&/g, '&amp;') // Escape '&'
            .replace(/</g, '&lt;') // Escape '<'
            .replace(/>/g, '&gt;') // Escape '>'
            // Highlight keys
            .replace(/"([^"]+)"(?=:)/g, '<span class="json-key">"$1"</span>')
            // Highlight string values
            .replace(/:\s*"([^"]*)"/g, ': <span class="json-string">"$1"</span>')
            // Highlight numbers (considering negative and decimal numbers)
            .replace(/:\s*(-?\d+(\.\d+)?)/g, ': <span class="json-number">$1</span>')
            // Highlight true, false, null
            .replace(/:\s*(true|false|null)/g, ': <span class="json-boolean">$1</span>');

        return highlightedJson;
    } catch (e) {
        // Return error message if JSON processing fails
        return `<span class="json-error">Invalid JSON: ${e.message}</span>`;
    }
}

function $$packContainer() {
    if(fijsApi) {
        for(var elements in fijsApi) {
            const accordion_item = document.createElement("div");
            accordion_item.classList.add("accordion-item");
            const accordion_header = document.createElement("h5");
            accordion_header.classList.add("accordion-header");
            const accordion_button = document.createElement("button");
            accordion_button.classList.add("accordion-button");
            accordion_button.appendChild(document.createTextNode('API'));
            accordion_button.setAttribute("type", "button");
            accordion_button.setAttribute("data-bs-toggle", "collapse");
            accordion_button.setAttribute("data-bs-target", "#collapse_formula");
            accordion_button.setAttribute("aria-expanded", "true");
            accordion_button.setAttribute("aria-controls", "collapse_formula");
            accordion_header.appendChild(accordion_button);
            accordion_item.appendChild(accordion_header);
            const accordion_collapse = document.createElement("div");
            accordion_collapse.classList.add("accordion-collapse", "collapse");
            accordion_collapse.setAttribute("id", "collapse_formula");
            accordion_collapse.setAttribute("data-bs-parent", "#catalog_accordion");
            const accordion_body = document.createElement("div");
            accordion_body.classList.add("accordion-body");
            accordion_body.style['color']  = '#ff00ff';
            accordion_body.style['word-wrap'] = 'break-word';
            accordion_body.innerHTML = fijsApi[elements];
            accordion_body.innerHTML = highlightJSON(accordion_body.innerHTML);
            accordion_collapse.appendChild(accordion_body);
            accordion_item.appendChild(accordion_collapse);
            catalog_accordion.appendChild(accordion_item);
        }
    }
    for(var elements in fiContainer) {
        const accordion_item = document.createElement("div");
        accordion_item.classList.add("accordion-item");
        const accordion_header = document.createElement("h5");
        accordion_header.classList.add("accordion-header");
        const accordion_button = document.createElement("button");
        accordion_button.classList.add("accordion-button");
        accordion_button.appendChild(document.createTextNode(elements));
        accordion_button.setAttribute("type", "button");
        accordion_button.setAttribute("data-bs-toggle", "collapse");
        accordion_button.setAttribute("data-bs-target", "#collapse_" + elements);
        accordion_button.setAttribute("aria-expanded", "true");
        accordion_button.setAttribute("aria-controls", "collapse_" + elements);
        accordion_header.appendChild(accordion_button);
        accordion_item.appendChild(accordion_header);
        const accordion_collapse = document.createElement("div");
        accordion_collapse.classList.add("accordion-collapse", "collapse");
        accordion_collapse.setAttribute("id", "collapse_" + elements);
        accordion_collapse.setAttribute("data-bs-parent", "#catalog_accordion");
        const accordion_body = document.createElement("div");
        accordion_body.classList.add("accordion-body");
        accordion_body.innerHTML = '{';
        accordion_body.style['color']  = '#f5f5f5';
        accordion_body.style['word-wrap'] = 'break-word';
        //if (elements == 'fijsApi') {
        //    accordion_body.appendChild(document.createTextNode(elements + " : " + JSON.stringify(fijsApi)));    
        //} else {
            for(var element in fiContainer[elements]) {  
                if (fiContainer[elements].hasOwnProperty(element)) {
                    accordion_body.innerHTML += '"' + element + '": ' + JSON.stringify(fiContainer[elements][element]) + ',';
                    //console.log(element, fiContainer[elements][element]);
                }
            }
        //}
        accordion_body.innerHTML = accordion_body.innerHTML.replace(/,\s*$/, "}");
        accordion_body.innerHTML = highlightJSON(accordion_body.innerHTML);
        accordion_collapse.appendChild(accordion_body);
        accordion_item.appendChild(accordion_collapse);
        catalog_accordion.appendChild(accordion_item);
    }
} 

function fiEvaluate(formula) {
    // Replace specific words starting with a number and ending with a letter
    formula = formula.replace(/\b(\d[a-zA-Z])\b/g, "'$1'");

    // Handle "NULL" specifically by replacing it with "null"
    formula = formula.replace(/\bNULL\b/g, "null");
    // List of JavaScript reserved words (partial list for demonstration; extend as needed)
    const reservedWords = ['break', 'case', 'catch', 'class', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'switch', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'const'];

    // Detect and rename reserved words
    reservedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        formula = formula.replace(regex, `_fi_${word}`);
    });
    
    // Decode HTML entities &lt;, etc. added 4/20/2024
    formula = decodeHtmlEntities(formula);
    
    if (isDebugMode) { console.log('formula pre-calc', formula); }
    try {
        // Split the formula into statements
        let statements = formula.split(';').map(s => s.trim()).filter(s => s.length > 0);
        const lastStatement = statements.pop(); // Remove and hold the last statement
        
        // Construct the new function body with explicit return for the last statement
        const functionBody = statements.join('; ') + (statements.length > 0 ? '; ' : '') + 'return ' + lastStatement + ';';

        // Attempt to evaluate the wrapped formula
        const fn = new Function(`'use strict'; ${functionBody}`);
        const result = fn();
        console.log('formula result', result);
        return result !== null ? result : "omit"; // Change "omit" to omit from presenter display
    } catch (error) {
        console.error('Error evaluating formula:', error.message);
        // Handle the error appropriately
        // You can return NaN, null, or any other value that indicates an error occurred
        return "Not a Number (NaN)";
    }
}

function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}


function clearPreviousResults() {
    // Clear the global object or any display elements as needed
    //the goal was to 'clear' displays, DOM objects, .. to restart the app, if circumstance demands it
    presenterObjects = []; // Clear previous data
    /*
    clear presenterTable
    if (document.querySelector("#eval-body")) {
        document.getElementById('eval-body').innerHTML = ''; // Clear previous displayed results
    }
    */
    // Add any other cleanup logic here
}

function showSpinner() {
    const spinner = document.getElementById("containerSpinner");
    if (spinner) {
        spinner.style.display = "block";
    }
}

async function hideSpinner() {
    const spinner = document.getElementById("containerSpinner");
    if (spinner) {
        spinner.style.display = "none";
    }
}

function getFormulaByPipe(filename) {  //legacy
    const fragments = fiContainer.fragments;
    console.log('fragments', fragments);
    // Lowercase the filename for case-insensitive comparison
    const filenameLower = filename.toLowerCase();

    // Iterate through the fragments to find a match based on pipeID within the filename
    for (const fragmentKey in fragments) {
        if (fragments.hasOwnProperty(fragmentKey)) {
            const fragment = fragments[fragmentKey];
            let pipeIDs = fragment.pipeID;

            // If pipeID is a string (e.g., JSON string), parse it to an array
            if (typeof pipeIDs === 'string') {
                try {
                    pipeIDs = JSON.parse(pipeIDs);
                } catch(e) {
                    console.error('Error parsing pipeIDs:', e);
                    continue; // Skip to the next fragment if parsing fails
                }
            }

            // Check if filename contains any of the IDs
            if (pipeIDs.some(id => filenameLower.includes(id.toLowerCase()))) {
                return fragment.formula; // Return the formula directly
            }
        }
    }

    // If no match is found, return null or an appropriate message
    console.warn(`No formula found for file: ${filename}`);
    return null; // No matching formula found
}

function processLargePipeAsync(csvText, pipeFormula) {
    showSpinner();
    return new Promise((resolve, reject) => {
        try {
            // Directly invoke the processing function without expecting return value
            // Ensure parseAndEvaluateData modifies a global or passed reference
            const dataLines = csvText.split('\n').filter(line => line);
            const headers = dataLines[0].split(',').map(header => header.trim());  //CSV file header
            parseAndEvaluateData(dataLines.slice(1), headers, pipeFormula);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
    hideSpinner();
}

/*
function getFormula(pipeName) {
    const fragments = fiContainer.fragments;
    console.log('fragments', fragments);
    // Iterate over each fragment in the fragments object
    for (let key in fragments) {
        let entry = fragments[key];
        console.log('entry', entry);
        // Try to parse the pipeID assuming it's correctly formatted JSON now
        let ids;
        try {
            ids = JSON.parse(entry.pipeID);
            console.log('ids', ids)
        } catch (error) {
            console.error('Error parsing pipeID:', error);
            continue;
        }
        
        // Check if pipeName matches any of the identifiers listed under any type
        let found = false;
        Object.keys(ids).some(type => {
            return ids[type].some(file => {
                if (pipeName.toLowerCase().includes(file.toLowerCase())) {
                    found = true;
                    return true;
                }
                return false;
            });
        });

        if (found) {
            // If a match is found, return the formula
            return entry.formula;
        }
    }
    // Return null if no match is found
    return null;
}
*/

function getFormula(pipeName) {
    const fragments = fiContainer.fragments;
    console.log('Fragments:', fragments);

    for (let key in fragments) {
        const entry = fragments[key];
        console.log('Entry:', entry);

        let ids;
        try {
            ids = JSON.parse(entry.pipeID);
            console.log('Parsed IDs:', ids);
        } catch (error) {
            console.error('Error parsing pipeID:', error);
            continue; // Skip this iteration if parsing fails
        }
        
        let found = false;
        // Check against all keys (like 'files', 'api', etc.) dynamically
        Object.keys(ids).some(key => {
            if (Array.isArray(ids[key])) {
                found = ids[key].some(id => {
                    return pipeName.toLowerCase().includes(id.toLowerCase());
                });
                if (found) {
                    console.log(`Match found under key '${key}':`, entry.formula);
                    return true; // Stop searching if a match is found
                }
            }
            return false;
        });

        if (found) {
            return entry.formula; // Return the formula if a match is found
        }
    }

    console.log('No matching formula found for:', pipeName);
    return null; // Return null if no match is found
}


function readFileAsync(file, pipeFormula) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            processLargePipeAsync(text, pipeFormula)
                .then(resolve)
                .catch(reject);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function fetchApiDataAsync(apiName, pipeFormula, apiData) {
    return new Promise((resolve, reject) => {
        try {
            const csvText = convertApiDataToCSV(apiData);
            processLargePipeAsync(csvText, pipeFormula)
                .then(resolve)
                .catch(reject);
        } catch (error) {
            reject(error);
        }
    });
}

function convertApiDataToCSV(data) {
    try {
        // Assuming `data` is already a JSON array of CSV strings as per your latest format
        // We will first convert it from a JSON string to an actual JavaScript array
        const rows = JSON.parse(data);

        // Join each row with a newline to create a proper CSV format
        return rows.join("\n");
    } catch (error) {
        console.error("Error converting API data to CSV:", error);
        return ""; // Return empty CSV on error
    }
}

document.getElementById('run').addEventListener('click', () => {
    const files = document.getElementById('container_files').files;
    if (!files.length) {
        //safety check for now, but can be removed when pipes don't include files
        console.log("No files selected.");
        return;
    }
    const processingPromises = [];
    
    // Optionally, clear previous results or state if needed
    // clearPreviousResults needs more development
    clearPreviousResults();
    
    Array.from(files).forEach(file => {
        const pipeFormula = getFormula(file.name);
        if (pipeFormula) {
            processingPromises.push(readFileAsync(file, pipeFormula));
        } else {
            console.error(`No matching formula for file ${file.name}. Skipping.`);
        }
    });

    Object.keys(fijsApi).forEach(apiName => {
        const apiData = fijsApi[apiName];
        //console.log('apiData', apiData)
        const pipeFormula = getFormula(apiName);
        if (pipeFormula) {
            processingPromises.push(fetchApiDataAsync(apiName, pipeFormula, apiData));
        } else {
            console.error(`No matching formula for API ${apiName}. Skipping.`);
        }
    });
    
    /*
    const processingPromises = Array.from(files).map(file => {
        // Determine the formula identifier for the current file
        //const pipeFormula = getFormulaByPipe(file.name);
        const pipeFormula = getFormula(file.name);
        if (!pipeFormula) {
            console.error(`No matching formula for file ${file.name}. Skipping.`);
            // Return a resolved promise to not break the Promise.all
            return Promise.resolve();
        }
        // Process each file and return the promise
        return readFileAsync(file, pipeFormula);
    });
    */

    Promise.all(processingPromises)
        .then(() => {
            $$displayEvaluatedResults(); // Call this function after all files are processed
        })
        .catch(error => console.error("Error processing files:", error))
        .finally(() => {
            containerModal.hide(); // Hide the modal after all processing
        });
});

function parseAndEvaluateData(lines, headers, pipeFormula) {
    let primaryIndex = headers.findIndex(header => header === fiContainer.presenter.primary);
    // If primaryIndex is -1, default it to 0 (the first column)
    if (primaryIndex === -1) {
        primaryIndex = 0;
    }
    
    // Define categorizeColumns Set
    const categorizeColumns = new Set(fiContainer.presenter.presenterColumns
        .filter(column => column.statistic === "categorize")
        .map(column => column.name));
    console.log('categorizeColumns', categorizeColumns);
    
    // Iterate over each line (excluding the header)
    lines.forEach(line => {
        const values = line.split(',').map(value => value.trim());
        const rowObject = {};
        const pipes_arg = {};
        // Construct pipes_arg based on CSV headers and values
        headers.forEach((header, index) => {
            pipes_arg[header] = values[index];
        });
    
        // Evaluate the formula for this line using pipes_arg
        const evaluatedResult = evaluateFormula(pipes_arg, pipeFormula);
        rowObject['Eval'] = evaluatedResult;
        rowObject['Q'] = 1;
        
        //populate presenter (presentation) columns according the container config
        // Match each columnName in fiContainer.presenter.presenterColumns with headers and include in rowObject
        fiContainer.presenter.presenterColumns.forEach(column => {
            const columnName = column.name; // Accessing the name property of each column object
            let columnIndex = headers.indexOf(columnName);
            let valueFound = columnIndex !== -1; // Flag to track if value is found directly by column name

            // If direct column name match not found or value is undefined, look through aliases
            if (!valueFound || typeof values[columnIndex] === 'undefined') {
                if (column.aliases && column.aliases.length > 0) {
                    for (let alias of column.aliases) {
                        let aliasIndex = headers.indexOf(alias);
                        if (aliasIndex !== -1 && typeof values[aliasIndex] !== 'undefined') {
                            // Found a matching alias with a defined value
                            columnIndex = aliasIndex;
                            valueFound = true;
                            break; // Stop looking through other aliases if a match is found
                        }
                    }
                }
            }
            
            // update rowObject identified by the column name 
            if (valueFound) {
                 // Check if the column name exists in dictionaries and replace the value if found
                if (fiContainer.dictionaries && fiContainer.dictionaries[columnName]) {
                    const dictionary = fiContainer.dictionaries[columnName];
                    let value = values[columnIndex];
                    value = dictionary[value] || value; // Fallback to original value if not found in dictionary
                    rowObject[columnName] = value;
                    console.log('rowObject', rowObject);
                } else {
                    rowObject[columnName] = values[columnIndex];
                }
            }

            /*
            // If a value has been found (either directly or through an alias), assign it to rowObject
            if (valueFound) {
                rowObject[columnName] = values[columnIndex];
            }
            */
        });
        
        // Assuming the key is found in the same row as defined by primaryIndex
        let key = values[primaryIndex];
        // Handle case where primaryIndex might be -1 or key is undefined
        if (!key) {
            console.error("Primary key not found in headers.");
            key = "Undefined Key"; // Fallback or handle appropriately
        }
        // Check for duplicate keys and combine values if found
        if (presenterObjects[key]) {
            // Merge rowObject into existing object for this key to merge values of duplicate keys
            Object.keys(rowObject).forEach(prop => {
                // Check if the property is marked as 'categorize' and replace the value
                if (categorizeColumns.has(prop)) {
                    presenterObjects[key][prop] = rowObject[prop];
                } else if (!(prop in presenterObjects[key])) {
                    // If it's a new property not present in presenterObjects, add it directly
                    presenterObjects[key][prop] = rowObject[prop];
                } else {
                    // Ensure both values are parsed as floats before summing
                    let existingValue = parseFloat(presenterObjects[key][prop]);
                    let newValue = parseFloat(rowObject[prop]);
                    // Check if both values are actually numbers
                    if (!isNaN(existingValue) && !isNaN(newValue)) {
                        // Sum numeric values
                        //console.log('sum log: ', key, newValue, existingValue, (existingValue + parseFloat(newValue)).toFixed(2), presenterObjects[key]['Q']);
                        // Store the sum and then format 
                        presenterObjects[key][prop] = Number.isInteger( presenterObjects[key][prop]) ? existingValue + newValue : (existingValue + parseFloat(newValue)).toFixed(2);
                        
                    } else {
                        // Handle as strings if one of the values is not a number
                        // This ensures concatenation only happens when summation isn't applicable
                        presenterObjects[key][prop] = presenterObjects[key][prop] ? `${presenterObjects[key][prop]}, ${rowObject[prop]}` : rowObject[prop];
                    }
                }
            });
        // in the event primary key is not present in presenterObjects
        } else {
            // For new keys, just assign rowObject and ensure float values are properly formatted
            Object.keys(rowObject).forEach(prop => {
                if (!isNaN(parseFloat(rowObject[prop])) && !Number.isInteger(rowObject[prop])) { //not a string or integer
                    rowObject[prop] = parseFloat(rowObject[prop]).toFixed(2);
                }
            });
            presenterObjects[key] = rowObject;
        }
    });
}

function sortPresenter() {
    console.log('presenterObjects', presenterObjects);
    // Convert presenterObjects into an array, including the original keys within each object
    const presenterArray = Object.entries(presenterObjects).map(([key, value]) => {
        return { ...value, ID: key }; // Include the original key in the object
    });

    // Sort the array based on the Eval values in descending order
    presentSorted = presenterArray.sort((a, b) => {
        const evalA = parseFloat(a.Eval);
        const evalB = parseFloat(b.Eval);
        return evalB - evalA; // For descending order
        //return evalA - evalB; // Uncomment for ascending order
    });

    // Now, presentSorted contains sorted objects with their original keys preserved
    // You can further process or display presentSorted as needed

    // Example: Log the sorted results
    //console.log(presentSorted);

    // Optionally, display the sorted results if you have a display function
    //$$displayEvaluatedResults(presentSorted);
}

function isNumericString(value) {
    // First, try to convert the value to a number using parseFloat
    const num = parseFloat(value);
    // Check if the parsed number is not NaN and if converting it back to a string equals the original value
    // The String(num) check ensures we're dealing with a value that fully converts to a number
    // without trailing characters (e.g., "123abc" would fail).
    return !isNaN(num) && String(num) === value.trim();
}

function $$displayEvaluatedResults(sort_presenter = true) {
    // Filter out entries where Eval contains 'omit' before sorting or assigning
    const filteredPresenterObjects = {};
    Object.entries(presenterObjects).forEach(([key, obj]) => {
        if (!obj.Eval || !obj.Eval.includes("omit")) {
            filteredPresenterObjects[key] = obj;
        }
    });
    
    presenterObjects = filteredPresenterObjects;
    if (sort_presenter) {
        sortPresenter(); // Update the presentSorted global, if applicable
    } else {
        presentSorted = presenterObjects;
    }
    console.log('presentSorted', presentSorted);
    const presenterColumns = fiContainer.presenter.presenterColumns;
    // Define your presenterColumns configuration -- example
    /*
    [
        {
            "name": "Eval",
            "type": "currency",
            "statistic": "median",
            "aliases": []
        },
        {
            "name": "Q",
            "type": "integer",
            "statistic": "sum",
            "aliases": []
        },
        {
            "name": "Rank",
            "type": "integer",
            "statistic": "null",
            "aliases": []
        },
        {
            "name": "Principal",
            "type": "currency",
            "statistic": "median",
            "aliases": []
        },
        {
            "name": "Balance",
            "type": "currency",
            "statistic": "median",
            "aliases": [
                "Current_Balance",
                "Previous_Average_Balance"
            ]
        },
        {
            "name": "Branch",
            "type": "integer",
            "statistic": "categorize",
            "aliases": [
                "Branch_Number"
            ]
        },
        {
            "name": "ID",
            "type": "dynamic",
            "statistic": "none",
            "aliases": []
        }
    ]
    */
    
    
    // Dynamically add new columns based on keys found in 'presentSorted'
    // Ensure 'Rank', Eval', and 'Q' columns are present and correctly positioned
    const rankIndex = presenterColumns.findIndex(element => element.name === "Rank")
    const evalIndex = presenterColumns.findIndex(element => element.name === "Eval");
    const qIndex = presenterColumns.findIndex(element => element.name === "Q");
    
    // If 'Rank' is not present, add it to the beginning
    if (rankIndex === -1) {
        presenterColumns.unshift({
            name: "Rank",
            type: "integer",
            statistic: "sum",
            aliases: []
        });
    } else if (rankIndex !== 0) {
        // If 'Rank' is present but not in the first position, move it to the front
        const rankColumn = presenterColumns.splice(rankIndex, 1)[0];
        presenterColumns.unshift(rankColumn);
    }
    
    // Ensure 'Eval' is right after 'Rank'
    if (evalIndex === -1) {
        // If 'Eval' is not present, insert it right after 'Rank'
        presenterColumns.splice(1, 0, {
            name: "Eval",
            type: "currency",
            statistic: "median",
            aliases: []
        });
    } else if (evalIndex !== 1) {
        // If 'Eval' is present but not in the second position, move it right after 'Rank'
        const evalColumn = presenterColumns.splice(evalIndex, 1)[0];
        presenterColumns.splice(1, 0, evalColumn);
    }
    
    
    // Ensure 'Q' is right after 'Eval'
    if (qIndex === -1) {
        // If 'Q' is not present, insert it right after 'Eval'
        presenterColumns.splice(2, 0, {
            name: "Q",
            type: "integer",
            statistic: "sum",
            aliases: []
        });
    } else if (qIndex !== 2) {
        // If 'Q' is present but not in the third position, move it right after 'Eval'
        const qColumn = presenterColumns.splice(qIndex, 1)[0];
        presenterColumns.splice(2, 0, qColumn);
    }
    
    // Dynamically add new columns based on keys found in 'presentSorted', starting from position 2
    const dynamicColumns = Object.keys(presentSorted[Object.keys(presentSorted)[0]] || {});
    dynamicColumns.forEach(key => {
        // Skip adding 'Rank', Eval', and 'Q' again
        if (key !== "Rank" && key !== "Eval" && key !== "Q" && !presenterColumns.some(column => column.name === key)) {
            // Add new column object for unrecognized keys
            presenterColumns.push({
                name: key,
                type: "dynamic", // Placeholder, determine actual type as needed
                statistic: "none", // Placeholder, adjust based on your requirements
                aliases: []
            });
        }
    });
    //console.log('presenterColumns', presenterColumns);
    // Locate category columns based on statistic property
    //const categoryColumnConfigs = presenterColumns.filter(column => column.statistic === "categorize");
    
    // Create and append the table header row based on presenterColumns
    const headerRow = document.createElement('tr');
    
    // Iterate over presenterColumns to ensure all defined columns are included
    presenterColumns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.name; // Use the name property as the header title
        headerRow.appendChild(th);
    });
    presenterThead.innerHTML = ''; // Clear existing header row if present
    presenterThead.appendChild(headerRow);

    // Initialize accumulators for columns based on the presenterColumns configuration
    // Example: Eval : {values: Array(200), count: 200}
    const evalAccumulators = presenterColumns.reduce((acc, column) => {
        if (column.statistic && column.statistic !== 'null') {
            acc[column.name] = { values: [], count: 0 }; // Adjust based on needed statistics
        }
        return acc;
    }, {});
    console.log('evalAccumulators', evalAccumulators);
    
    presenterTbody.innerHTML = ''; // Clear any existing rows
    // Create and append table body with rows
    Object.entries(presentSorted).forEach(([key, obj], index) => {
        const row = document.createElement('tr');
        // Data columns
        // obj Exampe: {Eval: '23285.03', Q: 1, Principal: '394227.99', Branch: '21.00', ID: '95062'} notice, Balance is missing & Column for Balance exists
        // Iterate over presenterColumns to ensure all defined columns are included
        presenterColumns.forEach(columnConfig => {
            if (columnConfig.name === 'Rank') {
                // Rank column based on sort (assuming it's always present as the first column)
                const rankTh = document.createElement('th');
                rankTh.scope = 'row';
                //rankTh.textContent = parseInt(key) + 1;
                rankTh.textContent = index + 1;
                row.appendChild(rankTh);
            } else {
                const td = document.createElement('td');
                // Check if the current column is represented in obj, either directly or via an alias
                let value = obj[columnConfig.name];
                if (value === undefined && columnConfig.aliases) {
                    columnConfig.aliases.some(alias => {
                        if (alias in obj) {
                            value = obj[alias];
                            return true; // Break the loop once a value is found
                        }
                        return false;
                    });
                }
                
                
                // Accumulate statistical values if applicable
                if (columnConfig.statistic && columnConfig.statistic !== 'null') {
                    // Initialize accumulator for this column if it doesn't exist
                    if (!evalAccumulators[columnConfig.name]) {
                        evalAccumulators[columnConfig.name] = { values: [], count: 0 };
                    }
                    
                    // For missing values, we might decide to not count them
                    // or handle them differently based on the application's needs.
                    if (value !== undefined && !isNaN(value)) {
                        const floatValue = parseFloat(value);
                        evalAccumulators[columnConfig.name].values.push(floatValue);
                        evalAccumulators[columnConfig.name].count++;
                    } else if (value != undefined) { //non-numeric are counted 
                        evalAccumulators[columnConfig.name].values.push(value);
                        evalAccumulators[columnConfig.name].count++;
                    }
                }
                
                
                // Handle special case for ID column; mask IDs
                if (columnConfig.name === "ID" && value !== undefined) {
                    td.id = value; // Assign ID if present
                    value = $$maskString(value); // Apply masking if necessary
                }
                
                // Format the value based on its type as defined in the column configuration
                if (!isNaN(value)) { // Check if the value is numeric before attempting to format
                    switch (columnConfig.type) {
                        case 'currency':
                            value = `$${parseFloat(value).toFixed(2)}`;
                            break;
                        case 'percentage':
                            value = `${parseFloat(value).toFixed(2)}%`;
                            break;
                        case 'integer':
                            value = parseInt(value).toString();
                            break;
                        case 'string':
                            value = value.toString();
                            break;
                        // Add more type handling as necessary
                    }
                } else if (columnConfig.type === 'string' && isNumericString(value)) {
                    // Format numeric strings if specified as 'string' type, for consistency
                    value = fiFunctions.formatNumber(value);
                }
                
                td.textContent = value;
                row.appendChild(td);
            }
        });
        presenterTbody.appendChild(row);

        // Ensure the final row respects this structure.
        if (index === Object.entries(presentSorted).length - 1) {
            const finalRow = document.createElement('tr');
            finalRow.className = 'summary-row'; // Adjust className as needed
        
            // Insert an empty cell for the "Rank" column in the summary row, or use 'Summary'
            const rankCell = document.createElement('td');
            rankCell.textContent = 'Summary'; // Adjust text as needed
            finalRow.appendChild(rankCell);
            
            // Process each column based on presenterColumns configuration
            presenterColumns.slice(1).forEach(columnConfig => { // Assuming 'Rank' is the first column and already handled
                console.log('columnConfig', columnConfig);
                const td = document.createElement('td');
                /*
                if (columnConfig.statistic === "categorize") {
                    // Here we directly call categorizeAndAggregate with the necessary data
                    // First, ensure we have the correct category column name and Eval values to pass
                    const categoryValues = evalAccumulators[columnConfig.name].values;
                    const evalValues = evalAccumulators['Eval'].values; // Assuming 'Eval' is the column to be aggregated
    
                    if (categoryValues && evalValues) {
                        let categoryAggregates = categorizeAndAggregate(categoryValues, evalValues);
    
                        // Formatting the aggregates for display
                        td.innerHTML = Object.entries(categoryAggregates).map(([category, evalSum]) => `${category}: ${evalSum}`).join('<br>');
                    } else {
                        td.textContent = '-';
                    }
                }*/
                if (columnConfig.statistic === "categorize") {
                    // Get the correct category column name and Eval values to pass
                    const categoryValues = evalAccumulators[columnConfig.name].values;
                    const evalValues = evalAccumulators['Eval'].values; // Assuming 'Eval' is the column to be aggregated
                
                    if (categoryValues && evalValues) {
                        let categoryAggregates = categorizeAndAggregate(categoryValues, evalValues);
                
                        // Instead of setting td.innerHTML, populate the global object
                        presenterCategories[columnConfig.name] = categoryAggregates;
                    }
                    // You might still want to indicate in the UI that data is available or processed
                    td.textContent = 'Visualized'; // Placeholder text
                    td.style.color = getRandomColor();
                } else if (columnConfig.statistic && columnConfig.statistic !== 'null') {
                    // Calculate the summary statistic value
                    let summaryValue = calculateStatistic(columnConfig.statistic, evalAccumulators[columnConfig.name]);
                    
                    if (isNaN(summaryValue) ) {
                        summaryValue = '-';
                    } else {
                        // Format the summary value based on the column's type
                        switch (columnConfig.type) {
                            case 'currency':
                                summaryValue = `$${parseFloat(summaryValue).toFixed(2)}`;
                                break;
                            case 'percentage':
                                summaryValue = `${parseFloat(summaryValue).toFixed(2)}%`;
                                break;
                            case 'integer':
                                summaryValue = parseInt(summaryValue).toString();
                                break;
                            // Add more type handling as necessary
                        }
                    }
                    td.textContent = summaryValue;
                } else {
                    td.textContent = '-'; // Or another placeholder for columns without a summary statistic
                }
                finalRow.appendChild(td);
            });
            // No statistical method for ID column
            const idTd = document.createElement('td');
            idTd.textContent = '-';
            finalRow.appendChild(idTd);
            presenterTbody.appendChild(finalRow);
            //generate Dashboard
            console.log('presenterCategories', presenterCategories);
            generateSelectionControls(Object.keys(presenterCategories));
            updateChartBasedOnSelection();
        }
    });
}

function categorizeAndAggregate(values, evalValues) {
    let categoryAggregates = {};
    values.forEach((value, index) => {
        if (!categoryAggregates.hasOwnProperty(value)) {
            categoryAggregates[value] = [];
        }
        categoryAggregates[value].push(evalValues[index]);
    });

    // Example: Summing 'Eval' values per category
    let categorySums = {};
    for (let [category, evals] of Object.entries(categoryAggregates)) {
        categorySums[category] = evals.reduce((acc, curr) => acc + curr, 0);
    }

    return categorySums;
}

function calculateStatistic(statistic, accumulator) {
    // Implement calculation logic for each statistic type
    // Placeholder switch statement for example
    switch (statistic) {
        case 'categorize':
            // Use the categorizeAndCount function for categorization
            return categorizeAndCount(accumulator.values);
        case 'sum':
            return accumulator.values.reduce((a, b) => a + b, 0).toFixed(2);
        case 'mean':
            return (accumulator.values.reduce((a, b) => a + b, 0) / accumulator.count).toFixed(2);
        case 'median':
            const sortedValues = accumulator.values.slice().sort((a, b) => a - b);
            const middleIndex = Math.floor(sortedValues.length / 2);
            if (sortedValues.length % 2 === 0) {
                // If even number of values, median is the average of the two middle numbers
                return ((sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2).toFixed(2);
            } else {
                // If odd, median is the middle value
                return sortedValues[middleIndex].toFixed(2);
            }
        case 'standard deviation':
            const meanForStdDev = accumulator.values.reduce((a, b) => a + b, 0) / accumulator.count;
            const squaredDiffs = accumulator.values.map(value => {
                const diff = value - meanForStdDev;
                return diff * diff;
            });
            let avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / accumulator.count;
            const stdDev = Math.sqrt(avgSquaredDiff);
            return stdDev.toFixed(2);
        case 'mode':
            let frequency = {};
            let maxFreq = 0;
            let modes = [];
            accumulator.values.forEach(value => {
                if (frequency[value]) {
                    frequency[value]++;
                } else {
                    frequency[value] = 1;
                }
                if (frequency[value] > maxFreq) {
                    maxFreq = frequency[value];
                    modes = [value];
                } else if (frequency[value] === maxFreq) {
                    modes.push(value);
                }
            });
            return modes.length === 1 ? modes[0].toFixed(2) : 'Multiple';
        case 'range':
            const sorted = accumulator.values.slice().sort((a, b) => a - b);
            const range = sorted[sorted.length - 1] - sorted[0];
            return range.toFixed(2);
        case 'variance':
            const mean = accumulator.values.reduce((a, b) => a + b, 0) / accumulator.count;
            const squaredDiffsToMean = accumulator.values.map(value => {
                const diff = value - mean;
                return diff * diff;
            });
            avgSquaredDiff = squaredDiffsToMean.reduce((a, b) => a + b, 0) / accumulator.count;
            return avgSquaredDiff.toFixed(2);
        case '10th percentile':
        case '25th percentile':
        case '50th percentile':
        case '75th percentile':
        case '90th percentile':
            const percentile = parseInt(statistic.split(' ')[0]);
            return calculatePercentile(accumulator.values, percentile).toFixed(2);
        case 'skewness':
            return calculateSkewness(accumulator.values).toFixed(2);
        case 'kurtosis':
            return calculateKurtosis(accumulator.values).toFixed(2);
        case 'min/max':
            const minValue = Math.min(...accumulator.values).toFixed(2);
            const maxValue = Math.max(...accumulator.values).toFixed(2);
            return `Min: ${minValue}, Max: ${maxValue}`;
        case 'minimum':
            return Math.min(...accumulator.values).toFixed(2);
        case 'maximum':
            return Math.max(...accumulator.values).toFixed(2);
        // Add cases for other statistics as needed
        default:
            return '-';
    }
}

function categorizeAndCount(values) {
    let categoryCounts = {};
    values.forEach(value => {
        if (categoryCounts.hasOwnProperty(value)) {
            categoryCounts[value] += 1;
        } else {
            categoryCounts[value] = 1;
        }
    });
    return categoryCounts;
}


function calculatePercentile(values, percentile) {
    const sortedValues = values.slice().sort((a, b) => a - b);
    const pos = (percentile / 100) * (sortedValues.length - 1) + 1;
    const base = Math.floor(pos) - 1;
    const rest = pos - base - 1;

    if (sortedValues[base + 1] !== undefined) {
        return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
    }
    return sortedValues[base];
}

function calculateSkewness(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const cubedDiffs = values.map(value => Math.pow(value - mean, 3));
    const sumOfCubedDiffs = cubedDiffs.reduce((a, b) => a + b, 0);
    const stdDev = Math.sqrt(values.map(value => Math.pow(value - mean, 2)).reduce((a, b) => a + b, 0) / n);
    return (n / ((n - 1) * (n - 2))) * (sumOfCubedDiffs / Math.pow(stdDev, 3));
}

function calculateKurtosis(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const fourthDiffs = values.map(value => Math.pow(value - mean, 4));
    const sumOfFourthDiffs = fourthDiffs.reduce((a, b) => a + b, 0);
    const stdDev = Math.sqrt(values.map(value => Math.pow(value - mean, 2)).reduce((a, b) => a + b, 0) / n);
    return (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3)) * (sumOfFourthDiffs / Math.pow(stdDev, 4)) - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

function generateSelectionControls(columnNames) {
    const controlsContainer = document.getElementById('dashboardControls');
    controlsContainer.innerHTML = ''; // Clear existing controls if any

    columnNames.forEach(name => {
        // Create a checkbox for each summary column
        const label = document.createElement('label');
        label.textContent = name;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `control-${name}`;
        checkbox.checked = true; // Optionally start checked
        label.prepend(checkbox);
        label.style = "margin-left: .5em";
        // Event listener for checkbox changes
        checkbox.addEventListener('change', (e) => {
            updateChartBasedOnSelection(); // Function to update the chart
        });

        controlsContainer.appendChild(label);
    });
}

function updateChartBasedOnSelection() {
    // Determine which categories are selected
    const selectedCategories = [];
    document.querySelectorAll('#dashboardControls input[type="checkbox"]:checked').forEach(checkbox => {
        const categoryName = checkbox.id.replace('control-', '');
        selectedCategories.push(categoryName);
    });

    // Prepare chart data for selected categories
    const chartData = prepareChartDataForSelectedCategories(selectedCategories, presenterCategories);

    // Update the chart
    const ctx = document.getElementById('summaryChart').getContext('2d');

    if (window.summaryChart) {
        window.summaryChart.destroy();
    }

    window.summaryChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            legend: {
                display: false, // This line removes the legend
                labels: {
                    // Custom formatter for legend text, assuming labels are already in "CategoryName Number" format
                    generateLabels: function(chart) {
                        return chart.data.datasets.map(dataset => ({
                            text: dataset.label, // Direct use, as dataset labels are formatted
                            fillStyle: dataset.backgroundColor,
                        }));
                    }
                }
            },
            title: {
                display: true,
                text: 'Categorized Summary'
            }
        }
    });
}

function prepareChartDataForSelectedCategories(selectedCategories, presenterCategories) {
    const labels = []; // Assuming these are your X-axis labels
    const datasets = [];

    selectedCategories.forEach((categoryName, index) => {
        const categoryData = presenterCategories[categoryName];
        if (!categoryData) return; // Skip if no data for this category
        
        // Generate a random color for each data point (bar) in the dataset
        const backgroundColors = Object.values(categoryData).map(() => getRandomColor());

        datasets.push({
            label: `${categoryName}`, // Directly use categoryName
            data: Object.values(categoryData), // Data points for each bar
            backgroundColor: backgroundColors, // Array of colors
            borderColor: backgroundColors.map(color => color.replace('0.7', '1')), // Slightly adjust for border
            borderWidth: 1,
        });

        // Populate labels from the first category data, assuming all categories share the same labels
        if (index === 0) {
            labels.push(...Object.keys(categoryData));
        }
    });

    return { labels, datasets };
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

function executeApiCall(formula) {
    const apiCallPattern = /@\{(\w+):\s*(\d+)\}/g;
    let match;

    while ((match = apiCallPattern.exec(formula))) {
        const [fullMatch, apiName, key] = match;

        if (apiName in fijsApi) {
            const apiData = JSON.parse(fijsApi[apiName]);
            if (key in apiData) {
                formula = formula.replace(fullMatch, apiData[key]);
            } else {
                console.error(`Key '${key}' not found in API '${apiName}'.`);
            }
        } else {
            console.error(`API '${apiName}' not found.`);
        }
    }
    return formula;
}

function executeFunctionCall(formula) {
    // Adjust the pattern to match FI.js function call syntax: $functionName(arguments)
    const fiFunctionPattern = /\$(\w+)\(([^)]*?)\)/g;

    let modified = false; // Flag to track if a replacement was made
    let match;

    // Use a loop to find and process each FI.js function call
    while ((match = fiFunctionPattern.exec(formula))) {
        const [fullMatch, functionName, argsString] = match;
        // Split and prepare arguments
        const args = argsString.split(',').map(arg => {
            const trimmedArg = arg.trim();
            return isNaN(Number(trimmedArg)) ? trimmedArg : Number(trimmedArg);
        });

        if (functionName in fiFunctions && typeof fiFunctions[functionName] === "function") {
            const result = fiFunctions[functionName](...args);
            formula = formula.replace(fullMatch, result.toString());
            modified = true; // Mark that a replacement was made
            break; // Exit the loop after the first replacement
        } else {
            throw new Error(`Function '${functionName}' not found.`);
        }
    }

    // If a replacement was made, re-evaluate the formula for additional function calls
    if (modified) {
        return executeFunctionCall(formula); // Recursive call to process the updated formula
    }

    // Return the formula after processing all function calls
    return formula;
}

function evaluateFormula(pipes_arg, pipeFormula) {
    if (isDebugMode) { console.log('pipes_arg', pipes_arg); }
    let formula;
    const editorElement = document.getElementById('editor');
    if (editorElement) {
        const htmlString = editorElement.innerHTML;
        formula = htmlString.replace(/<\/?span[^>]*>/g, ''); // Remove HTML formatting for processing
    } else {
        //based pipe_id
        formula = pipeFormula; // Fallback if no editor content
    }
    //console.log('formula', formula);

    // Replace pipes with their values
    Object.entries(pipes_arg).forEach(([key, value]) => {
        const replacement = value === '' ? 'null' : value;
        formula = formula.replace(new RegExp(`\\|${key}\\|`, 'g'), replacement);
    });

    // Replace objects with their values
    Object.entries(fiContainer.objects).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });
    
    // Evaluate and replace variables, including those defined with ternary expressions
    formula = evaluateAndReplaceVariables(formula, pipes_arg);

    // MOVED Handle relationships, dictionaries, and APIs in one step
    //formula = processFormulaElements(formula);
    
    // Execute FI.js function calls within the formula
    formula = executeFunctionCall(formula);
    
    
    // Handle relationships, dictionaries, and APIs in one step
    formula = processFormulaElements(formula);
    
    
    
    //debugger
    if (document.querySelector("#eval-body")) {
        document.querySelector("#eval-body").innerHTML += `<li class="list-group-item"><p class="mb-1">${formula}</p></li>`;
    }

    try {
        const result = fiEvaluate(formula); // Assumes fiEvaluate can handle the final formula
        if (isDebugMode) { console.log("Evaluation Result:", fiFunctions.formatUSD(result)); }
        return result;
    } catch (error) {
        console.error("Error evaluating formula:", error, formula);
        return NaN;
    }
}

function evaluateAndReplaceVariables(formula, pipes_arg) {
    // This function needs to find and replace variable declarations, evaluating any ternary expressions
    // For simplicity, focusing on the 'let' declarations and assuming direct or ternary assignments
    let variableContext = {};

    // Handle 'let' variable declarations (simplistic pattern)
    formula = formula.replace(/let\s+(\w+)\s*=\s*([^;]+);/g, (match, varName, expression) => {
        // Evaluate the expression, including possible ternary logic
        let evaluatedExpression = evaluateExpression(expression, pipes_arg);
        variableContext[varName] = evaluatedExpression;
        return ''; // Remove the variable declaration from the formula
    });

    // Replace variables in the formula with their evaluated values
    Object.keys(variableContext).forEach(varName => {
        formula = formula.replace(new RegExp(`\\b${varName}\\b`, 'g'), variableContext[varName]);
    });
    return formula;
}

function evaluateExpression(expression, pipes_arg) {
    // Simplify and safely evaluate ternary expressions, including those with literals and pipes_arg variables

    // Try to directly evaluate the expression for the specific case: '1 == 1 ? 1 : 0;'
    // This approach will be tailored to safely handle simple ternary expressions without using eval()
    const ternaryMatch = expression.match(/^\s*(.+)\s*==\s*(.+)\s*\?\s*(.+)\s*:\s*(.+)\s*$/);

    if (ternaryMatch) {
        // Extract parts of the ternary expression
        let [fullMatch, conditionLeft, conditionRight, truePart, falsePart] = ternaryMatch;

        // Attempt to resolve any variables from pipes_arg in the condition parts
        conditionLeft = resolveValue(conditionLeft.trim(), pipes_arg);
        conditionRight = resolveValue(conditionRight.trim(), pipes_arg);

        // Check condition and determine the outcome
        let outcome = (conditionLeft == conditionRight) ? truePart.trim() : falsePart.trim();

        // Resolve the outcome if it's a reference to a variable in pipes_arg
        outcome = resolveValue(outcome, pipes_arg);

        // Parse the outcome as a number if possible, otherwise return as is
        return isNaN(Number(outcome)) ? outcome : Number(outcome);
    }

    // Fallback for handling non-ternary or more complex expressions (extend as needed)
    return expression; // Return the original expression if not matched or handled
}

function resolveValue(part, pipes_arg) {
    // Check if part is a numeric literal, a string literal, or a variable in pipes_arg
    if (!isNaN(part)) {
        // It's a numeric literal
        return Number(part);
    } else if (pipes_arg.hasOwnProperty(part)) {
        // It's a variable in pipes_arg, return its value
        return pipes_arg[part];
    } else {
        // Assume it's a string literal or an unhandled case
        // Strip quotes if it's a string literal
        return part.replace(/^['"]|['"]$/g, '');
    }
}


function processFormulaElements(formula) {
    // Handle API calls (@{apiName: key})
    formula = formula.replace(/@\{(\w+)\s*:\s*([^}]+)\}/g, (match, apiName, keyOrExpression) => {
        if (apiName in fijsApi) {
            const apiData = typeof fijsApi[apiName] === 'string' ? JSON.parse(fijsApi[apiName]) : fijsApi[apiName];
            
            let resultKey;
    
            // Check if keyOrExpression is strictly numeric (and potentially convert to integer)
            if (/^\d+$/.test(keyOrExpression.trim())) {
                resultKey = parseInt(keyOrExpression.trim(), 10);
            } else if (/^".+"$/.test(keyOrExpression.trim())) { // Check if it's a quoted string
                resultKey = keyOrExpression.trim().slice(1, -1); // Remove quotes
            } else { // Assume it's an expression or a string without quotes
                try {
                    // Attempt to evaluate it as an expression
                    resultKey = new Function('return ' + keyOrExpression)();
                    if (typeof resultKey !== 'number' && typeof resultKey !== 'string') {
                        throw new Error("Result is neither a number nor a string");
                    }
                    else if (typeof resultKey === 'number') {
                        resultKey = Math.round(resultKey);  //numeric keys should be integers
                    }
                } catch (error) {
                    console.error(`Error evaluating key/expression '${keyOrExpression}' for API '${apiName}':`, error);
                    return match;
                }
            }
    
            if (resultKey in apiData) {
                return apiData[resultKey].toString();
            } else {
                console.error(`Key '${resultKey}' not found in API '${apiName}'.`);
                return match;
            }
        } else {
            console.error(`API '${apiName}' not found.`);
            return match;
        }
    });

    /*
    formula = formula.replace(/@\{(\w+)\s*:\s*(\w+)\}/g, (match, apiName, key) => {
        if (apiName in fijsApi) {
            const apiData = JSON.parse(fijsApi[apiName]);
            if (key in apiData) {
                return apiData[key].toString();
            } else {
                console.error(`API Key '${key}' not found in API '${apiName}'.`);
                return match;
            }
        } else {
            console.error(`API '${apiName}' not found.`);
            return match;
        }
    });
    */

    // Handle relationships (#{relationshipName: key})
    formula = formula.replace(/#\{(\w+)\s*:\s*(\w+)\}/g, (match, relationshipName, key) => {
        if (relationshipName in fiContainer.relationships) {
            const relationshipData = fiContainer.relationships[relationshipName];
            let found = false;
            for (const [classId, types] of Object.entries(relationshipData)) {
                if (types.includes(key.toString())) {
                    found = true;
                    return classId; // Replace notation with the class ID
                }
            }
            if (!found) {
                console.error(`Key '${key}' not found in Relationship '${relationshipName}'.`);
            }
        } else {
            console.error(`Relationship '${relationshipName}' not found.`);
        }
        return match; // Return original notation if not found
    });
    
    // Handle dictionary lookups ({dictionaryName: key})
    formula = formula.replace(/\{(\w+)\s*:\s*([^}]+)\}/g, (match, dictName, key) => {
        //console.log('key', key.trim());
        if (dictName in fiContainer.dictionaries) {
            const dictionary = fiContainer.dictionaries[dictName];
            const trimmedKey = key.trim(); // Trim the key to remove leading and trailing spaces
            if (trimmedKey in dictionary) {
                return dictionary[trimmedKey].toString();
            } else {
                //console.error(`Key '${trimmedKey}' not found in Dictionary '${dictName}', returning false.`);
                return false;
            }
        } else {
            console.error(`Dictionary '${dictName}' not found. Formula Def:`, formula);
            return match;
        }
    });

    return formula; // Return the processed formula
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search_str');
    const searchButton = document.getElementById('serach_btn');
    let lastFocusedIndex = -1; // Keeps track of the last focused row
    
    //logout routine
    const logOutLink = document.getElementById('logOut');

    if (logOutLink) {
        // Add click event listener
        logOutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor action

            // Redirect to the logout URL
            window.location.href = logoutURL;
        });
    }

    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        const searchQuery = searchInput.value.toLowerCase().trim();

        // Convert NodeList to Array for easier manipulation
        const rows = Array.from(presenterTbody.querySelectorAll('tr'));

        // Remove highlighting from any previously highlighted row
        document.querySelectorAll('.highlighted-row').forEach(function(row) {
            row.classList.remove('highlighted-row');
        });

        let foundMatch = false; // Flag to indicate if a match was found during iteration

        // Start searching from the next row after the last focused row
        for (let i = lastFocusedIndex + 1; i < rows.length; i++) {
            if (rows[i].textContent.toLowerCase().includes(searchQuery)) {
                // Scroll the matching row into view, update lastFocusedIndex, and highlight row
                rows[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                rows[i].classList.add('highlighted-row');
                lastFocusedIndex = i;
                foundMatch = true;
                break; // Break the loop after finding the next match
            }
        }

        // If no match was found after the last focused row, restart search from the beginning
        if (!foundMatch) {
            for (let i = 0; i <= lastFocusedIndex; i++) {
                if (rows[i].textContent.toLowerCase().includes(searchQuery)) {
                    rows[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    rows[i].classList.add('highlighted-row');
                    lastFocusedIndex = i;
                    break; // Break the loop after finding the match
                }
            }
        }
    });
});
