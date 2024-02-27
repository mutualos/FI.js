/*!
  FI.js v1.1.1 (https://fijs.net/)
*/
const fiContainerDataElement = document.getElementById('FIContainerData');
const fiContainer = JSON.parse(fiContainerDataElement.textContent || fiContainerDataElement.innerText);
let presenterObjects = {}; // Renamed global array
let presentSorted = [];

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

async function $$readFile(evt) {
    const files = evt.target.files;
    if (!files) return;
    for (var i=0; i < files.length; i++) {
        var result = await files[i].text();
        $$processor(result, String(id_filter.value.trim()), $$identify_pipe);
    }
    return true;
}

function $$read_all(evt) {
    if (document.getElementById("containerSpinner")) {
        document.getElementById("containerSpinner").style.display = "block";
    }
    const promise = $$readFile(evt);
    console.log('guru: monitor promise', promise);
    promise.then(function(result) {
        $$web_communicator('report_div');
        containerModal.hide();
    });
}

function $$packContainer() {
    if (!document.getElementById("collapse_formula")) {  //SPAs render collapse_formula at onload
        const accordion_item = document.createElement("div");
        accordion_item.classList.add("accordion-item");
        const accordion_header = document.createElement("h5");
        accordion_header.classList.add("accordion-header");
        const accordion_button = document.createElement("button");
        accordion_button.classList.add("accordion-button");
        accordion_button.appendChild(document.createTextNode('formula'));
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
        accordion_body.innerHTML = editor.innerHTML;
        accordion_collapse.appendChild(accordion_body);
        accordion_item.appendChild(accordion_collapse);
        catalog_accordion.appendChild(accordion_item);
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
        accordion_body.style['color']  = '#ff00ff';
        accordion_body.style['word-wrap'] = 'break-word';
        if (elements == 'fijsApi') {
            accordion_body.appendChild(document.createTextNode(elements + " : " + JSON.stringify(fijsApi)));    
        } else {
            for(var element in fiContainer[elements]) {  
                if (fiContainer[elements].hasOwnProperty(element)) {
                    accordion_body.appendChild(document.createTextNode(element + " : " + JSON.stringify(fiContainer[elements][element]) + " "));
                    //console.log(element, fiContainer[elements][element]);
                }
            }
        }
        accordion_collapse.appendChild(accordion_body);
        accordion_item.appendChild(accordion_collapse);
        catalog_accordion.appendChild(accordion_item);
    }
}    

function fiEvaluate(formula) {
    console.log('formula pre-calc', formula);
    try {
        // Attempt to evaluate the formula
        const result = Function(`'use strict'; return (${formula})`)();
        console.log('formula result', result);
        return result;
    } catch (error) {
        console.error('Error evaluating formula:', error.message);
        // Handle the error appropriately
        // You can return NaN, null, or any other value that indicates an error occurred
        return "Not a Number (NaN)";
    }
}


function updatePresenterColumns() {
    fiContainer.presenter.presenterColumns = [];
    const columns = document.querySelectorAll('.column');
    columns.forEach((column, index) => {
        const items = column.querySelectorAll('.dropped-item');
        const itemData = [];

        items.forEach(item => {
            itemData.push(item.textContent); // Collect text content of each dropped item
        });
        if (itemData[0] !== undefined) {
            fiContainer.presenter.presenterColumns.push(itemData[0]); // Store item data for this column
        }
    });
    console.log(fiContainer.presenter.presenterColumns); // Log the collected data for each column
}

