

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {

        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }
        const chek = isEmpty(req.body)

if (!chek) {
    req.filter = null
    next()
} else {





}




    } catch (e) {

    }
}