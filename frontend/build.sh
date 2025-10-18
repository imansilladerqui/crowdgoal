#!/bin/bash
# Build optimization script for CrowdGoal Frontend

echo "🚀 Building CrowdGoal Frontend with optimizations..."

# Set production environment
export NODE_ENV=production
export VITE_BUILD_OPTIMIZE=true
export VITE_DROP_CONSOLE=true

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Type check
echo "🔍 Running TypeScript type check..."
npm run typecheck

# Lint check
echo "🔍 Running ESLint..."
npm run lint

# Build with optimizations
echo "🏗️ Building optimized production bundle..."
npm run build:prod

# Analyze bundle size
echo "📊 Analyzing bundle size..."
npm run build:analyze

echo "✅ Build completed successfully!"
echo "📁 Output directory: ./dist"
echo "🌐 Preview with: npm run preview"
