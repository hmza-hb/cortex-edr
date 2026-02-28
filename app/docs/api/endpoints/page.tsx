export default function APIEndpointsPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">API Endpoints</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Complete reference for CortexEDR API endpoints, including request/response formats, authentication, and integration examples.
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded">Base URL: https://api.cortex-edr.com/v1</span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">All endpoints require authentication</span>
                </div>
            </div>

            {/* Authentication */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
                <div className="space-y-4">
                    <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                        <h3 className="font-semibold text-white mb-2">Bearer Token Authentication</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p>Include your API key in the Authorization header:</p>
                            <code className="block bg-zinc-800 p-3 rounded text-green-400">
                                Authorization: Bearer YOUR_API_KEY
                            </code>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded p-3 border border-white/5">
                            <h4 className="font-semibold text-white mb-1">Rate Limits</h4>
                            <div className="text-sm text-zinc-400">
                                <div>• 100 requests/minute</div>
                                <div>• 1000 requests/hour</div>
                                <div>• 10000 requests/day</div>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded p-3 border border-white/5">
                            <h4 className="font-semibold text-white mb-1">Content Type</h4>
                            <div className="text-sm text-zinc-400">
                                <div>• Request: application/json</div>
                                <div>• Response: application/json</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Endpoints */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Core Endpoints</h2>

                {/* Scans */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden">
                    <div className="bg-indigo-500/10 border-b border-white/10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Scans</h3>
                            <span className="text-sm text-indigo-400 font-mono">/scans</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Create Scan */}
                        <div className="border-l-2 border-green-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">POST</span>
                                <code className="text-white font-mono">/scans</code>
                                <span className="text-zinc-400 text-sm">Create new scan</span>
                            </div>
                            <div className="bg-black/50 rounded p-3 text-sm">
                                <h4 className="text-white font-medium mb-2">Request Body</h4>
                                <pre className="text-green-400 overflow-x-auto">
{`{
  "repo_url": "https://github.com/user/repo",
  "branch": "main",
  "config": {
    "depth": "standard",
    "include_patterns": ["*.js", "*.ts"],
    "exclude_patterns": ["node_modules/**"]
  }
}`}
                                </pre>
                            </div>
                        </div>

                        {/* Get Scan Status */}
                        <div className="border-l-2 border-blue-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">GET</span>
                                <code className="text-white font-mono">/scans/{'{scan_id}'}</code>
                                <span className="text-zinc-400 text-sm">Get scan status and results</span>
                            </div>
                            <div className="bg-black/50 rounded p-3 text-sm">
                                <h4 className="text-white font-medium mb-2">Response</h4>
                                <pre className="text-blue-400 overflow-x-auto">
{`{
  "id": "scan_123",
  "status": "completed",
  "score": 85,
  "issues_count": 23,
  "created_at": "2024-01-01T00:00:00Z",
  "results": { ... }
}`}
                                </pre>
                            </div>
                        </div>

                        {/* List Scans */}
                        <div className="border-l-2 border-purple-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">GET</span>
                                <code className="text-white font-mono">/scans</code>
                                <span className="text-zinc-400 text-sm">List user scans</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden">
                    <div className="bg-purple-500/10 border-b border-white/10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Chat</h3>
                            <span className="text-sm text-purple-400 font-mono">/chat</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">POST</span>
                                <code className="text-white font-mono">/chat</code>
                                <span className="text-zinc-400 text-sm">Send message</span>
                            </div>
                            <div className="bg-black/50 rounded p-3 text-sm">
                                <h4 className="text-white font-medium mb-2">Request Body</h4>
                                <pre className="text-green-400 overflow-x-auto">
{`{
  "message": "How secure is my authentication?",
  "scan_id": "scan_123",
  "thread_id": "thread_456"
}`}
                                </pre>
                            </div>
                        </div>

                        <div className="border-l-2 border-blue-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">GET</span>
                                <code className="text-white font-mono">/chat/threads</code>
                                <span className="text-zinc-400 text-sm">Get chat threads</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Webhooks */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden">
                    <div className="bg-orange-500/10 border-b border-white/10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Webhooks</h3>
                            <span className="text-sm text-orange-400 font-mono">/webhooks</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="border-l-2 border-green-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">POST</span>
                                <code className="text-white font-mono">/webhooks</code>
                                <span className="text-zinc-400 text-sm">Create webhook</span>
                            </div>
                            <div className="bg-black/50 rounded p-3 text-sm">
                                <h4 className="text-white font-medium mb-2">Request Body</h4>
                                <pre className="text-green-400 overflow-x-auto">
{`{
  "url": "https://your-app.com/webhook",
  "events": ["scan.completed", "scan.failed"],
  "secret": "your-webhook-secret"
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Handling */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Error Handling</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-white mb-3">HTTP Status Codes</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-green-400">200 OK</span>
                                <span className="text-zinc-400">Success</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-400">201 Created</span>
                                <span className="text-zinc-400">Resource created</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-yellow-400">400 Bad Request</span>
                                <span className="text-zinc-400">Invalid request</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-orange-400">401 Unauthorized</span>
                                <span className="text-zinc-400">Invalid API key</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-400">429 Too Many Requests</span>
                                <span className="text-zinc-400">Rate limit exceeded</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-400">500 Internal Error</span>
                                <span className="text-zinc-400">Server error</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-3">Error Response Format</h3>
                        <div className="bg-black/50 rounded p-3 text-sm">
                            <pre className="text-red-400 overflow-x-auto">
{`{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is malformed",
    "details": { ... }
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* SDK Examples */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">SDK Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-white mb-3">JavaScript/Node.js</h3>
                        <pre className="bg-black/50 p-4 rounded text-sm text-blue-400 overflow-x-auto">
{`const cortex = new CortexEDR({
  apiKey: 'your-api-key'
});

// Create a scan
const scan = await cortex.scans.create({
  repo_url: 'https://github.com/user/repo'
});

console.log('Scan created:', scan.id);`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-3">Python</h3>
                        <pre className="bg-black/50 p-4 rounded text-sm text-green-400 overflow-x-auto">
{`import cortex_edr

client = cortex_edr.Client(api_key='your-api-key')

# Create a scan
scan = client.scans.create(
    repo_url='https://github.com/user/repo'
)

print(f"Scan created: {scan.id}")`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="fixed right-8 top-32 w-64 space-y-6 hidden xl:block">
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
                    <div className="space-y-2">
                        <a href="/docs/api/authentication" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → Authentication Guide
                        </a>
                        <a href="/docs/api/webhooks" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → Webhooks Setup
                        </a>
                        <a href="https://github.com/hamza-hafeez82/cortex-edr" target="_blank" className="block text-sm text-indigo-400 hover:text-indigo-300">
                            → SDK Repository
                        </a>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">API Status</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400">All systems operational</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-2">
                        Uptime: 99.9% | Response time: &lt;200ms
                    </div>
                </div>
            </div>
        </div>
    )
}
