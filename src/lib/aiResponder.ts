const deploymentResponses: Record<string, string> = {
  deploy: `**Deployment Plan Overview**

Here's a structured approach for your deployment:

**Phase 1 - Pre-deployment**
- Audit environment variables and secrets
- Run full test suite (unit + integration)
- Create database backups
- Document rollback procedure

**Phase 2 - Staging Deploy**
- Mirror production environment
- Smoke test all critical paths
- Load test with expected traffic

**Phase 3 - Production**
- Deploy during low-traffic window
- Use blue-green or canary strategy
- Monitor error rates in real-time

**Rollback Trigger**: If error rate exceeds 1% or p95 latency doubles, revert immediately.`,

  setup: `**Environment Setup Guide**

For a Node.js + Supabase stack on iSH (iOS):

\`\`\`bash
# Install dependencies
apk add nodejs npm git curl

# Init project
npm init -y
npm install express @supabase/supabase-js dotenv

# Configure .env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
\`\`\`

**Key steps:**
1. Create Supabase project at supabase.com
2. Enable Row Level Security on all tables
3. Use service role key only in backend
4. Never expose secrets in client-side code`,

  security: `**Security Checklist**

Critical items before any deployment:

- [ ] All secrets in environment variables (never in code)
- [ ] RLS enabled on every Supabase table
- [ ] Input validation on all endpoints
- [ ] CORS configured for known origins only
- [ ] Rate limiting on API routes
- [ ] HTTPS enforced everywhere
- [ ] Dependencies audited: \`npm audit\`
- [ ] No console.log of sensitive data
- [ ] SQL injection prevention via parameterized queries
- [ ] Authentication tokens expire appropriately`,

  database: `**Database Migration Strategy**

Best practices for Supabase migrations:

1. **Write migrations as SQL files** — version controlled, reviewable
2. **Never use DROP in production** — use soft deletes or renames
3. **Always enable RLS** — every table needs policies
4. **Test migrations on staging** — apply to production only after validation
5. **Maintain rollback SQL** — have a reverse migration ready

Example safe migration pattern:
\`\`\`sql
-- Add column safely
ALTER TABLE users ADD COLUMN IF NOT EXISTS
  last_active timestamptz DEFAULT now();

-- Create index concurrently (no table lock)
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_users_last_active ON users(last_active);
\`\`\``,

  railway: `**Railway Deployment Guide**

Deploy your Node.js app to Railway:

\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize in project folder
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=your_url

# Deploy
railway up
\`\`\`

**Pro tips:**
- Add \`railway.json\` for custom build config
- Use Railway's built-in PostgreSQL if you need it separately
- Set healthcheck endpoint at \`/health\`
- Configure auto-deploy from GitHub main branch`,
};

const genericResponses = [
  "That's a great question! Based on best practices, I'd recommend starting with a thorough requirements analysis, then proceeding with a phased implementation approach. Would you like me to break this down further?",
  "For this type of challenge, the key is to prioritize reliability and observability. Implement comprehensive logging, set up monitoring dashboards, and establish clear escalation procedures before going live.",
  "I'd suggest following the principle of least privilege here — only grant the minimum permissions necessary. This applies to database roles, API keys, and service accounts throughout your deployment.",
  "A good rule of thumb: if you can't roll it back in under 5 minutes, it needs more planning. Consider feature flags, blue-green deployments, or canary releases to reduce risk.",
  "The most common deployment failures come from environment drift between staging and production. Using containerization (Docker) or infrastructure-as-code (Terraform) helps eliminate this category of issues.",
];

export function generateAIResponse(userMessage: string): Promise<string> {
  return new Promise(resolve => {
    const lower = userMessage.toLowerCase();
    let response = '';

    if (lower.includes('deploy') || lower.includes('deployment')) {
      response = deploymentResponses.deploy;
    } else if (lower.includes('setup') || lower.includes('install') || lower.includes('ish') || lower.includes('iphone')) {
      response = deploymentResponses.setup;
    } else if (lower.includes('security') || lower.includes('rls') || lower.includes('secret') || lower.includes('key')) {
      response = deploymentResponses.security;
    } else if (lower.includes('database') || lower.includes('migration') || lower.includes('supabase') || lower.includes('sql')) {
      response = deploymentResponses.database;
    } else if (lower.includes('railway') || lower.includes('host') || lower.includes('production')) {
      response = deploymentResponses.railway;
    } else {
      const idx = Math.floor(Math.random() * genericResponses.length);
      response = genericResponses[idx];
    }

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => resolve(response), delay);
  });
}
