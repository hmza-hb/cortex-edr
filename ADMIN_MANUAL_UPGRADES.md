# Manual User Tier Management System

## Overview
This system allows you to manually control user tiers from the database when users pay via bank transfers or other manual payment methods.

## How It Works

### 1. Database Structure
- **Table:** `profiles`
- **Key Field:** `plan_tier` (values: 'vibe_coder', 'developer', 'teams', 'enterprise')
- **Automatic Application:** Tier benefits are applied immediately when users access the app

## Security & Access Control

### 🔒 **Security Features**
- **Authentication Required**: Only logged-in users can access admin functions
- **Authorization Required**: Only admin emails can access user management
- **Input Validation**: All inputs are validated and sanitized
- **Audit Logging**: All admin actions are logged for security tracking

### 📧 **Admin Email Configuration**
Update the admin email whitelist in these files:
- `/app/api/admin/users/route.ts` (line 7)
- `/app/admin/users/page.tsx` (line 6)

```typescript
const ADMIN_EMAILS = [
    'your-admin-email@example.com', // Replace with your actual admin email
    // Add more admin emails as needed
];
```

### 🚪 **Access Methods**

#### 1. Web Admin Interface
- **URL:** `/admin/users`
- **Requirements:** Must be logged in with an admin email
- **Features:** View all users, change tiers with dropdown, real-time updates
- **Access:** Only accessible to admin email addresses

#### 2. API Endpoints
- **Authentication:** Requires Clerk authentication + admin email
- **POST /api/admin/users:** Update user tier
- **GET /api/admin/users:** List all users

#### 3. Supabase SQL Function
- **Function:** `upgrade_user_tier(email, tier)`
- **Requirements:** Admin authentication required
- **Usage:** `SELECT upgrade_user_tier('user@example.com', 'developer');`

### 2. Manual Upgrade Process

#### Option A: Using the Web Admin Interface
1. Navigate to `/admin/users` in your browser
2. View all users and their current tiers
3. Use the dropdown to change any user's tier
4. Changes take effect immediately

#### Option B: Using Supabase SQL Function
1. Open Supabase Dashboard → SQL Editor
2. Run this query:
```sql
SELECT upgrade_user_tier('user@example.com', 'developer');
```
3. Check the returned JSON for success/error

#### Option C: Using the API Directly
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "user@example.com", "newTier": "developer"}'
```

### 3. Available Tiers & Limits

| Tier | Monthly Scans | Repositories | Files/Scan | Retention |
|------|---------------|--------------|------------|-----------|
| vibe_coder | 5 | 3 | 500 | 24 hours |
| developer | 15 | 5 | 1000 | 30 days |
| teams | 50 | 15 | 5000 | 90 days |
| enterprise | Unlimited | Unlimited | Unlimited | Unlimited |

### 4. Verification
After upgrading a user:
1. User gets new limits immediately on next app visit
2. Check dashboard shows updated tier
3. All features unlock based on new tier

### 5. Security Notes
- API endpoints require authentication (implement proper admin auth)
- SQL function is security definer (runs with elevated privileges)
- All changes are logged with timestamps

## Quick Commands for Common Upgrades

```sql
-- Upgrade to Developer
SELECT upgrade_user_tier('user@example.com', 'developer');

-- Upgrade to Teams
SELECT upgrade_user_tier('user@example.com', 'teams');

-- Upgrade to Enterprise
SELECT upgrade_user_tier('user@example.com', 'enterprise');

-- Downgrade back to Free
SELECT upgrade_user_tier('user@example.com', 'vibe_coder');
```

## Testing
Run the build to ensure everything works:
```bash
npm run build
```

The system is now ready for manual payment processing! 🎉
