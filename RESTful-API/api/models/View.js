/**
* View.js
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
        /**
         * 조회자
         * @type {Object}
         */
        user: {
            model: 'User',
            required: true,
        },

        /**
         * 레시피
         * @type {Object}
         */
        recipe: {
            model: 'Recipe',
            required: true,
        },
    },

    afterCreate: function(view, cb) {
        async.series([
            function increaseViewCount(cb) {
                Recipe.findOne({
                    id: view.recipe,
                }).exec(function(err, recipe) {
                    if (err) {
                        cb(err);
                    }

                    recipe.countViews++;
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
                    event: 'view',
                    uid: view.user,
                    iid: view.recipe,
                }).then(function(res) {
                    cb(null, res);
                })
                .catch(cb);
            }
        ], cb)
    },

    beforeDestory: function(criteria, cb) {
        async.waterfall([
            function bringView(cb) {
                View.find(criteria).exec(function(err, views) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, views);
                })
            },
            // TODO: update
            function detachEvent(views, cb) {
                async.each(views, eachView, cb);

                function eachView(view, cb) {
                    async.parallel([
                        decreaseCount,
                        sendToML,
                    ], cb);

                    function decreaseCount(cb) {
                        Recipe
                            .findOne({
                                id: view.recipe,
                            })
                            .then(function (recipe) {
                                recipe.countViews--;

                                recipe.save(function (error, recipe) {
                                    return cb(error);
                                });
                            })
                            .catch(cb);
                    }

                    function sendToML(cb) {
                        // TODO: unset pio
                        return cb();
                    }
                }
            }
        ], cb)
    }
};
