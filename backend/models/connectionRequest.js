const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema(
    {
        fromUserId : {
            type : String,
            required : true,
            ref : "User",
            index : true,
        },
        toUserId : {
            type : String,
            required : true,
            ref : "User",
            index : true

        },
        status : {
            type : String,
            enum : {
                values : ["ignored", "interested", "accepted", "rejected"],
                message : `{VALUE} is incorrect status type`
            },
            required : true
        },
    },
    {
        timestamps : true,
    }

)

module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema)