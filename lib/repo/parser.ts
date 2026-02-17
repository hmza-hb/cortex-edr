import fs from 'fs/promises';
import path from 'path';

const IGNORED_DIRS = new Set([
    '.git',
    'node_modules',
    'dist',
    'build',
    '.next',
    '.cache',
    'vendor',
    '__pycache__',
    'venv',
    '.venv',
]);

const IGNORED_EXTENSIONS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', // Images
    '.mp4', '.mov', '.avi', // Videos
    '.pdf', '.zip', '.tar', '.gz', // Docs/Archives
    '.woff', '.woff2', '.ttf', '.eot', // Fonts
]);

export interface FileInfo {
    path: string;
    name: string;
    extension: string;
    size: number;
}

export async function parseFileTree(repoPath: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    async function walk(currentPath: string) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            const relativePath = path.relative(repoPath, fullPath);

            if (entry.isDirectory()) {
                if (!IGNORED_DIRS.has(entry.name)) {
                    await walk(fullPath);
                }
            } else {
                const ext = path.extname(entry.name).toLowerCase();
                if (!IGNORED_EXTENSIONS.has(ext)) {
                    const stats = await fs.stat(fullPath);
                    files.push({
                        path: relativePath,
                        name: entry.name,
                        extension: ext,
                        size: stats.size,
                    });
                }
            }
        }
    }

    await walk(repoPath);
    return files;
}

export async function getTechStack(repoPath: string) {
    const techStack: Record<string, any> = {
        languages: new Set<string>(),
        frameworks: new Set<string>(),
        dependencies: {},
    };

    // Check package.json
    const packageJsonPath = path.join(repoPath, 'package.json');
    if (pathExists(packageJsonPath)) {
        try {
            const content = await fs.readFile(packageJsonPath, 'utf-8');
            const pkg = JSON.parse(content);
            techStack.dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

            if (techStack.dependencies.next) techStack.frameworks.add('Next.js');
            if (techStack.dependencies.react) techStack.frameworks.add('React');
            if (techStack.dependencies.vue) techStack.frameworks.add('Vue');
            if (techStack.dependencies.express) techStack.frameworks.add('Express');
            if (techStack.dependencies.prisma) techStack.frameworks.add('Prisma');
        } catch (e) {
            console.warn('Error parsing package.json:', e);
        }
    }

    // Simplified language detection based on extension
    const files = await parseFileTree(repoPath);
    files.forEach(f => {
        if (f.extension === '.ts' || f.extension === '.tsx') techStack.languages.add('TypeScript');
        if (f.extension === '.js' || f.extension === '.jsx') techStack.languages.add('JavaScript');
        if (f.extension === '.py') techStack.languages.add('Python');
        if (f.extension === '.go') techStack.languages.add('Go');
        if (f.extension === '.rs') techStack.languages.add('Rust');
    });

    return {
        languages: Array.from(techStack.languages),
        frameworks: Array.from(techStack.frameworks),
        dependencies: techStack.dependencies,
    };
}

// Helper to check if file exists (sync for simplicity in async context)
import { existsSync } from 'fs';
function pathExists(p: string) {
    return existsSync(p);
}
