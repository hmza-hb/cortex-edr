import { supabaseService } from '@/lib/supabase/service';

export async function loadUserScans(userId: string) {
  // Get all user's scans with full data
  const { data: scans, error } = await supabaseService
    .from('scans')
    .select(`
      id,
      repo_url,
      repo_name,
      score,
      total_issues,
      severity_counts,
      completed_at,
      status,
      issues (
        id,
        title,
        description,
        severity,
        category,
        file_path,
        line_number,
        code_snippet,
        fix_suggestion,
        ai_prompt
      ),
      files:scan_files (
        id,
        file_path,
        file_content,
        language,
        line_count
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (error) throw error
  return scans || []
}

export async function loadSpecificScan(scanId: string, userId: string) {
  const { data: scan, error } = await supabaseService
    .from('scans')
    .select(`
      *,
      issues (*),
      files:scan_files (*)
    `)
    .eq('id', scanId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return scan
}

export function buildScanContext(scans: any[], activeScanId?: string) {
  if (!scans || scans.length === 0) {
    return `
# USER SCAN CONTEXT

The user has NOT scanned any repositories yet.

You MUST tell them honestly that you don't have any scan data.

Example response:
"I don't see any scans in your history yet. Want to scan a repo so I can analyze it for you?"
`
  }

  // If there's an active scan (from report page), prioritize it
  const activeScan = activeScanId
    ? scans.find(s => s.id === activeScanId)
    : null

  let context = `
# USER SCAN CONTEXT

The user has scanned ${scans.length} repository/repositories:

`

  // List all scans
  scans.forEach((scan, i) => {
    context += `
${i + 1}. **${scan.repo_name || scan.repo_url}**
   - Scan ID: ${scan.id}
   - Score: ${scan.score}/100
   - Total Issues: ${scan.total_issues}
   - Critical: ${scan.severity_counts?.critical || 0}
   - High: ${scan.severity_counts?.high || 0}
   - Medium: ${scan.severity_counts?.medium || 0}
   - Low: ${scan.severity_counts?.low || 0}
   - Scanned: ${new Date(scan.completed_at).toLocaleDateString()}
`
  })

  // If there's an active scan, add FULL context
  if (activeScan) {
    context += `

---

# ACTIVE SCAN: ${activeScan.repo_name || activeScan.repo_url}

You are currently discussing THIS specific scan. You have COMPLETE knowledge of this codebase.

## Repository Structure

Total Files: ${activeScan.files?.length || 0}
Lines of Code: ${activeScan.files?.reduce((sum: number, f: any) => sum + (f.line_count || 0), 0) || 0}

### File Tree:
${activeScan.files?.map((f: any) => `- ${f.file_path} (${f.language}, ${f.line_count} lines)`).join('\n') || ''}

## All Issues Found (${activeScan.total_issues})

${activeScan.issues?.map((issue: any, i: number) => `
### Issue ${i + 1}: ${issue.title} [${issue.severity}]

**Category:** ${issue.category}
**File:** ${issue.file_path}:${issue.line_number}

**Description:**
${issue.description}

**Vulnerable Code:**
\`\`\`
${issue.code_snippet}
\`\`\`

**How to Fix:**
${issue.fix_suggestion}

**AI Fix Prompt:**
${issue.ai_prompt}
`).join('\n---\n') || ''}

## Key Files (First 10)

${activeScan.files?.slice(0, 10).map((f: any) => `
### ${f.file_path}

\`\`\`${f.language}
${f.file_content?.slice(0, 2000)}${f.file_content?.length > 2000 ? '...' : ''}
\`\`\`
`).join('\n') || ''}

---

You have COMPLETE context for this scan. Reference specific files, issues, and code when answering.
`
  }

  return context
}
