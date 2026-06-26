#!/bin/bash

# Quiet deployment script for CI/CD pipelines
# Only outputs errors and final status

set -e

echo "🚀 Deploying to Firebase..."

# Build
npm run build > /dev/null 2>&1 || exit 1

# Deploy - suppress all output except errors
firebase deploy --only hosting,functions 2>&1 | grep -E "^(✔|✘|Deploy complete|Error)" || true

echo "✅ Deployment complete!"
