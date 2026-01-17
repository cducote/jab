# Admin Configuration

## Environment Variables

You can configure the admin username and password using environment variables in `.env.local`:

```env
# Admin Configuration (optional - defaults shown)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
ADMIN_NAME=Admin

# For the login placeholder (optional)
NEXT_PUBLIC_ADMIN_USERNAME=admin
```

## Default Values

If not set, the defaults are:
- **Username**: `admin`
- **Password**: Set via `ADMIN_PASSWORD` environment variable
- **Name**: `Admin`

## Usage

The admin username is now centralized in `lib/constants.ts` and can be checked using the `isAdminUser()` helper function:

```typescript
import { isAdminUser, ADMIN_USERNAME } from "@/lib/constants";

// Check if user is admin
if (isAdminUser(user?.email)) {
  // Admin access
}
```

## Creating Admin User

The admin user should be created manually in the database or through your preferred method. The application expects:
- Username matching `ADMIN_USERNAME` (default: "admin")
- Password matching `ADMIN_PASSWORD` environment variable
