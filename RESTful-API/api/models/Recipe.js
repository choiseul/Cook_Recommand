/**
* Recipe.js
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
        // 음식 종류
        category: {
            model: 'category',
            required: true
        },

        // 식감
        feelings: {
            collection: 'feeling',
            via: 'recipes'
        },

        // 조리시간
        cooktime: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 음식 양(인분)
        amount: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 칼로리
        calorie: {
            type: 'integer',
            defaultsTo: 0,
        },

        // 보관온도
        temperature: {
            type: 'string',
            defaultsTo: '',
        },

        // 보관일
        expire: {
            type: 'integer',
            defaultsTo: 0,
        },

        /** @type {Object} 레시피 제목 */
        title: {
            type: 'string',
            maxLength: 255,
            required: true,
        },

        /** @type {Object} 레시피 조리 방법 */
        methods: {
            collection: 'Method',
            via: 'recipe',
        },

        // 썸네일
        methodThumbs: {
            collection: 'Resource',
            via: 'recipe'
        },

        /** @type {Object} 레시피 썸네일 */
        thumbnail: {
            model: 'Resource',
            required: true,
        },

        /** @type {Object} 레시피 리뷰들 */
        reviews: {
            collection: 'Review',
            via: 'recipe',
        },

        /** @type {Object} 레시피가 받은 좋아요 */
        likes: {
            collection: 'Like',
            via: 'recipe',
        },

        /** @type {Object} 조회 기록 */
        views: {
            collection: 'View',
            via: 'recipe',
        },

        countViews: {
            type: 'integer',
            defaultsTo: 0
        },

        countLikes: {
            type: 'integer',
            defaultsTo: 0
        },

        countReviews: {
            type: 'integer',
            defaultsTo: 0
        },
    },

    afterCreate: function(recipe, cb) {
        async.series([
            function countRecipe(cb) {
                Category.findOne({
                    id: recipe.category,
                }).exec(function(err, category) {
                    category.countRecipes++;

                    category.save(function(err, category) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, category);
                    })
                })
            }
        ], cb);
    },

    beforeDestory: function(criteria, cb) {
        async.waterfall([
            function bringRecipe(cb) {
                Recipe.findOne(criteria).exec(function(err, recipe) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, recipe);
                })
            },

            function decreaseCount(recipe, cb) {
                Category.findOne({
                    id: recipe.category,
                }).exec(function(err, category) {
                    category.countRecipes--;

                    category.save(function(err, category) {
                        if (err) {
                            cb(err);
                        }

                        cb(null, category);
                    })
                })
            }
        ], cb);
    }
};
