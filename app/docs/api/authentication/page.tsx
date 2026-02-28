export default function APIAuthenticationPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">API Authentication</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Learn how to authenticate with the CortexEDR API using API keys, manage permissions, and implement secure authentication patterns.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* API Key Management */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">API Key Management</h2>
                        <div className="space-y-4">
                            <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                                <h3 className="font-semibold text-white mb-2">Creating API Keys</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
                                    <li>Log in to your CortexEDR dashboard</li>
                                    <li>Navigate to Settings → API Keys</li>
                                    <li>Click "Create New Key"</li>
                                    <li>Set permissions and expiration date</li>
                                    <li>Copy and store the key securely</li>
                                </ol>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Key Permissions</h4>
                                    <div className="space-y-1 text-sm text-zinc-400">
                                        <div>• <strong>Read:</strong> View scans and reports</div>
                                        <div>• <strong>Write:</strong> Create new scans</div>
                                        <div>• <strong>Admin:</strong> Full access + user management</div>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded p-3 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Key Security</h4>
                                    <div className="space-y-1 text-sm text-zinc-400">
                                        <div>• Rotate keys regularly</div>
                                        <div>• Use environment variables</div>
                                        <div>• Never commit to version control</div>
                                        <div>• Set appropriate expiration</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Methods */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Authentication Methods</h2>
                        <div className="space-y-4">
                            {/* Bearer Token */}
                            <div className="border-l-2 border-indigo-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Bearer Token (Recommended)</h3>
                                <p className="text-sm text-zinc-400 mb-3">
                                    Include your API key in the Authorization header using Bearer token format.
                                </p>
                                <div className="bg-black/50 rounded p-3">
                                    <h4 className="text-white font-medium mb-2 text-sm">Header Format</h4>
                                    <code className="block text-indigo-400 font-mono text-sm">
                                        Authorization: Bearer sk_live_your_api_key_here
                                    </code>
                                </div>
                            </div>

                            {/* Query Parameter */}
                            <div className="border-l-2 border-purple-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Query Parameter (Development Only)</h3>
                                <p className="text-sm text-zinc-400 mb-3">
                                    For development and testing only. Not recommended for production use.
                                </p>
                                <div className="bg-black/50 rounded p-3">
                                    <h4 className="text-white font-medium mb-2 text-sm">URL Format</h4>
                                    <code className="block text-purple-400 font-mono text-sm">
                                        https://api.cortex-edr.com/v1/scans?api_key=sk_live_your_api_key_here
                                    </code>
                                </div>
                                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-300">
                                    ⚠️ This method exposes your API key in server logs and browser history. Use only for development.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rate Limiting */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Rate Limiting</h2>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h3 className="font-semibold text-white mb-2">Rate Limits by Plan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-blue-400 font-bold text-lg">100</div>
                                        <div className="text-zinc-400">Vibe Coder</div>
                                        <div className="text-zinc-500">requests/minute</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-indigo-400 font-bold text-lg">500</div>
                                        <div className="text-zinc-400">Developer</div>
                                        <div className="text-zinc-500">requests/minute</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-purple-400 font-bold text-lg">2000</div>
                                        <div className="text-zinc-400">Enterprise</div>
                                        <div className="text-zinc-500">requests/minute</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/30 rounded p-4 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Rate Limit Headers</h4>
                                    <div className="space-y-1 text-sm">
                                        <div><code className="text-green-400">X-RateLimit-Limit</code> - Max requests</div>
                                        <div><code className="text-yellow-400">X-RateLimit-Remaining</code> - Remaining</div>
                                        <div><code className="text-blue-400">X-RateLimit-Reset</code> - Reset time</div>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded p-4 border border-white/5">
                                    <h4 className="font-semibold text-white mb-2">Handling Rate Limits</h4>
                                    <div className="space-y-2 text-sm text-zinc-400">
                                        <div>• Use exponential backoff</div>
                                        <div>• Implement request queuing</div>
                                        <div>• Cache responses when possible</div>
                                        <div>• Monitor usage patterns</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Handling */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Authentication Errors</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Common Errors</h3>
                                    <div className="space-y-3">
                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                                            <div className="text-red-400 font-medium text-sm">401 Unauthorized</div>
                                            <div className="text-zinc-400 text-sm">Invalid or missing API key</div>
                                        </div>

                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                                            <div className="text-orange-400 font-medium text-sm">403 Forbidden</div>
                                            <div className="text-zinc-400 text-sm">Insufficient permissions</div>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                            <div className="text-yellow-400 font-medium text-sm">429 Too Many Requests</div>
                                            <div className="text-zinc-400 text-sm">Rate limit exceeded</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Error Response Format</h3>
                                    <div className="bg-black/50 rounded p-4">
                                        <pre className="text-red-400 text-sm overflow-x-auto">
{`{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API key provided",
    "details": {
      "required_permissions": ["read"],
      "provided_permissions": []
    }
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Security Best Practices</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">🔐 Key Management</h3>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li>• Store keys in environment variables</li>
                                        <li>• Use different keys for different environments</li>
                                        <li>• Rotate keys every 90 days</li>
                                        <li>• Use least-privilege permissions</li>
                                        <li>• Never commit keys to version control</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">🛡️ Request Security</h3>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li>• Always use HTTPS</li>
                                        <li>• Validate SSL certificates</li>
                                        <li>• Implement request signing if needed</li>
                                        <li>• Use idempotent operations when possible</li>
                                        <li>• Log authentication failures</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h3 className="font-semibold text-white mb-3">Environment Examples</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-green-400 font-medium mb-2">.env</h4>
                                        <code className="text-zinc-400">
                                            CORTEX_API_KEY=sk_live_your_key_here<br/>
                                            CORTEX_BASE_URL=https://api.cortex-edr.com/v1
                                        </code>
                                    </div>

                                    <div className="bg-black/30 rounded p-3">
                                        <h4 className="text-blue-400 font-medium mb-2">Docker</h4>
                                        <code className="text-zinc-400">
                                            -e CORTEX_API_KEY=sk_live_your_key_here<br/>
                                            -e CORTEX_BASE_URL=https://api.cortex-edr.com/v1
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <a href="/dashboard" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Manage API Keys
                            </a>
                            <a href="/docs/api/endpoints" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → View Endpoints
                            </a>
                            <a href="/docs/api/webhooks" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Setup Webhooks
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">API Key Types</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-zinc-300">Live Keys - Production use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-zinc-300">Test Keys - Development only</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-zinc-300">Expired Keys - Rotate immediately</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Testing Authentication</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-black/30 rounded p-2">
                                <code className="text-green-400">curl -H "Authorization: Bearer YOUR_KEY" https://api.cortex-edr.com/v1/scans</code>
                            </div>
                            <p className="text-zinc-500 text-xs">Should return 200 OK with your scan list</p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Support</h3>
                        <div className="space-y-2">
                            <a href="/docs/reference/support" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Authentication Issues
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → FAQ
                            </a>
                            <a href="mailto:support@cortex-edr.com" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
