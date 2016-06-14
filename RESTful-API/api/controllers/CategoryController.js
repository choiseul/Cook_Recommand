/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * API Route: GET /category
	 */

	find: function(req, res) {
		async.series([
			function bringCategories(cb) {
				Category.find({
					where: {
						countRecipes: {
							'>': 0,
						}
					},
				}).exec(function(err, res) {
					if (err) {
						cb(err);
					}

					cb(null, res);
				})
			},
		], function afterwards(err, results) {
			if (err) {
				return res.negotiate(err);
			}

			return res.ok(results);
		})
	},

    deleteTimeStamp: function(req, res) {
        Category.update({}, {
            createdAt: null,
            updatedAt: null
        }).exec(function (err, updatedCategories) {
            Feeling.update({}, {
                createdAt: null,
                updatedAt: null
            }).exec(function (err, updatedFeelings) {
                Like.update({}, {
                    createdAt: null,
                    updatedAt: null
                }).exec(function (err, updatedLikes) {
                    Method.update({}, {
                        createdAt: null,
                        updatedAt: null
                    }).exec(function (err, updatedMethods) {
                        Recipe.update({}, {
                            createdAt: null,
                            updatedAt: null
                        }).exec(function (err, updatedRecipes) {
                            Review.update({}, {
                                createdAt: null,
                                updatedAt: null
                            }).exec(function (err, updatedReviews) {
                                User.update({}, {
                                    createdAt: null,
                                    updatedAt: null
                                }).exec(function (err, updatedUsers) {
                                    View.update({}, {
                                        createdAt: null,
                                        updatedAt: null
                                    }).exec(function (err, updatedViews) {
                                        return res.ok();
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

};
