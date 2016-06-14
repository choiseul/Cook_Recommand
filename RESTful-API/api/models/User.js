var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,
    autoCreatedAt: false,
    autoUpdatedAt: false,

    toJSON: function () {
        var object = this.toObject();

        delete object.createdAt;
        delete object.updatedAt;

        return object;
    },

    attributes: {
        username  : { type: 'string', unique: true },
        email     : { type: 'email',  unique: true },
        passports : { collection: 'Passport', via: 'user' },

        countNewEvents: {
            type: 'integer',
            defaultsTo: 0,
        },

        predictionCached: {
            type: 'boolean',
            defaultsTo: false
        },

        countReviews: {
            type: 'integer',
            defaultsTo: 0,
        }
    },

    findOneByIdentifier: function (identifier) {
        var isEmail = validator.isEmail(identifier);
        var condition = {};

        if (isEmail) {
            condition.email = identifier;
        }
        else {
            condition.username = identifier;
        }

        return User.findOne(condtion);
    },

    findOneByCredential: function (identifier, password, next) {
        async.waterfall([
            function findUser(cb) {
                User
                .findOneByIdentifier(identifier)
                .then(function (user) {
                    if (!user) {
                        return cb(isEmail ? 'Error.User.Email.NotFound' : 'Error.User.ID.NotFound');
                    }

                    cb(null, user);
                })
                .catch(function (error) {
                    cb(error);
                });
            },

            function validPassword(user, cb) {
                Passport
                .findOne({
                    user: user.id,
                    protocol: 'local'
                })
                .then(function (passport) {
                    if (!passport) {
                        return cb('Error.Passport.NotFound');
                    }

                    passport.validPassword(password, function (error, res) {
                        if (error) return cb(error);

                        if (res) {
                            // success
                            return cb(null, user);
                        }
                        else {
                            return cb('Error.Passport.Incorrect');
                        }
                    });
                })
                .catch(function (error) {
                    cb(error);
                });
            }
        ], next);
    },

    afterCreate: function (user, cb) {
        async.parallel([
            function (cb) {
                var pioRecipe = Pio.getEvent('myRecipe2');

                pioRecipe
                .createUser({
                    uid: user.id,
                })
                .then(function (res) {
                    cb();
                })
                .catch(cb);
            },

        ], cb);
    },

    beforeDestroy: function (criteria, cb) {
        // TODO: unset user
        return cb();
    }
};

module.exports = User;
