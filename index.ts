import { LegoModelApp } from './Legojson';
import * as fs from 'fs';
import * as path from 'path';

const MODELS_DIR = path.join(__dirname, 'aangeleverd');

function analyzeModelFile(filePath: string): void {
    console.log(`\nModel: ${path.basename(filePath)}`);
    console.log('='.repeat(50));

    const app = new LegoModelApp();
    const result = app.analyzeModelFile(filePath);
    console.log(result);
}

function analyzeAllModels(): void {
    try {
        const files = fs.readdirSync(MODELS_DIR);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log('Geen json files gevonden in map aangeleverd');
            return;
        }

        for (const file of jsonFiles) {
            const filePath = path.join(MODELS_DIR, file);
            analyzeModelFile(filePath);
        }
    } catch (error) {
        console.error('Foutje lezen map:( :', error);
    }
}

analyzeAllModels();
