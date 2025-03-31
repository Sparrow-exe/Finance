const { securityEvents } = require('./tokenRotation');

// Example: Replace with real email sending service later
const sendSecurityAlertEmail = async (email, details) => {
  console.log(`Security Alert Email to ${email}:`, details);
  // TODO: Integrate real email service (e.g., SendGrid, SES)
};

securityEvents.on('tokenReuseDetected', async ({ user, reusedToken }) => {
  const details = {
    message: 'Suspicious activity detected on your account (refresh token reuse).',
    ip: reusedToken.ip,
    userAgent: reusedToken.userAgent,
    timestamp: reusedToken.lastUsedAt,
  };

  // Log incident
  console.warn(`⚠️ Refresh token reuse detected for user ${user.email}:`, details);

  // Send email notification (or integrate with real alerting)
  await sendSecurityAlertEmail(user.email, details);

  // Optional: implement additional security response (e.g., lock account)
});



// Example of logging IP when sending security alerts
securityEvents.on('tokenReuseDetected', async ({ user, reusedToken }) => {
  const currentIp = reusedToken.ip; // already logged correctly
  console.warn(`⚠️ Token reuse detected for ${user.email} from IP: ${currentIp}`);
  // ... alert logic
});
