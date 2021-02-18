const { ipcMain } = require('electron');
const fs = require("fs");
const JSZip = require("jszip");

function installMod(polytopiaDirectory, modFile, callback, error) {
    // A mod file is simply a ZIP file containing an index.json describing
    // the files to replace.
    fs.readFile(modFile, (err, data) => {
        if (err) error();
        JSZip.loadAsync(data).then((zip) => {
            if (!'index.json' in zip.files) {
                error();
            }
            zip.files['index.json'].async('string').then((raw) => {
                const mod = JSON.parse(raw);
                for (fromPath in mod.files) {
                    zip.files[fromPath].async('nodebuffer').then((fileData) => {
                        const dest = (
                            polytopiaDirectory + '/' + mod.files[fromPath]
                        );
                        fs.writeFileSync(dest, fileData);
                    });
                }
                callback();
            });
        });
    });
}

ipcMain.on('install-mod', (event, data) => {
    installMod(data.polytopiaDirectory, data.modFile, () => {
        event.reply('mod-installed');
    }, () => {
        event.reply('mod-error');
    });
});
