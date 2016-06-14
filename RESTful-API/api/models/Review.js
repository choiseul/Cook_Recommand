/**
* Review.js
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
         * 작성자
         * @type {Object}
         */
        author: {
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

        /**
         * 리뷰 내용
         * @type {Object}
         */
        content: {
            type: 'text',
            minLength: 10,
        },

        /**
         * 리뷰 이미지
         * @type {Object}
         */
        image: {
            model: 'Resource',
        },
    },

    afterCreate: function(review, cb) {
        async.series([
            function increaseUser(cb) {
                User.findOne({
                    id: review.author
                }).exec(function(err, user) {
                    if (err) {
                        cb(err);
                    }

                    user.countReviews++;
                    user.save(function(err, user) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, user);
                    })
                })
            },

            function increaseRecipe(cb) {
                Recipe.findOne({
                    id: review.recipe,
                }).exec(function (err, recipe) {
                    if (err) {
                        cb(err);
                    }

                    else if (!recipe) {
                        sails.log.debug('No recipe!!!');
                        cb('No Recipe!!');
                    }

                    recipe.countReviews++;
                    recipe.save(function(err, user) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, user);
                    })
                })
            }
        ], cb);
    },

    beforeDestory: function(criteria, cb) {
        async.waterfall([
            function findReview(cb) {
                Review.findOne(criteria).exec(function(err, review) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, review);
                })
            },

            function decreaseCount(review, cb) {
                async.series([
                    function decreaseUser(cb) {
                        User.findOne({
                            id: review.author,
                        }).exec(function(err, user) {
                            user.countReviews--;
                            user.save(function(err, user) {
                                if (err) {
                                    cb(err);
                                }

                                eb(null, user);
                            })
                        })
                    },

                    function decreaseRecipe(cb) {
                        Recipe.findOne({
                            id: review.recipe
                        }).exec(function(err, recipe) {
                            if (err) {
                                cb(err);
                            }

                            recipe.countRecipes--;
                            recipe.save(function(err, user) {
                                if (err) {
                                    cb(err);
                                }

                                cb(null, user);
                            })
                        })
                    }
                ], cb);
            }
        ], cb)
    }
};
