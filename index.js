"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Legojson_1 = require("./Legojson");
let fs = require("fs");
let path = require("path");
let MODELS_DIR = path.join(__dirname, 'aangeleverd');
function analyzeModelFile(filePath) {
    console.log("\n Model: ".concat(path.basename(filePath)));
    console.log('='.repeat(50));
    let app = new Legojson_1.LegoModelApp();
    let result = app.analyzeModelFile(filePath);
    console.log(result);
}
function analyzeAllModels() {
    try {
        let files = fs.readdirSync(MODELS_DIR);
        let jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
        if (jsonFiles.length === 0) {
            console.log('Geen json files gevonden in map aangeleverd');
            return;
        }
        for (let _i = 0, jsonFiles_1 = jsonFiles; _i < jsonFiles_1.length; _i++) {
            let file = jsonFiles_1[_i];
            let filePath = path.join(MODELS_DIR, file);
            analyzeModelFile(filePath);
        }
    }
    catch (error) {
        console.error('Foutje lezen map:( :', error);
    }
}
analyzeAllModels();
