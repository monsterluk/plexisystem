#!/bin/bash

echo "🚀 Deploying PlexiSystem with offer acceptance fix..."

# Add all changes
git add -A

# Commit changes
git commit -m "Fix: Add email notifications for offer acceptance

- Added proper API call in PublicOffer.tsx to accept offers
- Implemented email sending to salesperson when offer is accepted
- Added email confirmation to client after acceptance
- Status properly updates in the system"

# Push to GitHub
git push origin main

echo "✅ Changes pushed to GitHub!"
echo "🔄 Netlify will automatically deploy the changes..."
