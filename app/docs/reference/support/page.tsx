export default function SupportPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">Support & Help Center</h1>
                <p className="text-zinc-400 leading-relaxed">
                    Get the help you need with CortexEDR. Our support team is here to assist with technical issues, account questions, and platform guidance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Methods */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📞 Contact Methods</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-green-400 text-xl">💬</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Live Chat</h3>
                                            <p className="text-sm text-zinc-400">Available in dashboard</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">Get instant help from our support team. Available 24/7 for all paid plans.</p>
                                    <div className="text-xs text-zinc-500">
                                        • Response time: Instant<br/>
                                        • Available: 24/7<br/>
                                        • Languages: English, Spanish, French
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-blue-400 text-xl">📧</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Email Support</h3>
                                            <p className="text-sm text-zinc-400">support@cortex-edr.com</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">Send us a detailed message and we'll get back to you within 24 hours.</p>
                                    <div className="text-xs text-zinc-500">
                                        • Response time: &lt; 24 hours<br/>
                                        • Include screenshots<br/>
                                        • Provide repository URLs
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-purple-400 text-xl">📞</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Phone Support</h3>
                                            <p className="text-sm text-zinc-400">Enterprise only</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">Direct phone support for enterprise customers with dedicated account managers.</p>
                                    <div className="text-xs text-zinc-500">
                                        • Available: Business hours<br/>
                                        • Direct escalation<br/>
                                        • Account management
                                    </div>
                                </div>

                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-orange-400 text-xl">💡</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Community Help</h3>
                                            <p className="text-sm text-zinc-400">GitHub Discussions</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">Get help from the community and contribute to discussions.</p>
                                    <div className="text-xs text-zinc-500">
                                        • Community-driven<br/>
                                        • No SLA<br/>
                                        • Great for quick questions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Common Issues */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🔧 Common Issues & Solutions</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-red-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Scan Not Starting</h3>
                                <div className="text-sm text-zinc-400 space-y-2">
                                    <p><strong>Problem:</strong> Repository scan fails to start</p>
                                    <p><strong>Solutions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Check if repository is public or you have proper access tokens</li>
                                        <li>Verify repository size is under 50MB limit</li>
                                        <li>Ensure repository contains supported file types</li>
                                        <li>Check GitHub API rate limits</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-l-2 border-orange-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">False Positive Reports</h3>
                                <div className="text-sm text-zinc-400 space-y-2">
                                    <p><strong>Problem:</strong> Security findings appear to be incorrect</p>
                                    <p><strong>Solutions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Review the finding details and code context</li>
                                        <li>Check if input is properly validated/sanitized</li>
                                        <li>Verify if the code path is actually reachable</li>
                                        <li>Report false positives to help improve detection</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-l-2 border-yellow-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">API Authentication Issues</h3>
                                <div className="text-sm text-zinc-400 space-y-2">
                                    <p><strong>Problem:</strong> API requests returning 401 Unauthorized</p>
                                    <p><strong>Solutions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Verify API key is correct and active</li>
                                        <li>Check Authorization header format: Bearer &lt;key&gt;</li>
                                        <li>Ensure API key has required permissions</li>
                                        <li>Check for expired or rotated keys</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border-l-2 border-green-500 pl-4">
                                <h3 className="font-semibold text-white mb-2">Webhook Not Firing</h3>
                                <div className="text-sm text-zinc-400 space-y-2">
                                    <p><strong>Problem:</strong> Webhook events not being received</p>
                                    <p><strong>Solutions:</strong></p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Verify webhook URL is accessible and returns 200 OK</li>
                                        <li>Check webhook secret matches in both places</li>
                                        <li>Ensure events are selected in webhook configuration</li>
                                        <li>Review webhook delivery logs in dashboard</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Plans */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">🎯 Support Plans & SLAs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                                <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-zinc-300 mb-1">Vibe Coder</div>
                                    <div className="text-sm text-zinc-500">Free</div>
                                </div>
                                <div className="space-y-2 text-sm text-zinc-400">
                                    <div>✅ Email support</div>
                                    <div>❌ Live chat</div>
                                    <div>❌ Phone support</div>
                                    <div className="text-xs">Response: 72 hours</div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                                <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-indigo-400 mb-1">Developer</div>
                                    <div className="text-sm text-zinc-500">$29/month</div>
                                </div>
                                <div className="space-y-2 text-sm text-zinc-400">
                                    <div>✅ Email support</div>
                                    <div>✅ Live chat</div>
                                    <div>❌ Phone support</div>
                                    <div className="text-xs">Response: &lt; 24 hours</div>
                                </div>
                            </div>

                            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                                <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-purple-400 mb-1">Enterprise</div>
                                    <div className="text-sm text-zinc-500">Custom</div>
                                </div>
                                <div className="space-y-2 text-sm text-zinc-400">
                                    <div>✅ Email support</div>
                                    <div>✅ Live chat</div>
                                    <div>✅ Phone support</div>
                                    <div className="text-xs">Response: &lt; 4 hours</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📊 System Status & Health</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Current Status</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
                                            <span className="text-white font-medium">API Services</span>
                                            <span className="text-green-400 text-sm">Operational</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
                                            <span className="text-white font-medium">Scan Engine</span>
                                            <span className="text-green-400 text-sm">Operational</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                            <span className="text-white font-medium">Dashboard</span>
                                            <span className="text-yellow-400 text-sm">Degraded</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white mb-3">Performance Metrics</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Uptime (30 days):</span>
                                            <span className="text-green-400">99.9%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Avg Response Time:</span>
                                            <span className="text-blue-400">&lt; 200ms</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Active Scans:</span>
                                            <span className="text-purple-400">1,247</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Issues Detected:</span>
                                            <span className="text-orange-400">45,891</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 rounded p-4 border border-white/10">
                                <h3 className="font-semibold text-white mb-2">Recent Incidents</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Feb 25, 2025 - API performance optimization completed</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Feb 20, 2025 - New AI model deployed for improved accuracy</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>Feb 15, 2025 - Brief dashboard slowdown (5 minutes)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Support Request */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📝 Submit Support Request</h2>
                        <div className="space-y-4">
                            <p className="text-zinc-400">
                                Need help with a specific issue? Fill out our support form and we'll get back to you quickly.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Issue Category</label>
                                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                                            <option>Technical Issue</option>
                                            <option>Billing Question</option>
                                            <option>Feature Request</option>
                                            <option>Account Access</option>
                                            <option>API Integration</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Priority Level</label>
                                        <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none">
                                            <option>Low - General question</option>
                                            <option>Medium - Feature not working</option>
                                            <option>High - Service disruption</option>
                                            <option>Critical - Security issue</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                                            placeholder="Brief description of your issue"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Repository URL (if applicable)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                                            placeholder="https://github.com/user/repo"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none"
                                    placeholder="Provide detailed information about your issue, including steps to reproduce, error messages, and any relevant screenshots or logs."
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                    Submit Request
                                </button>
                                <span className="text-sm text-zinc-500">Expected response time: &lt; 24 hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Quick Help</h3>
                        <div className="space-y-2">
                            <a href="/docs" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Documentation
                            </a>
                            <a href="/docs/reference/faq" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → FAQ
                            </a>
                            <a href="/docs/api/endpoints" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → API Docs
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Response Times</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Live Chat:</span>
                                <span className="text-green-400">Instant</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Email:</span>
                                <span className="text-blue-400">&lt; 24 hrs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Phone:</span>
                                <span className="text-purple-400">&lt; 4 hrs</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Self-Service Resources</h3>
                        <div className="space-y-2 text-sm">
                            <div className="text-zinc-400">🔍 Status Page</div>
                            <div className="text-zinc-400">📚 Knowledge Base</div>
                            <div className="text-zinc-400">🎥 Video Tutorials</div>
                            <div className="text-zinc-400">💬 Community Forums</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Emergency Contacts</h3>
                        <div className="space-y-2 text-sm text-zinc-400">
                            <div>🚨 Security Issues: security@cortex-edr.com</div>
                            <div>🔥 Service Outages: outages@cortex-edr.com</div>
                            <div>💳 Billing Issues: billing@cortex-edr.com</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Feedback</h3>
                        <div className="space-y-2">
                            <a href="mailto:feedback@cortex-edr.com" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Share Feedback
                            </a>
                            <a href="mailto:bugs@cortex-edr.com" className="block text-sm text-indigo-400 hover:text-indigo-300">
                                → Report Bug
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
