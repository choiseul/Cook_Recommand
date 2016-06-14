/**
* Like.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,

    toJSON: function () {
        var object = this.toObject();

        delete object.createdAt;
        delete object.updatedAt;

        return object;
    },

    attributes: {
        recipe: {
            model: 'Recipe',
            required: true,
        },

        user: {
            model: 'User',
            required: true,
        },
    },

    afterCreate: function(like, cb) {
        async.series([
            function addLikes(cb) {
                Recipe.findOne({
                    id: like.recipe,
                }).exec(function (err, recipe) {
                    recipe.countLikes++;

                    recipe.save(function(err, recipe) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, recipe);
                    })
                })
            },

            function sendToML(cb) {
                var pioRecipe = Pio.getEvent('myRecipe2');

                pioRecipe.createAction({
                    event: 'like',
                    uid: like.user,
                    iid: like.recipe,
                }).then(function(res) {
                    cb(null, res);
                }).catch(cb);
            }
        ], function afterwards(err, results) {
            if (err) {
                return cb(err);
            }

            cb();
        })
    },

    beforeDestory: function(criteria, cb) {
        async.waterfall([
            function bringLike (cb) {
                Like.findOne(criteria).exec(function(err, like) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, like);
                })
            },

            function detachLike(like, cb) {
                async.series([
                    function sendToML(cb) {
                        var pioRecipe = Pio.getEvent('myRecipe2');

                        pioRecipe.createAction({
                            event: 'cancel_like',
                            uid: like.user,
                            iid: like.recipe,
                        }).then(function(res) {
                            cb(null, res);
                        }).catch(cb);
                    },

                    function decreaseCount(cb) {
                        Recipe.findOne({
                            id: like.recipe,
                        }).exec(function(err, recipe) {
                            if (err) {
                                cb(err);
                            }

                            recipe.countLikes--;
                            recipe.save(function(err, recipe) {
                                if (err) {
                                    cb(err);
                                }

                                cb(null, recipe);
                            })
                        })
                    }
                ], function afterwards(err, results) {
                    if (err) {
                        return cb(err);
                    }

                    cb();
                })
            }
        ], function afterwards(err, results) {
            if (err) {
                return cb(err);
            }

            cb();
        })
    }
};
