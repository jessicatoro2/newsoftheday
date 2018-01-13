var mongoose = require("mongoose");


var Schema = mongoose.Schema


var ArticleSchema = new Schema({

	headline: {
		type: String,
		require: true
	},

	link: {
		type: String, 
		require: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;