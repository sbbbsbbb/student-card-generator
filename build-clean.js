const fs = require('fs');

// Script để clean và remove tracking
function cleanAndSecure() {
    try {
        console.log('🧹 Cleaning file...');
        
        let content = fs.readFileSync('ggone_pro.html', 'utf8');
        
        // 1. Remove Cloudflare Rocket Loader (đã làm rồi nhưng đảm bảo clean)
        content = content.replace(/data-cf-[^=]*="[^"]*"/g, '');
        content = content.replace(/type="[a-f0-9]+-text\/javascript"/g, 'type="text/javascript"');
        
        // 2. Remove any external tracking scripts
        content = content.replace(/<script[^>]*rocket-loader[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*cloudflareinsights[^>]*><\/script>/g, '');
        content = content.replace(/<script[^>]*beacon\.min\.js[^>]*><\/script>/g, '');
        
        // 3. Remove comments that might reveal information
        content = content.replace(/<!--.*?-->/gs, '');
        
        // 4. Clean up Cloudflare attributes
        content = content.replace(/window\.__cfRLUnblockHandlers[^;]*;/g, '');
        content = content.replace(/if \(!window\.__cfRLUnblockHandlers\) return false; /g, '');
        
        // 5. Replace any remaining Chinese comments
        content = content.replace(/\/\/ .*[\u4e00-\u9fff].*/g, '');
        content = content.replace(/\/\* .*[\u4e00-\u9fff].*? \*\//g, '');
        
        // 6. Add content protection headers trong meta tags
        const securityMeta = `
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://js.hcaptcha.com; style-src 'self' 'unsafe-inline';">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">`;
        
        content = content.replace('</head>', securityMeta + '\n</head>');
        
        // 7. Lưu file đã clean
        fs.writeFileSync('ggone_pro.clean.html', content);
        
        console.log('✅ Clean thành công!');
        console.log('📁 File output: ggone_pro.clean.html');
        console.log('🗑️  Đã xóa: Cloudflare scripts, tracking codes, Chinese comments');
        
    } catch (error) {
        console.error('❌ Lỗi clean:', error);
    }
}

cleanAndSecure();