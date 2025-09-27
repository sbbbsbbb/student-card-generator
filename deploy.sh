# Render.com Deploy Script
echo "🚀 Starting Render.com deployment..."

# Build secure version
echo "🔒 Building secure files..."
npm install
npm run build:all

echo "✅ Build completed!"

# Copy secure file as main index
echo "📁 Setting up main page..."
cp ggone_pro.secure.html main.html

echo "🌐 Files ready for deployment:"
echo "  - index.html (landing page with redirect)"
echo "  - ggone_pro.secure.html (main app - obfuscated)"  
echo "  - ggone_pro.clean.html (clean version - backup)"
echo "  - main.html (copy of secure version)"

echo "✅ Deployment preparation complete!"