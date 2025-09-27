const fs = require('fs');
const crypto = require('crypto');

// Script bảo vệ nâng cao với nhiều lớp bảo mật
class SecureBuilder {
    constructor() {
        this.secretKey = this.generateKey();
    }

    generateKey() {
        return crypto.randomBytes(16).toString('hex');
    }

    // Mã hóa string
    encrypt(text) {
        const cipher = crypto.createCipher('aes192', this.secretKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // Giải mã string
    decrypt(encrypted) {
        const decipher = crypto.createDecipher('aes192', this.secretKey);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // Tạo anti-debugging code
    generateAntiDebug() {
        return `
        (function(){
            let devtools = {open: false, orientation: null};
            const threshold = 160;
            
            setInterval(function(){
                if(window.outerHeight - window.innerHeight > threshold || 
                   window.outerWidth - window.innerWidth > threshold){
                    if(!devtools.open){
                        devtools.open = true;
                        // Redirect hoặc disable functionality khi detect F12
                        document.body.innerHTML = '<h1 style="text-align:center;margin-top:50vh;transform:translateY(-50%);">🚫 Access Denied</h1>';
                        throw new Error('DevTools detected');
                    }
                } else {
                    devtools.open = false;
                }
            }, 500);
            
            // Disable right click
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Disable common shortcuts
            document.addEventListener('keydown', function(e) {
                if(e.keyCode == 123 || // F12
                   (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
                   (e.ctrlKey && e.shiftKey && e.keyCode == 74) || // Ctrl+Shift+J
                   (e.ctrlKey && e.keyCode == 85)) { // Ctrl+U
                    e.preventDefault();
                    return false;
                }
            });
        })();
        `;
    }

    // Tạo fake code để confuse
    generateDecoyCode() {
        return `
        // Fake API endpoints và functions
        const FAKE_API = {
            endpoint: 'https://fake-api.com/verify',
            key: 'fake_key_12345',
            secret: 'fake_secret_67890'
        };
        
        function fakeCaptchaVerify(){
            return fetch(FAKE_API.endpoint, {
                method: 'POST',
                headers: {'X-API-Key': FAKE_API.key}
            });
        }
        
        // Fake sensitive data
        const adminCredentials = {
            user: 'fake_admin',
            pass: 'fake_password_123'
        };
        `;
    }

    // Làm rối code structure
    obfuscateStructure(code) {
        // Thay thế tên biến với tên random
        const varMap = new Map();
        let obfuscated = code;
        
        // Tạo random variable names
        const generateVarName = () => '_' + Math.random().toString(36).substr(2, 9);
        
        // Find và replace variables
        const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;
        
        while ((match = varRegex.exec(code)) !== null) {
            if (!varMap.has(match[1])) {
                varMap.set(match[1], generateVarName());
            }
        }
        
        // Replace tất cả occurrences
        for (let [original, obfuscated_name] of varMap) {
            const regex = new RegExp('\\b' + original + '\\b', 'g');
            obfuscated = obfuscated.replace(regex, obfuscated_name);
        }
        
        return obfuscated;
    }

    async buildSecure() {
        try {
            console.log('🔒 Building secure version...');
            
            // Đọc file gốc
            const originalContent = fs.readFileSync('ggone_pro.html', 'utf8');
            
            // Extract JavaScript
            const scriptMatches = originalContent.match(/<script>([\s\S]*?)<\/script>/g);
            
            if (!scriptMatches) {
                throw new Error('Không tìm thấy JavaScript code');
            }
            
            let secureHtml = originalContent;
            
            for (let scriptTag of scriptMatches) {
                const jsCode = scriptTag.replace(/<\/?script[^>]*>/g, '');
                
                // 1. Thêm anti-debugging
                let secureJs = this.generateAntiDebug() + '\n' + jsCode;
                
                // 2. Thêm decoy code
                secureJs = this.generateDecoyCode() + '\n' + secureJs;
                
                // 3. Obfuscate structure
                secureJs = this.obfuscateStructure(secureJs);
                
                // 4. Minify với Terser (cần import)
                const { minify } = require('terser');
                const minified = await minify(secureJs, {
                    compress: {
                        dead_code: true,
                        drop_debugger: true,
                        drop_console: true,
                        passes: 3,
                        unsafe: true,
                        unsafe_comps: true,
                        unsafe_Function: true,
                        unsafe_math: true,
                        unsafe_symbols: true,
                        unsafe_methods: true
                    },
                    mangle: {
                        toplevel: true,
                        properties: {
                            regex: /.*/
                        }
                    },
                    format: {
                        comments: false
                    }
                });
                
                // 5. Thay thế script cũ
                secureHtml = secureHtml.replace(scriptTag, `<script>${minified.code}</script>`);
            }
            
            // Minify HTML
            secureHtml = secureHtml
                .replace(/\s+/g, ' ')
                .replace(/>\s+</g, '><')
                .replace(/<!--[\s\S]*?-->/g, '')
                .trim();
            
            // Lưu file bảo mật
            fs.writeFileSync('ggone_pro.secure.html', secureHtml);
            
            console.log('✅ Build secure thành công!');
            console.log('📁 File output: ggone_pro.secure.html');
            console.log('🔑 Secret key:', this.secretKey);
            
        } catch (error) {
            console.error('❌ Lỗi build secure:', error);
        }
    }
}

// Chạy script
const builder = new SecureBuilder();
builder.buildSecure();