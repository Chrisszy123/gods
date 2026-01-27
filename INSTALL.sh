#!/bin/bash

# ============================================
# Gods of the Stage - Quick Installation Script
# ============================================

echo "🎭 Gods of the Stage - Payment Integration Setup"
echo "================================================"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm add react-paystack nodemailer @types/nodemailer zod

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env.local"
echo "   cp .env.example .env.local"
echo ""
echo "2. Get your Paystack keys from:"
echo "   https://dashboard.paystack.com/settings/developer"
echo ""
echo "3. Configure email (Gmail recommended for testing)"
echo "   https://myaccount.google.com/apppasswords"
echo ""
echo "4. Update .env.local with your keys"
echo ""
echo "5. Start development server:"
echo "   pnpm dev"
echo ""
echo "📖 For detailed instructions, see QUICKSTART.md"
echo ""
echo "🎉 Setup complete! Ready to accept payments."
