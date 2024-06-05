document.getElementById('saveButton').addEventListener('click', function() {
    const fileName = document.getElementById('fileNameInput').value;
    const editorContent = document.getElementById('editor').innerText;

    if (!fileName) {
        alert('Please enter a file name.');
        return;
    }

    // Function to identify used pipes in the formula
    function identifyUsedPipes(content) {
        const usedPipes = new Set();
        pipeItems.forEach(pipe => {
            pipe.items.forEach(item => {
                if (content.includes(item)) {
                    usedPipes.add(pipe.category);
                }
            });
        });
        return Array.from(usedPipes);
    }

    // Split the editor content by semicolons to get individual formulas
    const formulas = editorContent.split(';').map(f => f.trim()).filter(f => f);

    function stem(word) {
        // Define some simple rules for stemming
        const suffixes = ["ing", "ed", "ly", "es", "s", "ment"];
        let stemmedWord = word;
    
        for (let suffix of suffixes) {
            if (word.endsWith(suffix)) {
                stemmedWord = word.substring(0, word.length - suffix.length);
                break;
            }
        }
    
        return stemmedWord;
    }

    let akaDictionary = {
        'checking': ['dda'],
        'certificate': ['CD', 'COD']
    };

    function populatePipeIDs(pipe) {
        let stemmedWord = stem(pipe);
        // Check if akaDictionary has the key and if it's not undefined
        let aka = akaDictionary && akaDictionary.hasOwnProperty(pipe) ? akaDictionary[pipe] : [];
        return [pipe, stemmedWord, ...aka];
    }

    // Create components based on the formulas
    const components = formulas.map((formula, index) => {
        const usedPipes = identifyUsedPipes(formula);
        let componentId = `component_${index}`;
        
        // If there are used pipes, create a unique component ID based on the pipes used
        if (usedPipes.length > 0) {
            componentId = usedPipes[index];
            //componentId = usedPipes.join('_');
        }

        return {
            id: componentId,
            formula: formula,
            pipeIDs: populatePipeIDs(usedPipes[index])
        };
    });

    const fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copernicus Single Page Application</title>
    <link rel="stylesheet" href="../styles/main.css">
</head>
<body>
    <div id="spinnerOverlay" class="spinner-overlay">
        <div class="spinner"></div>
    </div>
    <div id="resultsTableContainer" class="table-container"></div> <!-- Container for results table -->

    <footer class="fixed-footer">
        <input type="file" id="csvPipe" accept=".csv" multiple>
        <button id="run">
            <img src="../JS_box.png" class="button-icon">
            Run
        </button>
    </footer>
    <script>
        window.buildConfig = {
            libraries: ['organization', 'financial', 'https://fijs.net/api/trates/'],
            version: '1.0.0',
            presentation: {
                columns: [
                    { header: 'ID', key: 'ID', type: 'integer' },
                    { header: 'Principal', key: 'principal', type: 'currency' },
                    { header: 'Balance', key: 'balance', type: 'currency' },
                    { header: 'Result', key: 'result', type: 'float' }
                ],
                primary_key: 'ID',
                sort: { key: 'result', order: 'desc' }
            },
            components: ${JSON.stringify(components, null, 4)}
        };
    </script>
    <script src="../core/loadLibraries.js"></script>
    <script src="../organization/pipes.js"></script>
    <script src="../core/main.js"></script>
</body>
</html>`;

    const blob = new Blob([fileContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.html`;
    link.click();
});
