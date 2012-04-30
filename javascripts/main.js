$(function(){}
	var DataSource = new Firebase('http://gamma.firebase.com/codercub/');
	DataSource.set('I am now writing data into Firebase!');

	console.log("done.");
});