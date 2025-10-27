const nodemailer = require("nodemailer");


const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE = (process.env.SMTP_SECURE || "false") === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const ADMIN_EMAILS = process.env.ADMIN_EMAILS || "";

const transporterOptions = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
};

if (SMTP_USER && SMTP_PASS) {
  transporterOptions.auth = { user: SMTP_USER, pass: SMTP_PASS };
}

const transporter = nodemailer.createTransport(transporterOptions);


const adminList = [];
if (ADMIN_EMAILS) {
  const parts = ADMIN_EMAILS.split(",");
  for (let i = 0; i < parts.length; i++) {
    const email = (parts[i] || "").trim();
    if (email) {
      adminList.push(email);
    }
  }
}


async function sendMail(options) {
  if (!options) return;

  let to = options.to;
  const subject = options.subject || "";
  const text = options.text || "";
  const html = options.html || "";

  if (Array.isArray(to)) {
    if (to.length === 0) return;
    to = to.join(",");
  }
  if (!to) return;

  const from = SMTP_USER ? SMTP_USER : "no-reply@buddycart.local";

  try {
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error("[Mailer] sendMail failed:", msg);
  }
}


function roleRequestAdminTemplate(params) {
  params = params || {};
  const user = params.user || {};
  const reqDoc = params.reqDoc || {};

  const userName = user.name ? user.name : "-";
  const userEmail = user.email ? user.email : "-";
  const requestedRole = reqDoc.requestedRole ? reqDoc.requestedRole : "-";
  const reason = reqDoc.reason ? reqDoc.reason : "-";

  const createdAt = reqDoc.createdAt ? new Date(reqDoc.createdAt) : new Date();
  const createdISO = createdAt.toISOString();

  const subject =
    "[BuddyCart] New role request: " + userEmail + " → " + requestedRole;

  const text =
    "A user submitted a role request:\n" +
    "User: " + userName + " <" + userEmail + ">\n" +
    "Requested Role: " + requestedRole + "\n" +
    "Created At: " + createdISO + "\n" +
    "Reason: " + reason + "\n" +
    "Please review it in the admin dashboard.";

  const html =
    "<p>A user submitted a role request:</p>\n" +
    "<ul>\n" +
    "  <li>User: " + userName + " &lt;" + userEmail + "&gt;</li>\n" +
    "  <li>Requested Role: <b>" + requestedRole + "</b></li>\n" +
    "  <li>Created At: " + createdISO + "</li>\n" +
    "  <li>Reason: " + reason + "</li>\n" +
    "</ul>\n" +
    "<p>Please review it in the admin dashboard.</p>";

  return { subject: subject, text: text, html: html };
}


function roleRequestResultTemplate(params) {
  params = params || {};
  const user = params.user || {};
  const reqDoc = params.reqDoc || {};

  const requestedRole = reqDoc.requestedRole ? reqDoc.requestedRole : "-";

  let statusText = "processed";
  if (reqDoc.reviewStatus === "approved") {
    statusText = "approved";
  } else if (reqDoc.reviewStatus === "rejected") {
    statusText = "rejected";
  }

  const reviewStatus = reqDoc.reviewStatus ? reqDoc.reviewStatus : "-";
  const reviewReason = reqDoc.reviewReason ? reqDoc.reviewReason : "-";
  const reviewDateObj = reqDoc.reviewDate ? new Date(reqDoc.reviewDate) : new Date();
  const reviewDateISO = reviewDateObj.toISOString();

  const subject = "[BuddyCart] Your role request was " + statusText;

  const text =
    "Your role request was " + statusText + ":\n" +
    "Requested Role: " + requestedRole + "\n" +
    "Result: " + reviewStatus + "\n" +
    "Reviewer Notes: " + reviewReason + "\n" +
    "Time: " + reviewDateISO;

  const html =
    "<p>Your role request was <b>" + statusText + "</b>:</p>\n" +
    "<ul>\n" +
    "  <li>Requested Role: <b>" + requestedRole + "</b></li>\n" +
    "  <li>Result: <b>" + reviewStatus + "</b></li>\n" +
    "  <li>Reviewer Notes: " + reviewReason + "</li>\n" +
    "  <li>Time: " + reviewDateISO + "</li>\n" +
    "</ul>";

  return { subject: subject, text: text, html: html };
}


async function notifyAdminsNewRoleRequest(params) {
  params = params || {};
  const user = params.user || {};
  const reqDoc = params.reqDoc || {};

  if (!adminList || adminList.length === 0) return;

  const tpl = roleRequestAdminTemplate({ user: user, reqDoc: reqDoc });
  await sendMail({
    to: adminList,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
}


async function notifyApplicantResult(params) {
  params = params || {};
  const userEmail = params.userEmail || "";
  const reqDoc = params.reqDoc || {};

  if (!userEmail) return;

  const tpl = roleRequestResultTemplate({
    user: { email: userEmail },
    reqDoc: reqDoc,
  });

  await sendMail({
    to: userEmail,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
}

module.exports = {
  notifyAdminsNewRoleRequest: notifyAdminsNewRoleRequest,
  notifyApplicantResult: notifyApplicantResult,
};