function processLargeFileAsync(csvText) {
    return new Promise((resolve, reject) => {
        try {
            // Directly invoke the processing function without expecting return value
            // Ensure parseAndEvaluateCSV modifies a global or passed reference
            parseAndEvaluateCSV(csvText);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

document.getElementById('container_file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected.");
        return;
    }

    // Optionally, clear previous results or state if needed
    clearPreviousResults();

    const reader = new FileReader();
    
    // Adjusted reader.onload to fit the promise-based processing
    reader.onload = function(e) {
        const text = e.target.result;
        
        processLargeFileAsync(text)
            .then(() => {
                // Assuming displayEvaluatedResults() will use a globally updated presenterObjects
                displayEvaluatedResults();
            })
            .catch(error => {
                console.error("Error processing file:", error);
            });
    };
        
    reader.readAsText(file);
    containerModal.hide();
});

function clearPreviousResults() {
    // Clear the global object or any display elements as needed
    presenterObjects = []; // Clear previous data
    if (document.querySelector("#eval-body")) {
        document.getElementById('eval-body').innerHTML = ''; // Clear previous displayed results
    }
    // Add any other cleanup logic here
}

function sortPresenter() {
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
    // displayEvaluatedResults(presentSorted);
}

function parseAndEvaluateCSV(csvText) {
    //fiContainer.presenter.presenterColumns is an array like ["Rank", "Total", "Average"]

    const lines = csvText.split('\n').filter(line => line);
    const headers = lines[0].split(',').map(header => header.trim());
    let primaryIndex = headers.findIndex(header => header === fiContainer.presenter.primary);
    
    // Reset presenterObjects for new CSV content
    presenterObjects = [];

    // Iterate over each line (excluding the header)
    lines.slice(1).forEach(line => {
        const values = line.split(',').map(value => value.trim());
        const rowObject = {};
        const pipes_arg = {};
        // Construct pipes_arg based on CSV headers and values
        headers.forEach((header, index) => {
            pipes_arg[header] = values[index];
        });
        // Evaluate the formula for this line using pipes_arg
        const evaluatedResult = evaluateFormula(pipes_arg);
        rowObject['Eval'] = fiFunctions.formatNumber(evaluatedResult);
        
        // Match each columnName in fiContainer.presenter.presenterColumns with headers and include in rowObject
        fiContainer.presenter.presenterColumns.forEach(columnName => {
            const columnIndex = headers.indexOf(columnName);
            if (columnIndex !== -1) {
                // Store columnName as key and corresponding value in rowObject
                rowObject[columnName] = values[columnIndex];
            }
        });
        // Assuming the key is found in the same row as defined by primaryIndex
        let key = values[primaryIndex];
        // Handle case where primaryIndex might be -1 or key is undefined
        if (primaryIndex === -1 || !key) {
            console.error("Primary key not found in CSV headers.");
            key = "Undefined Key"; // Fallback or handle appropriately
        }
        // Check for duplicate keys and combine values if found
        if (presenterObjects[key]) {
            // Merge rowObject into existing object for this key to merge values of duplicate keys
            Object.keys(rowObject).forEach(prop => {
                if (typeof rowObject[prop] === 'number'  || parseFloat(rowObject[prop]) == rowObject[prop]) {
                    // Sum numeric values
                    console.log ('sum', key, rowObject[prop], presenterObjects[key][prop])
                    presenterObjects[key][prop] = fiFunctions.formatNumber((presenterObjects[key][prop] || 0) + rowObject[prop]);
                    
                } else {
                    // Concatenate string values, separated by a comma (or use any other logic suitable for your data)
                    presenterObjects[key][prop] = presenterObjects[key][prop] ? `${presenterObjects[key][prop]}, ${rowObject[prop]}` : rowObject[prop];
                }
            });
        } else {
            presenterObjects[key] = rowObject;
        }
    });
    //displayEvaluatedResults(presentSorted); // Optionally display initial results
}

function displayEvaluatedResults() {
    sortPresenter();  //update the presentSorted global
    console.log('presenterObjects', presenterObjects, presentSorted);
    const presenterSection = document.getElementById('presenterSection'); //ul for report output
    presenterSection.innerHTML = ''; // Clear previous results

    // Create table elements
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped'); // Add class for styling if needed

    // Create and append the table header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
   
    // Assuming all objects have the same structure, use the first object to determine headers
    const firstKey = Object.keys(presentSorted)[0];
    const headers = ['Rank', ...Object.keys(presentSorted[firstKey])];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create and append table body with rows
    const tbody = document.createElement('tbody');
    Object.entries(presentSorted).forEach(([key, obj]) => {
        const row = document.createElement('tr');
        
        // Key column
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = parseInt(key) + 1;
        row.appendChild(th);

        // Data columns
        Object.entries(obj).forEach(([obj_key, value]) => {
        //Object.values(obj).forEach(value => {
            const td = document.createElement('td');
            if (obj_key.trim() === 'ID') {
                td.id = value;
                value = $$maskString(value);
            }
            td.textContent = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the presenterSection
    presenterSection.appendChild(table);
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
    let match;

    // Use a loop to find all FI.js function calls within the formula
    while ((match = fiFunctionPattern.exec(formula))) {
        const [fullMatch, functionName, argsString] = match;
        // Split arguments by comma, taking care of both numerical and string arguments
        const args = argsString.split(',').map(arg => {
            const trimmedArg = arg.trim();
            // Attempt to convert numerical arguments, otherwise leave as string
            return isNaN(Number(trimmedArg)) ? trimmedArg : Number(trimmedArg);
        });

        // Check if the functionName exists in fiFunctions and is a function
        if (functionName in fiFunctions && typeof fiFunctions[functionName] === "function") {
            // Execute the function with the provided arguments
            const result = fiFunctions[functionName](...args);
            // Replace the function call in the formula with its result
            formula = formula.replace(fullMatch, result.toString());
        } else {
            throw new Error(`Function '${functionName}' not found.`);
        }
    }
    return formula;
}


/*
function executeFunctionCall(formula) {
    // Pattern to identify the innermost function call
    const innerFunctionPattern = /@(\w+)\(([^@]*?)\)/;
    let match;

    // Loop until no more inner function calls are found
    while ((match = formula.match(innerFunctionPattern))) {
        const [fullMatch, functionName, argsString] = match;
        const args = argsString.split(',').map(arg => isNaN(arg) ? arg.trim() : parseFloat(arg.trim()));

        // Assuming fiFunctions is an object containing your function definitions
        if (fiFunctions.hasOwnProperty(functionName)) {
            const result = fiFunctions[functionName](...args);
            formula = formula.replace(fullMatch, result);
        } else {
            throw new Error(`Function '${functionName}' not found.`);
        }
    }
    return formula;
}
*/

function evaluateFormula(pipes_arg) {
    console.log('pipes_arg', pipes_arg);
    let formula;
    const editorElement = document.getElementById('editor');
    if (editorElement) {
        const htmlString = editorElement.innerHTML;
        formula = htmlString.replace(/<\/?span[^>]*>/g, ''); // Remove HTML formatting for processing
    } else {
        formula = fiFormula; // Fallback if no editor content
    }
    
    console.log('formula', formula);

    // Replace pipes with their values
    Object.entries(pipes_arg).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(`\\|${key}\\|`, 'g'), value);
    });

    // Replace objects with their values
    Object.entries(fiContainer.objects).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });

    // Handle relationships, dictionaries, and APIs in one step
    formula = processFormulaElements(formula);
    //debugger
    if (document.querySelector("#eval-body")) {
        document.querySelector("#eval-body").innerHTML += `<li class="list-group-item"><p class="mb-1">${formula}</p></li>`;
    }

    try {
        const result = fiEvaluate(formula); // Assumes fiEvaluate can handle the final formula
        console.log("Evaluation Result:", fiFunctions.formatUSD(result));
        return result;
    } catch (error) {
        console.error("Error evaluating formula:", error, formula);
        return NaN;
    }
}

function processFormulaElements(formula) {
    // Handle API calls (@{apiName: key})
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
    formula = formula.replace(/\{(\w+)\s*:\s*(\w+)\}/g, (match, dictName, key) => {
        if (dictName in fiContainer.dictionaries) {
            const dictionary = fiContainer.dictionaries[dictName];
            if (key in dictionary) {
                return dictionary[key].toString();
            } else {
                console.error(`Key '${key}' not found in Dictionary '${dictName}'.`);
                return match;
            }
        } else {
            console.error(`Dictionary '${dictName}' not found.`);
            return match;
        }
    });

    return formula; // Return the processed formula
}
