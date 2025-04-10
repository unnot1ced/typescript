interface LegoBrick {
    color: number;
    matrix: number[];
    partId: string;
}

interface LegoModel {
    comments: string[];
    subparts: LegoBrick[];
}

interface BrickCount {
    partId: string;
    partName: string;
    color: number;
    colorName: string;
    quantity: number;
}

class BrickCounter {
    private colorMap: Record<number, string> = {
        1: 'white',
        2: 'red',
        3: 'black',
        4: 'yellow',
        5: 'blue',
        6: 'brown',
        7: 'green',
        14: 'yellow'
    };

    private partMap: Record<string, string> = {
        '2456.dat': '2 x 6',
        '3001.dat': '2 x 4',
        '3002.dat': '2 x 3',
        '3003.dat': '2 x 2',
        '3004.dat': '1 x 2',
        '3007.dat': '2 x 8'
    };

    public countBricks(model: LegoModel): BrickCount[] {
        const counts: Record<string, BrickCount> = {};

        for (const brick of model.subparts) {
            const key = `${brick.partId}-${brick.color}`;

            if (!counts[key]) {
                counts[key] = {
                    partId: brick.partId,
                    partName: this.getPartName(brick.partId),
                    color: brick.color,
                    colorName: this.getColorName(brick.color),
                    quantity: 0
                };
            }

            counts[key].quantity++;
        }

        return Object.values(counts);
    }

    private getPartName(partId: string): string {
        return this.partMap[partId] || 'Unknown';
    }

    private getColorName(colorId: number): string {
        return this.colorMap[colorId] || 'Unknown';
    }

    public formatResultsAsTable(counts: BrickCount[]): string {
        const sortedCounts = [...counts].sort((a, b) => {
            if (a.partId !== b.partId) {
                return a.partId.localeCompare(b.partId);
            }
            return a.color - b.color;
        });

        let result = 'Part Name | Color | Quantity | Part ID\n';
        result += '----------|-------|----------|--------\n';

        for (const count of sortedCounts) {
            const partIdWithoutExtension = count.partId.replace('.dat', '');
            result += `${count.partName} | ${count.colorName} | ${count.quantity} | ${partIdWithoutExtension}\n`;
        }

        return result;
    }
}

class LegoModelAnalyzer {
    private counter = new BrickCounter();

    public analyzeFromJson(jsonData: string): string {
        try {
            const model = JSON.parse(jsonData) as LegoModel;
            const counts = this.counter.countBricks(model);
            return this.counter.formatResultsAsTable(counts);
        } catch (error) {
            return `Modell: ${error instanceof Error ? error.message : 'error'}`;
        }
    }
}

class LegoModelApp {
    private analyzer = new LegoModelAnalyzer();

    public analyzeJsonString(jsonString: string): string {
        return this.analyzer.analyzeFromJson(jsonString);
    }

    public analyzeModelFile(filePath: string): string {
        try {
            const fs = require('fs');
            const jsonData = fs.readFileSync(filePath, 'utf8');
            return this.analyzeJsonString(jsonData);
        } catch (error) {
            return `Foutje met het laden van: ${error instanceof Error ? error.message : 'error'}`;
        }
    }
}

function analyzeLegoModelFile(filePath: string): void {
    const app = new LegoModelApp();
    console.log(`Lego model bekijkken: ${filePath}`);
    const result = app.analyzeModelFile(filePath);
    console.log(result);
}

function main(): void {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Wel een json file geven he');
        return;
    }

    const filePath = args[0];
    analyzeLegoModelFile(filePath);
}

export { LegoModelApp, LegoModelAnalyzer, BrickCounter };
