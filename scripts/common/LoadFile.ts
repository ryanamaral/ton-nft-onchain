import fs from 'fs';
import path from 'path';

/**
 * Loads JSON content from a specified file path.
 * @param filePath The path to the JSON file.
 * @returns The parsed JSON object.
 */
export function loadJsonFile(filePath: string): any {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(rawData);
        console.log(`Content loaded successfully from ${filePath}.`);
        return parsedData;
    } catch (error) {
        console.error(`Error loading content from ${filePath}:`, error);
        process.exit(1);
    }
}

/**
 * Loads an image buffer from a specified file path.
 * @param filePath The path to the image file.
 * @returns The image buffer if the file exists, otherwise undefined.
 */
export function loadImageBuffer(filePath: string): Buffer {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        console.log(`Image loaded successfully from ${filePath}.`);
        return imageBuffer;
    } catch (error) {
        console.error(`Error loading image from ${filePath}:`, error);
        process.exit(1);
    }
}
