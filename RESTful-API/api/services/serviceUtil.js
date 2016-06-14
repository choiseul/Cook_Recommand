module.exports = {
    response: function (req, res) {
        return function (error, result) {
            if (error) {
                if (error.error) {
                    return res.serverError(error);
                }

                sails.log(error);
                return res.serverError(error);
            }

            return res.ok(result);
        };
    },
};
