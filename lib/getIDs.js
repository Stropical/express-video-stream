module.exports = function(config, req, res, next) {
    var result = [];
        config.files.forEach((obj) => result.push(obj.id))
        res.status(200).send(result);
        next();
}