exports.check = (req, res, next) => {
    let url = req.originalUrl;
    let role_permissions = req.session.role_permissions;

    if (!role_permissions.includes(url)) {
        return res.json({ error: 1, message: 'Unauthorized' })
    }

    next()
}