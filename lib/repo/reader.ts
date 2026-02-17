import fs from 'fs/promises';
import path from 'path';

const MAX_READ_SIZE = 500 * 1024; // 500KB limit for AI analysis

export async function readFileContent(repoPath: string, relativeFilePath: string): Promise<string | null> {
    const fullPath = path.join(repoPath, relativeFilePath);

    try {
        const stats = await fs.stat(fullPath);

        if (stats.size > MAX_READ_SIZE) {
            console.warn(`File too large for AI analysis: ${relativeFilePath} (${stats.size} bytes)`);
            return null;
        }

        const content = await fs.readFile(fullPath, 'utf-8');
        return content;
    } catch (error) {
        console.error(`Error reading file ${relativeFilePath}:`, error);
        return null;
    }
}

export async function readFilesBatch(repoPath: string, relativeFilePaths: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    for (const filePath of relativeFilePaths) {
        const content = await readFileContent(repoPath, filePath);
        if (content !== null) {
            results[filePath] = content;
        }
    }

    return results;
}
