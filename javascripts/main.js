$(function(){}
	var dataRef = new Firebase('http://gamma.firebase.com/codercub/');
	dataRef.on('value', function(snapshot) {
		console.log(snapshot);
	});
	console.log("done.");
});