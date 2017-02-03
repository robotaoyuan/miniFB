var APP_ID = 'KC8khQfC8nT3dIpaEIOmnMjO-gzGzoHsz';
var APP_KEY = 'YmGO0DyfHHndNzN2TjSnqBwr';

AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});


People = AV.Object.extend("People");
Post = AV.Object.extend("Post");


function showError(error){
	alert(error);
}

var usersDict = {
	"junze":"58916c79128fe10058c427db",
	"johnny":"58916ac78fd9c5322829a76f",
	"owen":"58916b838fd9c5322829ab10"
}

function onSubmitPost(e){
	var username = e.target.attributes.user.value;
	var post = new Post();
	post.set("content", document.getElementById(username+"-input").value);

	var from = AV.Object.createWithoutData("People", usersDict[username]);
	post.set("user",from);

	post.save().then(function(o){
		
		context.posts.unshift({
			username: username,
			content: o.get("content"),
			time: o.get("createdAt")
		});

		refreshPosts();

	},function(error){
		showError(error);
	});
}

var context = {
	posts: []
};

function refreshPosts(){
	var source = $("#posts-list").html();
	var template = Handlebars.compile(source);
	var html = template(context);
	$("#posts").html(html);
}

$( document ).ready(function() {

	$( "#junze-submit" ).click(onSubmitPost);
	$( "#owen-submit" ).click(onSubmitPost);
	$( "#johnny-submit" ).click(onSubmitPost);

	var query = new AV.Query("Post");
	query.include("user");
	query.descending("createdAt");
	query.find().then(function(posts){
		
		posts.forEach(function(p){
			context.posts.push({
				username: p.get("user").get("name"),
				content: p.get("content"),
				time: p.get("createdAt")
			})
		});

		refreshPosts();

	})

});