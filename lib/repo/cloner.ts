import { simpleGit, SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const SCANS_DIR = '/tmp/cortexedr-scans';

export async function cloneRepository(scanId: string, repoUrl: string) {
    const targetPath = path.join(SCANS_DIR, scanId);

    // Ensure base scans directory exists
    if (!existsSync(SCANS_DIR)) {
        await fs.mkdir(SCANS_DIR, { recursive: true });
    }

    // Check if directory already exists and clean it up if so
    if (existsSync(targetPath)) {
        await fs.rm(targetPath, { recursive: true, force: true });
    }

    const git: SimpleGit = simpleGit();

    try {
        console.log(`Cloning ${repoUrl} to ${targetPath}...`);

        // Shallow clone for performance
        await git.clone(repoUrl, targetPath, ['--depth', '1']);

        return targetPath;
    } catch (error) {
        console.error('Error cloning repository:', error);
        throw new Error(`Failed to clone repository: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function cleanupRepository(scanId: string) {
    const targetPath = path.join(SCANS_DIR, scanId);
    try {
        if (existsSync(targetPath)) {
            await fs.rm(targetPath, { recursive: true, force: true });
            console.log(`Cleaned up repository at ${targetPath}`);
        }
    } catch (error) {
        console.warn(`Error cleaning up repository at ${targetPath}:`, error);
    }
}
