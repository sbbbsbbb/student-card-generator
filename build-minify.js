// Script để minify và obfuscate code
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function minifyAndObfuscate() {
    try {
        // Đọc file HTML gốc
        const htmlContent = fs.readFileSync('ggone_pro.html', 'utf8');
        
        // Tách JavaScript từ HTML
        const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/g);
        
        if (scriptMatch) {
            let minifiedHtml = htmlContent;
            
            for (let script of scriptMatch) {
                const jsCode = script.replace(/<\/?script[^>]*>/g, '');
                
                // Minify và obfuscate
                const minified = await minify(jsCode, {
                    compress: {
                        dead_code: true,
                        drop_debugger: true,
                        drop_console: true, // Xóa console.log
                        passes: 3
                    },
                    mangle: {
                        toplevel: true,
                        properties: {
                            regex: /^_/ // Obfuscate properties bắt đầu với _
                        }
                    },
                    format: {
                        comments: false // Xóa tất cả comments
                    }
                });
                
                // Thay thế script cũ bằng script đã minify
                minifiedHtml = minifiedHtml.replace(script, `<script>${minified.code}</script>`);
            }
            
            // Minify HTML
            minifiedHtml = minifiedHtml
                .replace(/\s+/g, ' ')           // Gộp nhiều spaces thành 1
                .replace(/>\s+</g, '><')        // Xóa space giữa tags
                .replace(/<!--[\s\S]*?-->/g, '') // Xóa comments
                .trim();
            
            // Lưu file đã minify
            fs.writeFileSync('ggone_pro.min.html', minifiedHtml);
            
            console.log('✅ Minify và obfuscate thành công!');
            console.log('📁 File output: ggone_pro.min.html');
        }
    } catch (error) {
        console.error('❌ Lỗi:', error);
    }
}

// Chạy nếu file này được execute trực tiếp
if (require.main === module) {
    minifyAndObfuscate();
}

module.exports = { minifyAndObfuscate };