const dotenv=require("dotenv");
const path=require("path")


const env=process.env.NODE_ENV||'development';

const envFile=env==="test"?".env.test":".env";

dotenv.config({
    path:path.resolve(process.cwd(),envFile),
})
console.log(`[env] Loaded${envFile} for NODE_ENV=${env}`);

