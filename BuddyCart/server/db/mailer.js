const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "2525", 10);
const SMTP_SECURE = (process.env.SMTP_SECURE || "false") === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const ADMIN_EMAILS = process.env.ADMIN_EMAILS || "";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

async function sendMail({ to, subject, html, text }) {
  if (!to) return;
  const info = await transporter.sendMail({
    from: `"BuddyCart Notification" <${SMTP_USER || "no-reply@buddycart.dev"}>`,
    to: Array.isArray(to) ? to.join(",") : to,
    subject,
    text,
    html,
  });
  console.log("✅ Mail sent:", info.messageId);
}


function roleRequestAdminTemplate({ user = {}, reqDoc = {} }) {
  const subject = `[BuddyCart] New role request: ${user.email} → ${reqDoc.requestedRole}`;
  const html = `
    <p>A user has requested a new role:</p>
    <ul>
      <li><b>User:</b> ${user.name} &lt;${user.email}&gt;</li>
      <li><b>Requested Role:</b> ${reqDoc.requestedRole}</li>
      <li><b>Reason:</b> ${reqDoc.reason || "-"}</li>
      <li><b>Created At:</b> ${reqDoc.createdAt}</li>
    </ul>
  `;
  return { subject, html, text: html.replace(/<[^>]+>/g, "") };
}

function roleRequestResultTemplate({ userEmail, reqDoc = {} }) {
  const subject = `[BuddyCart] Your role request was ${reqDoc.reviewStatus}`;
  const html = `
    <p>Your request has been <b>${reqDoc.reviewStatus}</b>:</p>
    <ul>
      <li>Requested Role: <b>${reqDoc.requestedRole}</b></li>
      <li>Reviewer Notes: ${reqDoc.reviewReason || "-"}</li>
      <li>Time: ${reqDoc.reviewDate}</li>
    </ul>
  `;
  return { subject, html, text: html.replace(/<[^>]+>/g, "") };
}


async function notifyAdminsNewRoleRequest({ user, reqDoc }) {
  if (!ADMIN_EMAILS) return;
  const tpl = roleRequestAdminTemplate({ user, reqDoc });
  await sendMail({ to: ADMIN_EMAILS.split(","), ...tpl });
}

async function notifyApplicantResult({ userEmail, reqDoc }) {
  if (!userEmail) return;
  const tpl = roleRequestResultTemplate({ userEmail, reqDoc });
  await sendMail({ to: userEmail, ...tpl });
}

module.exports = {
  sendMail,
  notifyAdminsNewRoleRequest,
  notifyApplicantResult,
};
