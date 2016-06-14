/**
* Method.js
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

        content: {
            type: 'string',
        },
    }
};
