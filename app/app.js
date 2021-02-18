const { ipcRenderer } = require('electron');
const path = require('path');

function makeButtonAvailable(button) {
    button.classList.remove("step--unavailable");
    button.classList.add("step--available");
}

function showPath(elemId, path) {
    document.getElementById(elemId).innerText = path;
}

function addPolytopiaDirSelectCallback(finalButton) {
    const polytopiaDirSelect = document.getElementById('polytopia_dir');
    polytopiaDirSelect.oninput = function() {
        const filePath = polytopiaDirSelect.files[0].path;
        window.polytopiaDirectory = filePath
            .split(path.sep).slice(0, -1).join(path.sep);
        showPath('polytopia_dir_path', window.polytopiaDirectory);
        if (window.modFile !== null) {
            makeButtonAvailable(finalButton);
        }
    };
}

function addModFileSelectCallback(finalButton) {
    const modFileSelect = document.getElementById('mod_file');
    modFileSelect.oninput = function() {
        window.modFile = modFileSelect.files[0].path;
        showPath('mod_file_path', window.modFile);
        if (window.polytopiaDirectory !== null) {
            makeButtonAvailable(finalButton);
        }
    };
}

function addFinalButtonCallback(finalButton) {
    finalButton.onclick = function() {
        if (!(window.polytopiaDirectory && window.modFile)) {
            return;
        }
        ipcRenderer.send('install-mod', {
            polytopiaDirectory: window.polytopiaDirectory,
            modFile: window.modFile
        });
        document.getElementById('loading').classList.remove(
            'loading--hidden'
        );
    }
}

ipcRenderer.on('mod-installed', () => {
    document.getElementById('loading').classList.add('loading--hidden');
    new Notification('Athena', {
        body: 'Finished installing a Polytopia mod!'
    });
});

window.onload = function() {
    const finalButton = document.getElementById('final_button');
    window.polytopiaDirectory = null;
    window.modFile = null;
    addPolytopiaDirSelectCallback(finalButton);
    addModFileSelectCallback(finalButton);
    addFinalButtonCallback(finalButton);
};
