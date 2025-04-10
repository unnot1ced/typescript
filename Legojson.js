"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrickCounter = exports.LegoModelAnalyzer = exports.LegoModelApp = void 0;
var BrickCounter = /** @class */ (function () {
    function BrickCounter() {
        this.colorMap = {
            1: 'white',
            2: 'red',
            3: 'black',
            4: 'yellow',
            5: 'blue',
            6: 'brown',
            7: 'green',
            14: 'yellow'
        };
        this.partMap = {
            '2456.dat': '2 x 6',
            '3001.dat': '2 x 4',
            '3002.dat': '2 x 3',
            '3003.dat': '2 x 2',
            '3004.dat': '1 x 2',
            '3007.dat': '2 x 8'
        };
    }
    BrickCounter.prototype.countBricks = function (model) {
        var counts = {};
        for (var _i = 0, _a = model.subparts; _i < _a.length; _i++) {
            var brick = _a[_i];
            var key = "".concat(brick.partId, "-").concat(brick.color);
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
    };
    BrickCounter.prototype.getPartName = function (partId) {
        return this.partMap[partId] || 'Unknown';
    };
    BrickCounter.prototype.getColorName = function (colorId) {
        return this.colorMap[colorId] || 'Unknown';
    };
    BrickCounter.prototype.formatResultsAsTable = function (counts) {
        var sortedCounts = __spreadArray([], counts, true).sort(function (a, b) {
            if (a.partId !== b.partId) {
                return a.partId.localeCompare(b.partId);
            }
            return a.color - b.color;
        });
        var result = 'Part Name | Color | Quantity | Part ID\n';
        result += '----------|-------|----------|--------\n';
        for (var _i = 0, sortedCounts_1 = sortedCounts; _i < sortedCounts_1.length; _i++) {
            var count = sortedCounts_1[_i];
            var partIdWithoutExtension = count.partId.replace('.dat', '');
            result += "".concat(count.partName, " | ").concat(count.colorName, " | ").concat(count.quantity, " | ").concat(partIdWithoutExtension, "\n");
        }
        return result;
    };
    return BrickCounter;
}());
exports.BrickCounter = BrickCounter;
var LegoModelAnalyzer = /** @class */ (function () {
    function LegoModelAnalyzer() {
        this.counter = new BrickCounter();
    }
    LegoModelAnalyzer.prototype.analyzeFromJson = function (jsonData) {
        try {
            var model = JSON.parse(jsonData);
            var counts = this.counter.countBricks(model);
            return this.counter.formatResultsAsTable(counts);
        }
        catch (error) {
            return "Modell: ".concat(error instanceof Error ? error.message : 'error');
        }
    };
    return LegoModelAnalyzer;
}());
exports.LegoModelAnalyzer = LegoModelAnalyzer;
var LegoModelApp = /** @class */ (function () {
    function LegoModelApp() {
        this.analyzer = new LegoModelAnalyzer();
    }
    LegoModelApp.prototype.analyzeJsonString = function (jsonString) {
        return this.analyzer.analyzeFromJson(jsonString);
    };
    LegoModelApp.prototype.analyzeModelFile = function (filePath) {
        try {
            var fs = require('fs');
            var jsonData = fs.readFileSync(filePath, 'utf8');
            return this.analyzeJsonString(jsonData);
        }
        catch (error) {
            return "Foutje met het laden van: ".concat(error instanceof Error ? error.message : 'error');
        }
    };
    return LegoModelApp;
}());
exports.LegoModelApp = LegoModelApp;
function analyzeLegoModelFile(filePath) {
    var app = new LegoModelApp();
    console.log("Lego model bekijkken: ".concat(filePath));
    var result = app.analyzeModelFile(filePath);
    console.log(result);
}
function main() {
    var args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Wel een json file geven he');
        return;
    }
    var filePath = args[0];
    analyzeLegoModelFile(filePath);
}
