module.exports = (app) => {
    // getting app locals
    let global = app.locals
    // getting url function
    global.url = (url = '') => {
        return process.env.APP_BASE_PATH + url
    }

    global.fields = (fields = '') => {
        return fields;
    }
}