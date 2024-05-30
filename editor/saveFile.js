document.getElementById('saveButton').addEventListener('click', function() {
    const fileName = document.getElementById('fileNameInput').value;
    const editorContent = document.getElementById('editor').innerText;

    if (!fileName) {
        alert('Please enter a file name.');
        return;
    }

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
            components: [
                {
                    id: 'loans',
                    formula: '${editorContent}',
                    pipeIDs: ['loan', 'lending', 'line']
                }
            ]
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
