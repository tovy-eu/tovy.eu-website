#!/bin/bash

# Tovy Deployment Script - Clean output, fast deployments
# Usage: npm run deploy (or ./scripts/deploy.sh directly)

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Tovy Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building website...${NC}"
npm run build > /dev/null 2>&1 || {
    echo -e "${YELLOW}❌ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Website built${NC}"

echo -e "${YELLOW}📤 Deploying hosting & functions...${NC}"

# Deploy with filtered output - only show important info
firebase deploy --only hosting,functions 2>&1 | while IFS= read -r line; do
    # Show success indicators
    if [[ $line =~ ^✔ ]]; then
        echo -e "${GREEN}${line}${NC}"
    # Show error indicators
    elif [[ $line =~ ^✘ ]] || [[ $line =~ Error ]] || [[ $line =~ error ]]; then
        echo -e "${YELLOW}${line}${NC}"
    # Show deployment complete
    elif [[ $line =~ "Deploy complete" ]]; then
        echo -e "${GREEN}${line}${NC}"
    # Show URLs
    elif [[ $line =~ "Hosting URL:" ]] || [[ $line =~ "Project Console:" ]]; then
        echo -e "${BLUE}${line}${NC}"
    # Skip verbose lines
    elif [[ $line =~ ^i\ \ ]] || [[ $line =~ "Serving at port" ]] || [[ $line =~ "ensuring required API" ]] || [[ $line =~ "Loaded environment" ]] || [[ $line =~ "packaged" ]] || [[ $line =~ "uploaded" ]] || [[ $line =~ "Verifying" ]] || [[ $line =~ "Granted roles" ]] || [[ $line =~ "release" ]]; then
        : # Skip verbose info lines
    else
        # Show other important output
        [[ ! -z "$line" ]] && echo "$line"
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Quick Commands:${NC}"
echo "  npm run deploy:hosting  - Deploy website only"
echo "  npm run deploy:functions - Deploy functions only"
echo "  npm run deploy:all      - Full deployment with extensions"
echo "  npm run deploy:check    - Preview changes (no deploy)"
echo ""
