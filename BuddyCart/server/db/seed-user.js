// seed_users.js
// Usage: node seed_users.js
// Needs: npm i axios dotenv
const axios = require('axios').default;
const qs = require('querystring');
// require('dotenv').config();

const BASE = process.env.BASE_URL || 'http://localhost:4000';

const PATHS = {
  register: process.env.AUTH_REGISTER_PATH || '/api/auth/register',
  login: process.env.AUTH_LOGIN_PATH || '/api/auth/login',
  me: process.env.AUTH_ME_PATH || '/api/auth/me',
  // 尝试多个提权端点（从上到下依次尝试）
  setRoleCandidates: [
    process.env.ADMIN_SET_ROLE_PATH || '/api/admin/users/{id}/role',
    process.env.ADMIN_UPDATE_USER_PATH || '/api/admin/users/{id}',
    '/api/admin/user/{id}/role',
    '/api/admin/user/{id}',
    '/api/users/{id}/role', // 兜底
  ],
};

const USERS = [
  {
    username: 'm.basion',
    displayName: 'm.basion',
    email: 'm.basion@example.com',
    password: 'Basion123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/6.x/identicon/svg?seed=m.basion',
    bio: 'Site admin — manages product sync and reviews',
  },
  {
    username: 'akuma',
    displayName: 'Akuma',
    email: 'akuma@shop.example.com',
    password: 'Akuma2025',
    role: 'vendor',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=akuma',
    bio: 'Demon-tier vendor of fighting gear and collectibles',
  },
  {
    username: 'zangief',
    displayName: 'Zangief',
    email: 'zangief@shop.example.com',
    password: 'Zangief2025',
    role: 'vendor',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=zangief',
    bio: 'Powerhouse vendor, heavy-grade memorabilia specialist',
  },
  {
    username: 'chunli',
    displayName: 'Chun-Li',
    email: 'chunli@example.com',
    password: 'ChunLi123',
    role: 'customer',
    avatar: 'https://api.dicebear.com/6.x/female/svg?seed=chunli',
    bio: 'Fighting fan and trend-savvy shopper',
  },
  {
    username: 'ken',
    displayName: 'Ken',
    email: 'ken@example.com',
    password: 'KenKick123',
    role: 'customer',
    avatar: 'https://api.dicebear.com/6.x/male/svg?seed=ken',
    bio: 'Regular visitor and loyal buyer',
  },
];

// 小工具
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function joinUrl(base, path) {
  return base.replace(/\/+$/,'') + '/' + path.replace(/^\/+/,'');
}

async function postJson(url, data, headers = {}) {
  try {
    const res = await axios.post(url, data, { headers: { 'Content-Type': 'application/json', ...headers }});
    return res;
  } catch (e) {
    if (e.response) return e.response;
    throw e;
  }
}

async function getJson(url, headers = {}) {
  try {
    const res = await axios.get(url, { headers });
    return res;
  } catch (e) {
    if (e.response) return e.response;
    throw e;
  }
}

async function login(email, password) {
  const url = joinUrl(BASE, PATHS.login);
  const payload = { email, password };
  const res = await postJson(url, payload);
  if (res.status >= 200 && res.status < 300 && res.data) {
    // 兼容多种返回结构：token/tokenType/user
    const token = res.data.token || res.data.accessToken || res.data.jwt || res.data?.data?.token;
    const user = res.data.user || res.data.profile || res.data.me || res.data?.data?.user;
    return { token, user, raw: res.data };
  }
  throw new Error(`Login failed (${res.status}) ${url}: ${JSON.stringify(res.data).slice(0,200)}`);
}

async function me(token) {
  const url = joinUrl(BASE, PATHS.me);
  const res = await getJson(url, { Authorization: `Bearer ${token}` });
  if (res.status >= 200 && res.status < 300 && res.data) {
    return res.data.user || res.data.me || res.data;
  }
  throw new Error(`Fetch /me failed (${res.status})`);
}

function replaceId(path, id) {
  return path.replace('{id}', id);
}

