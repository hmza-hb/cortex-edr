export default function FixingVulnerabilitiesPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Fixing Vulnerabilities</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Practical guides and code examples for fixing common security vulnerabilities. Learn remediation techniques, prevention strategies, and best practices for secure code development.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* SQL Injection Fixes */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🗃️ SQL Injection Prevention</h2>
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-red-400 mb-2">🚨 NEVER DO THIS</h3>
                                <div className="bg-black/50 rounded p-3">
                                    <h4 className="text-white font-medium mb-2">Vulnerable Code:</h4>
                                    <pre className="text-red-300 text-sm overflow-x-auto">
{`// VULNERABLE - String concatenation
const query = "SELECT * FROM users WHERE id = " + userId;
db.query(query);`}
                                    </pre>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-400 mb-2">✅ Prepared Statements</h3>
                                    <div className="space-y-3">
                                        <div className="bg-black/30 rounded p-3">
                                            <h4 className="text-white font-medium mb-2 text-sm">Node.js + MySQL:</h4>
                                            <pre className="text-green-300 text-xs overflow-x-auto">
{`const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId], (err, results) => {
  // Safe from SQL injection
});`}
                                            </pre>
                                        </div>

                                        <div className="bg-black/30 rounded p-3">
                                            <h4 className="text-white font-medium mb-2 text-sm">Python + SQLite:</h4>
                                            <pre className="text-green-300 text-xs overflow-x-auto">
{`cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
results = cursor.fetchall()`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-400 mb-2">🔧 ORM Solutions</h3>
                                    <div className="space-y-3">
                                        <div className="bg-black/30 rounded p-3">
                                            <h4 className="text-white font-medium mb-2 text-sm">Prisma ORM:</h4>
                                            <pre className="text-blue-300 text-xs overflow-x-auto">
{`const user = await prisma.user.findUnique({
  where: { id: userId }
});`}
                                            </pre>
                                        </div>

                                        <div className="bg-black/30 rounded p-3">
                                            <h4 className="text-white font-medium mb-2 text-sm">TypeORM:</h4>
                                            <pre className="text-blue-300 text-xs overflow-x-auto">
{`const user = await userRepository.findOne({
  where: { id: userId }
});`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-indigo-400 mb-2">🛡️ Input Validation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-white font-medium mb-2 text-sm">Type Checking:</h4>
                                        <pre className="text-indigo-300 text-xs overflow-x-auto">
{`// Ensure userId is a number
const userId = parseInt(req.params.id);
if (isNaN(userId)) {
  return res.status(400).json({ error: 'Invalid ID' });
}`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-medium mb-2 text-sm">Sanitization:</h4>
                                        <pre className="text-indigo-300 text-xs overflow-x-auto">
{`// Remove dangerous characters
const cleanInput = input.replace(/[<>'"&]/g, '');
// Or use a library like validator.js
const sanitized = validator.escape(dirtyInput);`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* XSS Prevention */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🌐 Cross-Site Scripting (XSS) Protection</h2>
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-red-400 mb-2">🚨 DANGEROUS PATTERNS</h3>
                                <div className="bg-black/50 rounded p-3">
                                    <pre className="text-red-300 text-sm overflow-x-auto">
{`// VULNERABLE - Direct HTML insertion
const html = "<div>" + userInput + "</div>";
element.innerHTML = html;`}
                                    </pre>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-400 mb-2">✅ Output Encoding</h3>
                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-white font-medium mb-2 text-sm">HTML Context:</h4>
                                        <pre className="text-green-300 text-xs overflow-x-auto">
{`// Use textContent instead of innerHTML
element.textContent = userInput;

// Or escape HTML entities
const safeHTML = escapeHtml(userInput);
element.innerHTML = \`<div>\${safeHTML}</div>\`;`}
                                        </pre>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-400 mb-2">🔧 Content Security Policy</h3>
                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-white font-medium mb-2 text-sm">HTTP Headers:</h4>
                                        <pre className="text-blue-300 text-xs overflow-x-auto">
{`Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';`}
                                        </pre>
                                    </div>
                                </div>

                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-purple-400 mb-2">🛡️ Framework Protection</h3>
                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-white font-medium mb-2 text-sm">React:</h4>
                                        <pre className="text-purple-300 text-xs overflow-x-auto">
{`// React automatically escapes JSX
const element = <div>{userInput}</div>;

// For dangerouslySetInnerHTML, sanitize first
const sanitizedHTML = DOMPurify.sanitize(dirtyHTML);
<div dangerouslySetInnerHTML={{__html: sanitizedHTML}} />`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-indigo-400 mb-2">🧹 Input Sanitization Libraries</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div className="bg-black/30 rounded p-2 text-center">
                                        <div className="text-indigo-400 font-medium">DOMPurify</div>
                                        <div className="text-zinc-500 text-xs">HTML sanitization</div>
                                    </div>
                                    <div className="bg-black/30 rounded p-2 text-center">
                                        <div className="text-indigo-400 font-medium">validator.js</div>
                                        <div className="text-zinc-500 text-xs">Input validation</div>
                                    </div>
                                    <div className="bg-black/30 rounded p-2 text-center">
                                        <div className="text-indigo-400 font-medium">xss</div>
                                        <div className="text-zinc-500 text-xs">XSS filtering</div>
                                    </div>
                                    <div className="bg-black/30 rounded p-2 text-center">
                                        <div className="text-indigo-400 font-medium">sanitize-html</div>
                                        <div className="text-zinc-500 text-xs">HTML cleaner</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authentication & Authorization */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔐 Authentication & Authorization Fixes</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Session Management</h3>
                                    <div className="space-y-3">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">Secure Session Config</h4>
                                            <pre className="text-green-300 text-xs overflow-x-auto">
{`app.use(session({
  name: 'sessionId', // Don't use default
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Prevent XSS
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));`}
                                            </pre>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm mb-1">JWT Best Practices</h4>
                                            <pre className="text-blue-300 text-xs overflow-x-auto">
{`const token = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h',
    issuer: 'your-app',
    audience: 'your-users'
  }
);`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Password Security</h3>
                                    <div className="space-y-3">
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm mb-1">Strong Hashing</h4>
                                            <pre className="text-purple-300 text-xs overflow-x-auto">
{`const bcrypt = require('bcrypt');
const saltRounds = 12;

const hash = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(password, hash);`}
                                            </pre>
                                        </div>

                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                            <h4 className="text-indigo-400 font-medium text-sm mb-1">Password Policies</h4>
                                            <pre className="text-indigo-300 text-xs overflow-x-auto">
{`const isStrong = password.length >= 12 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-orange-400 mb-2">🔒 Authorization Patterns</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-white font-medium mb-2 text-sm">Role-Based Access:</h4>
                                        <pre className="text-orange-300 text-xs overflow-x-auto">
{`const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Usage
app.get('/admin', authorize(['admin']), handler);`}
                                        </pre>
                                    </div>

                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-white font-medium mb-2 text-sm">Resource-Based Access:</h4>
                                        <pre className="text-orange-300 text-xs overflow-x-auto">
{`const canAccess = (user, resource, action) => {
  // Check ownership or permissions
  return resource.ownerId === user.id ||
         user.permissions.includes(action);
};

if (!canAccess(user, post, 'edit')) {
  throw new ForbiddenError();
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📁 File Upload Security</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">File Type Validation</h3>
                                    <div className="space-y-3">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <h4 className="text-green-400 font-medium text-sm mb-1">MIME Type Checking</h4>
                                            <pre className="text-green-300 text-xs overflow-x-auto">
{`const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const fileType = await fileTypeFromBuffer(buffer);

if (!allowedTypes.includes(fileType.mime)) {
  throw new Error('Invalid file type');
}`}
                                            </pre>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                            <h4 className="text-blue-400 font-medium text-sm mb-1">Extension Validation</h4>
                                            <pre className="text-blue-300 text-xs overflow-x-auto">
{`const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
const ext = path.extname(filename).toLowerCase();

if (!allowedExts.includes(ext)) {
  throw new Error('Invalid file extension');
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Security Measures</h3>
                                    <div className="space-y-3">
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                                            <h4 className="text-purple-400 font-medium text-sm mb-1">Random Filenames</h4>
                                            <pre className="text-purple-300 text-xs overflow-x-auto">
{`const crypto = require('crypto');
const randomName = crypto.randomBytes(16).toString('hex');
const extension = path.extname(originalName);
const safeName = \`\${randomName}\${extension}\`;`}
                                            </pre>
                                        </div>

                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                            <h4 className="text-indigo-400 font-medium text-sm mb-1">Size Limits</h4>
                                            <pre className="text-indigo-300 text-xs overflow-x-auto">
{`const MAX_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-red-400 mb-2">🚨 Directory Traversal Prevention</h3>
                                <div className="bg-black/50 rounded p-3">
                                    <pre className="text-red-300 text-sm overflow-x-auto">
{`// DANGEROUS - Allows directory traversal
const filePath = path.join(uploadDir, req.body.filename);

// SAFE - Use basename and validate
const filename = path.basename(req.body.filename);
const safePath = path.join(uploadDir, filename);

// Even safer - Generate your own filename
const safeName = generateSafeFilename();
const safePath = path.join(uploadDir, safeName);`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dependency Vulnerabilities */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📦 Dependency Vulnerability Management</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                                    <h3 className="font-semibold text-green-400 mb-2">Regular Updates</h3>
                                    <div className="space-y-2 text-sm text-zinc-400">
                                        <div>• Run <code className="text-green-300">npm audit</code> weekly</div>
                                        <div>• Update dependencies monthly</div>
                                        <div>• Test after updates</div>
                                        <div>• Use <code className="text-green-300">npm audit fix</code></div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                                    <h3 className="font-semibold text-blue-400 mb-2">Automated Tools</h3>
                                    <div className="space-y-2 text-sm text-zinc-400">
                                        <div>• Dependabot (GitHub)</div>
                                        <div>• Snyk</div>
                                        <div>• npm audit</div>
                                        <div>• OWASP Dependency Check</div>
                                    </div>
                                </div>

                                <div className="bg-purple-500/10 border border-purple-500/20 rounded p-4">
                                    <h3 className="font-semibold text-purple-400 mb-2">Lock Files</h3>
                                    <div className="space-y-2 text-sm text-zinc-400">
                                        <div>• Commit package-lock.json</div>
                                        <div>• Use exact versions</div>
                                        <div>• Regular integrity checks</div>
                                        <div>• CI/CD validation</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-indigo-400 mb-2">🔄 Update Strategy</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Patch Updates (Safe):</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Bug fixes only</li>
                                            <li>• No breaking changes</li>
                                            <li>• Automated updates OK</li>
                                            <li>• Low testing required</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-medium mb-2">Major Updates (Careful):</h4>
                                        <ul className="text-zinc-400 space-y-1">
                                            <li>• Breaking changes possible</li>
                                            <li>• Manual review required</li>
                                            <li>• Full test suite needed</li>
                                            <li>• Deployment planning</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Fix Categories</h3>
                        <div className="space-y-2">
                            <a href="#sql-injection" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → SQL Injection
                            </a>
                            <a href="#xss" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → XSS Protection
                            </a>
                            <a href="#authentication" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Authentication
                            </a>
                            <a href="#file-uploads" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → File Uploads
                            </a>
                            <a href="#dependencies" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Dependencies
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Quick Fixes</h3>
                        <div className="space-y-3 text-sm">
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-green-400 font-medium">SQL Injection:</div>
                                <div className="text-zinc-400">Use prepared statements</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-green-400 font-medium">XSS:</div>
                                <div className="text-zinc-400">Escape output, CSP headers</div>
                            </div>
                            <div className="bg-black/30 rounded p-2">
                                <div className="text-green-400 font-medium">Auth:</div>
                                <div className="text-zinc-400">Strong passwords, MFA</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Testing Fixes</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>• Unit tests for validation</div>
                            <div>• Integration tests for auth</div>
                            <div>• Security regression tests</div>
                            <div>• Penetration testing</div>
                            <div>• Code review checklist</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Prevention Tools</h3>
                        <div className="space-y-2">
                            <div className="text-zinc-400 text-sm">🛡️ ESLint Security</div>
                            <div className="text-zinc-400 text-sm">🔍 SAST Scanners</div>
                            <div className="text-zinc-400 text-sm">📊 Dependency Checkers</div>
                            <div className="text-zinc-400 text-sm">🚨 Runtime Protection</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Need Help?</h3>
                        <div className="space-y-2">
                            <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Security Support
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → FAQ
                            </a>
                            <a href="https://owasp.org/" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → OWASP Resources
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
