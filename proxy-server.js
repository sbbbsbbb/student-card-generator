require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID';

// Function để gửi thông báo Telegram
async function sendTelegramNotification(message) {
    try {
        if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_TELEGRAM_CHAT_ID') {
            console.log('⚠️ Telegram không được cấu hình. Message:', message);
            return false;
        }

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            console.log('✅ Telegram notification sent successfully');
            return true;
        } else {
            const error = await response.text();
            console.error('❌ Telegram notification failed:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Telegram notification error:', error);
        return false;
    }
}

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Middleware để log requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Root route redirect to SheerID Verifier
app.get('/', (req, res) => {
    res.redirect('/ggone_pro.secure.html');
});

// API endpoint để nhận thông báo xác minh từ frontend
app.post('/api/notify-verification', async (req, res) => {
    try {
        const { 
            action, 
            verificationId, 
            userAgent, 
            timestamp, 
            ipAddress,
            referrer 
        } = req.body;

        // Lấy IP address của client
        const clientIP = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress ||
                        'Unknown';

        // Tạo thông báo chi tiết
        const message = `🚨 <b>SheerID Verifier - Xác Minh Mới</b>\n\n` +
                       `🔍 <b>Hành động:</b> ${action || 'Bắt đầu xác minh'}\n` +
                       `🆔 <b>Verification ID:</b> <code>${verificationId || 'N/A'}</code>\n` +
                       `🕐 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
                       `🌐 <b>IP Address:</b> <code>${clientIP}</code>\n` +
                       `💻 <b>User Agent:</b> <code>${userAgent || req.get('User-Agent') || 'Unknown'}</code>\n` +
                       `🔗 <b>Referrer:</b> ${referrer || req.get('Referer') || 'Direct access'}\n` +
                       `📱 <b>Nguồn:</b> Web Application`;

        // Gửi thông báo Telegram
        const sent = await sendTelegramNotification(message);

        // Log vào console
        console.log('📝 Verification attempt logged:');
        console.log(`   - Action: ${action}`);
        console.log(`   - Verification ID: ${verificationId}`);
        console.log(`   - IP: ${clientIP}`);
        console.log(`   - Telegram sent: ${sent ? 'Yes' : 'No'}`);

        res.json({ 
            success: true, 
            message: 'Notification logged successfully',
            telegramSent: sent,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Notification error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to log notification: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`� SheerID Verifier Server running on http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${__dirname}`);
    console.log(`� Main App: http://localhost:${PORT}/ggone_pro.secure.html`);
    console.log(`\n📱 API Endpoints:`);
    console.log(`   POST /api/notify-verification → Telegram notifications`);
    console.log(`\n🤖 Telegram Bot Status:`);
    console.log(`   Token configured: ${TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN' ? '✅ Yes' : '❌ No (set TELEGRAM_BOT_TOKEN)'}`);
    console.log(`   Chat ID configured: ${TELEGRAM_CHAT_ID !== 'YOUR_TELEGRAM_CHAT_ID' ? '✅ Yes' : '❌ No (set TELEGRAM_CHAT_ID)'}`);
});