async function setRoleWithCandidates(adminToken, userId, role) {
  const headers = { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
  const bodyCandidates = [
    { method: 'PUT', body: { role } },
    { method: 'PATCH', body: { role } },
    { method: 'POST', body: { role } },
    // 有些后端需要包一层 data
    { method: 'PUT', body: { data: { role } } },
    { method: 'PATCH', body: { data: { role } } },
    { method: 'POST', body: { data: { role } } },
  ];

  for (const p of PATHS.setRoleCandidates) {
    const url = joinUrl(BASE, replaceId(p, userId));
    for (const opt of bodyCandidates) {
      try {
        const res = await axios.request({
          url,
          method: opt.method,
          data: opt.body,
          headers
        });
        if (res.status >= 200 && res.status < 300) {
          return { ok: true, via: `${opt.method} ${p}` };
        }
      } catch (e) {
        // 忽略，尝试下一个
        await sleep(50);
      }
    }
  }
  return { ok: false };
}

async function registerAttempt(user, withRole = true) {
  const url = joinUrl(BASE, PATHS.register);
  const payload = {
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    password: user.password,
    avatar: user.avatar,
    bio: user.bio,
  };
  if (withRole) payload.role = user.role;

  const res = await postJson(url, payload);
  return res;
}

async function ensureUser(user, adminCtx) {

  let res = await registerAttempt(user, true);

  if (res.status === 201 || (res.status === 200 && res.data)) {
    const created = res.data.user || res.data;
    const id = created.id || created._id || created.userId || created?.data?.id;
    console.log(`✔ Created ${user.email} with role=${user.role} (direct)`);
    return { id, mode: 'direct' };
  }

  
  if (res.status === 409 || String(res.data).includes('exists') || String(res.data?.message||'').toLowerCase().includes('exists')) {
    console.log(`ℹ ${user.email} exists, will try to login to fetch id...`);
    const { token } = await login(user.email, user.password);
    const profile = await me(token);
    const id = profile.id || profile._id || profile.userId;
    return { id, mode: 'already' };
  }


  const msg = (res.data && (res.data.error || res.data.message)) ? String(res.data.error || res.data.message).toLowerCase() : '';
  if (res.status >= 400 && (msg.includes('role') || msg.includes('not allowed') || msg.includes('forbidden'))) {

    const res2 = await registerAttempt(user, false);
    if (res2.status === 201 || res2.status === 200) {
      const created = res2.data.user || res2.data;
      const id = created.id || created._id || created.userId || created?.data?.id;
      console.log(`✔ Created ${user.email} without role; will elevate to ${user.role}`);
      return { id, mode: 'no-role' };
    }
  }


  try {
    const { token } = await login(user.email, user.password);
    const profile = await me(token);
    const id = profile.id || profile._id || profile.userId;
    console.log(`✔ ${user.email} seems active (via login).`);
    return { id, mode: 'login-detected' };
  } catch (e) {
    console.error(`✖ Failed to create ${user.email}:`, res.status, res.data);
    throw new Error(`Cannot ensure user ${user.email}`);
  }
}

async function main() {
  console.log(`→ Seeding users to ${BASE}`);
 
  let bootstrapAdmin = null;

  
  const adminUser = USERS.find(u => u.role === 'admin');

  
  const ensuredAdmin = await ensureUser(adminUser);
 
  let adminToken = null;
  try {
    const { token, user } = await login(adminUser.email, adminUser.password);
    adminToken = token;
    bootstrapAdmin = user;
  } catch {
 
  }

  
  if (!adminToken && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    try {
      const { token, user } = await login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
      adminToken = token;
      bootstrapAdmin = user;
      console.log(`✔ Using existing admin from .env for elevation`);
    } catch (e) {
      console.warn(`⚠ Cannot login with .env admin. If your /register forbids role, elevation may fail.`);
    }
  }


  for (const u of USERS.filter(x => x.email !== adminUser.email)) {
    const ensured = await ensureUser(u);
    
    if (u.role !== 'customer' && ensured.mode !== 'direct') {
      if (!adminToken) {
        console.warn(`⚠ Skipped elevating ${u.email} to ${u.role} (no admin token).`);
        continue;
      }
      const userId = ensured.id;
      if (!userId) {
        console.warn(`⚠ Cannot elevate ${u.email} (no user id)`);
        continue;
      }
      const result = await setRoleWithCandidates(adminToken, userId, u.role);
      if (result.ok) {
        console.log(`✔ Elevated ${u.email} -> ${u.role} via ${result.via}`);
      } else {
        console.warn(`✖ Elevation failed for ${u.email}. Please check your admin endpoints.`);
      }
    }
  }

  console.log('✅ Done. You can now login with:');
  USERS.forEach(u => {
    console.log(` - ${u.displayName} (${u.role}): ${u.email} / ${u.password}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
