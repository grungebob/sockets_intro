// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            "/socke.iot/*": {
                target: "http://localhost:3000",
                secure: false
            }
        }
    }
};
