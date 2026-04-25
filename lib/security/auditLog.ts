export interface AuditLogData {
    action: string;
    actor_id: string;
    actor_email?: string;
    resource_type?: string;
    resource_id?: string;
    metadata?: Record<string, any>;
    status: 'success' | 'failure' | 'denied';
}

/**
 * Structured, sanitized audit logger.
 * In a real environment, this should write to a central SIEM or protected logging cluster.
 */
export async function createAuditLog(data: AuditLogData) {
    // Sanitize metadata - NEVER log passwords, tokens, or PII keys
    const sanitizedMetadata = { ...data.metadata };
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth_code', 'otp'];
    Object.keys(sanitizedMetadata).forEach(key => {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            sanitizedMetadata[key] = '[REDACTED]';
        }
    });

    const logEntry = {
        timestamp: new Date().toISOString(),
        level: data.status === 'success' ? 'INFO' : 'WARN',
        auditable_event: true,
        ...data,
        metadata: sanitizedMetadata
    };

    // Replace with standard stdout JSON logging for log aggregating (e.g. Datadog / Splunk)
    if (data.status === 'success') {
        console.log(JSON.stringify(logEntry));
    } else {
        console.warn(JSON.stringify(logEntry));
    }
    
    // TODO: Optionally flush to a persistent `audit_logs` table in Supabase
}
