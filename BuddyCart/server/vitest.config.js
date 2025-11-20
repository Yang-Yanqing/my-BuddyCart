const {defineConfig}=require("vitest/config");

module.exports=defineConfig(
    {
        test:{
            setupFiles:["./tests/setupTest.js"],
        },
    });