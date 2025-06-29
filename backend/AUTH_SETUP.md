# Authentication Setup Guide

## Overview

This backend uses Clerk for JWT-based authentication with a custom middleware for route protection.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory with:

```env
CLERK_SECRET_KEY=your-clerk-secret-key-here
CLERK_JWT_ISSUER=your-clerk-issuer-here
```

### 3. Clerk Configuration

- Get your Clerk Secret Key from your Clerk Dashboard
- Your JWT Issuer is typically your Clerk instance URL (e.g., `clerk.your-app.com`)
- Update the `audience` in `middleware/auth.py` if needed

## Usage

### Protected Routes

Routes decorated with `@require_auth` require a valid JWT token:

```python
@api_bp.route("/protected", methods=["GET"])
@require_auth
def protected_route():
    user_id = getattr(request, 'user', {}).get('sub')
    return jsonify({"user_id": user_id})
```

### Optional Authentication

Routes decorated with `@optional_auth` work with or without authentication:

```python
@api_bp.route("/optional", methods=["GET"])
@optional_auth
def optional_route():
    user_data = getattr(request, 'user', {})
    if user_data:
        return jsonify({"authenticated": True, "user": user_data})
    return jsonify({"authenticated": False})
```

### Frontend Integration

Send JWT tokens in the Authorization header:

```javascript
const response = await fetch("/api/analyse", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

## Route Protection Summary

- **Public Routes**: Categories, questions, search (optional auth)
- **Protected Routes**: Analysis endpoint (requires auth)

## Security Features

- JWT signature verification using Clerk's JWKS
- Token expiration validation
- Issuer verification
- Audience validation
- Cached JWKS for performance
- Comprehensive error handling
