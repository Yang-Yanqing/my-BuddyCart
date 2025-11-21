/** @type {import('vitest/config').UserConfig} */

module.exports=defineConfig(
    {
        test:{
            setupFiles:["./tests/setupTest.js"],
        },
    });