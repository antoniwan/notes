# Comments Setup

Setup for the Remark42 comment system — a self-hosted, privacy-focused comment engine with social login support.

## Overview

Remark42 replaces the previous GitHub-based comment system with a universal one. Visitors can sign in with Google, Twitter/X, Facebook, GitHub, Apple, Discord, Telegram, and more.

## Prerequisites

You need a running Remark42 instance. Options:

- **Railway** (recommended): One-click deploy at [railway.com](https://railway.app)
- **Fly.io**: Deploy a lightweight container
- **VPS**: Any small server running Docker

## Setup Steps

### 1. Deploy Remark42

Follow the [official Remark42 installation guide](https://remark42.com/docs/getting-started/installation/) to deploy your instance.

Key environment variables for your Remark42 server:

```env
REMARK_URL=https://notes.antoniwan.online/api/remark42
SITE=notes-antoniwan
SECRET=your-secret-key
AUTH_GOOGLE_CID=your-google-client-id
AUTH_GOOGLE_CSEC=your-google-client-secret
AUTH_TWITTER_CID=your-twitter-client-id
AUTH_TWITTER_CSEC=your-twitter-client-secret
AUTH_FACEBOOK_CID=your-facebook-client-id
AUTH_FACEBOOK_CSEC=your-facebook-client-secret
AUTH_GITHUB_CID=your-github-client-id
AUTH_GITHUB_CSEC=your-github-client-secret
```

### 2. Configure Social Login Providers

For each social login you want to enable, create an OAuth app with that provider:

- **Google**: [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
- **Twitter/X**: [Twitter Developer Portal](https://developer.twitter.com/)
- **Facebook**: [Meta for Developers](https://developers.facebook.com/)
- **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers)

Set the OAuth callback URL to: `https://yoursite.com/api/remark42/auth/<provider>/callback`

### 3. Configure Environment Variables

Set these environment variables in your Vercel project (or `.env` file for local dev):

```env
PUBLIC_REMARK42_HOST=https://yoursite.com/api/remark42
PUBLIC_REMARK42_SITE_ID=notes-antoniwan
```

The `PUBLIC_` prefix is required because these values are used client-side in the browser.

### 4. Test Locally

```bash
npm run dev
```

Visit any blog post and scroll to the comments section. The Remark42 widget will load lazily when it comes into view.

## Disable Comments on Specific Posts

Add `showComments: false` to the frontmatter of any post:

```yaml
---
title: 'My Post'
description: 'Post description'
pubDate: '2025-01-01T00:00:00.000Z'
showComments: false
---
```

## Configuration

The comment system configuration lives in `src/config/comments.ts`. It reads from environment variables with sensible defaults for local development.

## Features

- **Lazy loading**: Comments script only loads when the section scrolls into view (IntersectionObserver with 200px margin)
- **Theme sync**: Automatically follows the site's dark/light mode toggle
- **Social login**: Google, Twitter/X, Facebook, GitHub, Apple, Discord, Telegram
- **Anonymous comments**: Optional — configurable in your Remark42 instance
- **Privacy-focused**: Self-hosted, no tracking, no ads
