const mongoose = require('mongoose');

const GuildPotsSchema = new mongoose.Schema({
    user_id: String,
    pots: Number
});

module.exports = mongoose.model('GuildPots', GuildPotsSchema);