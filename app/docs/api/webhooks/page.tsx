export default function APIWebhooksPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Webhooks</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Set up real-time notifications for scan events using webhooks. Get instant updates when scans complete, fail, or find critical issues.
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">Real-time notifications</span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">Event-driven integration</span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">JSON payloads</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Webhook Events */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Available Events</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    event: 'scan.started',
                                    description: 'Triggered when a scan begins processing',
                                    color: 'blue'
                                },
                                {
                                    event: 'scan.progress',
                                    description: 'Periodic updates during scan execution',
                                    color: 'indigo'
                                },
                                {
                                    event: 'scan.completed',
                                    description: 'Triggered when a scan finishes successfully',
                                    color: 'green'
                                },
                                {
                                    event: 'scan.failed',
                                    description: 'Triggered when a scan encounters an error',
                                    color: 'red'
                                },
                                {
                                    event: 'issue.critical',
                                    description: 'Triggered when critical security issues are found',
                                    color: 'orange'
                                },
                                {
                                    event: 'scan.timeout',
                                    description: 'Triggered when a scan exceeds time limits',
                                    color: 'yellow'
                                }
                            ].map((event) => (
                                <div key={event.event} className={`border-l-2 border-${event.color}-500 pl-4 bg-${event.color}-500/5 rounded-r-lg p-4`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <code className={`text-${event.color}-400 font-mono text-sm bg-${event.color}-500/10 px-2 py-1 rounded`}>
                                            {event.event}
                                        </code>
                                        <span className={`px-2 py-1 bg-${event.color}-500/20 text-${event.color}-300 rounded text-xs`}>
                                            {event.color === 'blue' ? 'Info' : event.color === 'green' ? 'Success' : event.color === 'red' ? 'Error' : event.color === 'orange' ? 'Warning' : event.color === 'yellow' ? 'Timeout' : 'Progress'}
                                        </span>
                                    </div>
                                    <p className="text-zinc-300 text-sm">{event.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Setup Webhook */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Setting Up Webhooks</h2>
                        <div className="space-y-4">
                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <h3 className="font-semibold text-white mb-3">Create Webhook Endpoint</h3>
                                <div className="space-y-3 text-sm text-zinc-400">
                                    <p>1. Create an HTTPS endpoint in your application that can receive POST requests</p>
                                    <p>2. The endpoint should respond with 200 OK within 5 seconds</p>
                                    <p>3. Implement signature verification for security</p>
                                    <p>4. Handle duplicate events gracefully</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Required Headers</h4>
                                    <div className="text-sm space-y-1">
                                        <div><code className="text-green-400">Content-Type: application/json</code></div>
                                        <div><code className="text-blue-400">X-Cortex-Signature</code></div>
                                        <div><code className="text-purple-400">X-Cortex-Event</code></div>
                                        <div><code className="text-orange-400">X-Cortex-Delivery</code></div>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Response Requirements</h4>
                                    <div className="text-sm text-zinc-400 space-y-1">
                                        <div>• Status: 200 OK</div>
                                        <div>• Timeout: &lt; 5 seconds</div>
                                        <div>• Idempotent handling</div>
                                        <div>• No authentication required</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Register Webhook */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Registering Webhooks</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Via Dashboard</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
                                    <li>Navigate to Settings → Webhooks</li>
                                    <li>Click "Add Webhook"</li>
                                    <li>Enter your endpoint URL</li>
                                    <li>Select events to subscribe to</li>
                                    <li>Set webhook secret for verification</li>
                                    <li>Test the webhook with sample data</li>
                                </ol>
                            </div>

                            <div className="border-l-2 border-blue-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Via API</h3>
                                <div className="bg-black/50 rounded p-3 text-sm">
                                    <h4 className="text-white font-medium mb-2">Create Webhook</h4>
                                    <pre className="text-blue-400 overflow-x-auto">
{`POST /webhooks
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/cortex",
  "events": ["scan.completed", "issue.critical"],
  "secret": "your-webhook-secret",
  "active": true
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security & Verification */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Security & Verification</h2>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">⚠️ Security Best Practices</h3>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Always use HTTPS endpoints</li>
                                    <li>• Verify webhook signatures</li>
                                    <li>• Validate event payloads</li>
                                    <li>• Implement rate limiting</li>
                                    <li>• Use webhook secrets for authentication</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Signature Verification</h3>
                                    <div className="bg-black/50 rounded p-3 text-sm">
                                        <pre className="text-green-400 overflow-x-auto">
{`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  return signature === \`sha256=\${expectedSignature}\`;
}`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-2">Event Validation</h3>
                                    <div className="bg-black/50 rounded p-3 text-sm text-zinc-400">
                                        <div>• Check event type matches expected</div>
                                        <div>• Validate payload structure</div>
                                        <div>• Verify timestamps are recent</div>
                                        <div>• Handle duplicate events</div>
                                        <div>• Implement idempotent processing</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example Payloads */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Example Payloads</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Scan Completed Event</h3>
                                <div className="bg-black/50 rounded p-4 text-sm">
                                    <pre className="text-green-400 overflow-x-auto">
{`{
  "event": "scan.completed",
  "id": "evt_1234567890",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "scan_id": "scan_abc123",
    "repo_url": "https://github.com/user/repo",
    "status": "completed",
    "score": 85,
    "issues_count": 12,
    "duration_seconds": 45
  }
}`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-2">Critical Issue Found</h3>
                                <div className="bg-black/50 rounded p-4 text-sm">
                                    <pre className="text-orange-400 overflow-x-auto">
{`{
  "event": "issue.critical",
  "id": "evt_1234567891",
  "timestamp": "2024-01-01T12:05:00Z",
  "data": {
    "scan_id": "scan_abc123",
    "issue_id": "issue_xyz789",
    "severity": "critical",
    "title": "SQL Injection Vulnerability",
    "file": "api/user.js",
    "line": 42
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Troubleshooting</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-white mb-3">Common Issues</h3>
                                <div className="space-y-3">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                        <div className="text-red-400 font-medium text-sm">Webhook not firing</div>
                                        <div className="text-zinc-400 text-sm">Check endpoint is accessible and returns 200 OK</div>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                        <div className="text-yellow-400 font-medium text-sm">Signature verification fails</div>
                                        <div className="text-zinc-400 text-sm">Ensure webhook secret matches in both places</div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                        <div className="text-blue-400 font-medium text-sm">Duplicate events received</div>
                                        <div className="text-zinc-400 text-sm">Implement idempotent handling using event IDs</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-3">Testing Webhooks</h3>
                                <div className="space-y-3 text-sm text-zinc-400">
                                    <div>• Use webhook testing tools like ngrok for local development</div>
                                    <div>• Test with sample payloads from the dashboard</div>
                                    <div>• Monitor webhook delivery logs</div>
                                    <div>• Implement comprehensive error logging</div>
                                    <div>• Set up alerts for webhook failures</div>
                                </div>

                                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
                                    <h4 className="text-indigo-400 font-medium text-sm mb-1">Test Command</h4>
                                    <code className="text-xs text-zinc-400">curl -X POST your-endpoint-url -H "Content-Type: application/json" -d '&lbrace;"test": "data"&rbrace;'</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Webhook Management</h3>
                        <div className="space-y-2">
                            <a href="/dashboard" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Manage Webhooks
                            </a>
                            <a href="/docs/api/endpoints" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → API Reference
                            </a>
                            <a href="/docs/api/authentication" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Authentication
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Webhook Limits</h3>
                        <div className="space-y-2 text-sm">
                            <div>• 10 webhooks per account</div>
                            <div>• 100 events/second burst</div>
                            <div>• 30 second timeout</div>
                            <div>• 3 retry attempts</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Supported Integrations</h3>
                        <div className="space-y-2 text-sm">
                            <div className="text-zinc-400">🔗 Slack</div>
                            <div className="text-zinc-400">💬 Discord</div>
                            <div className="text-zinc-400">📧 Email</div>
                            <div className="text-zinc-400">🔧 Custom Apps</div>
                            <div className="text-zinc-400">📊 Monitoring Tools</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Example Use Cases</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>• CI/CD pipeline notifications</div>
                            <div>• Security dashboard updates</div>
                            <div>• Team alerting for critical issues</div>
                            <div>• Audit log integration</div>
                            <div>• Compliance reporting</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Need Help?</h3>
                        <div className="space-y-2">
                            <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Webhook Support
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
