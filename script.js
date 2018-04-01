window.fbAsyncInit = function() {
	FB.init({
		appId      : '1984065068523485',
		xfbml      : true,
		version    : 'v2.12'
	});
	FB.AppEvents.logPageView();
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var user_access_token;
function myFacebookLogin() {
	FB.login(function(response){
		if (response.authResponse) {
			user_access_token = response.authResponse.accessToken;
			console.log("access token:"+user_access_token);
			document.getElementById("loginstatus").style.color = "#00ff00";
			document.getElementById("loginstatus").innerHTML = "login successfully!"
     			//console.log('Access Token = '+ user_access_token);
     		} else {
     			console.log('User cancelled login or did not fully authorize.');
     		}
     	}, {scope: 'user_managed_groups'});
}

function removeDuplicates(arr){
	let unique_array = []
	for(let i = 0;i < arr.length; i++){
		if(unique_array.indexOf(arr[i]) == -1){
			unique_array.push(arr[i])
		}
	}
	return unique_array
}


function compare(a_tag,a_comment){
	var para = document.getElementById("output");
	para.innerHTML = '';
	a_comment = removeDuplicates(a_comment);

	var t0 = document.createElement("b");
	t0.innerHTML = "People tagged : ";
	para.appendChild(t0);
	var linebreak = document.createElement('br');
	para.appendChild(linebreak); 

	var x0 = document.createElement("SPAN0");
	for(var i=0; i<a_tag.length; i++){
		t1 = document.createTextNode(a_tag[i]+" ");
		x0.appendChild(t1);
	}
	para.appendChild(x0);

	linebreak = document.createElement('br');
	para.appendChild(linebreak);
	linebreak = document.createElement('br');
	para.appendChild(linebreak);

	var t2 = document.createElement("b");
	t2.innerHTML = "People that comment : ";
	para.appendChild(t2);

	linebreak = document.createElement('br');
	para.appendChild(linebreak);

	var x1 = document.createElement("SPAN1");
	for(var i=0; i<a_comment.length; i++){
		var t3 = document.createTextNode(a_comment[i]+" ");
		x1.appendChild(t3);
	}
	para.appendChild(x1);

	linebreak = document.createElement('br');
	para.appendChild(linebreak);
	linebreak = document.createElement('br');
	para.appendChild(linebreak);

	var t4 = document.createElement("b");
	t4.innerHTML = "People who were tagged but haven't comment yet : ";
	para.appendChild(t4);

	linebreak = document.createElement('br');
	para.appendChild(linebreak);

	var x2 = document.createElement("SPAN2");
	var output = 1;
	for(var i=0; i<a_tag.length; i++){
		output = 1;
		for(var j=0; j<a_comment.length; j++){
			if(a_comment[j] == a_tag[i]){
				output = 0;
			}
		}
		if(output == 1){
			var t5 = document.createTextNode(a_tag[i]+" ");
			x2.appendChild(t5);
		}
	}
	para.appendChild(x2);
}

function getNames(pID){
	var tag_array = [];
	var comment_array = [];
	var tag_finish = 0;
	var comment_finish = 0;

		//console.log('path : '+full);
		FB.api(pID,'GET',{
			"fields":"message_tags"
		},function(response) {
			if (!response || response.error) {
				alert("error:\n"+response.error.message);
			}else{
				for(i in response.data[0].message_tags){
					tag_array.push(response.data[0].message_tags[i].name);
				}
				tag_finish = 1;
				if(tag_finish&&comment_finish){
				//console.log("fb finish");
				compare(tag_array,comment_array);
			}
		}
	});
		FB.api(pID,'GET',{
			"fields":"from"
		},function(response) {
			if (!response || response.error) {
				alert("error:\n"+response.error.message);
			}else{
				for(i in response.data){
					comment_array.push(response.data[i].from.name);
				}
				comment_finish = 1;
				if(tag_finish&&comment_finish){
				//console.log("fb finish");
				compare(tag_array,comment_array);
			}
		}
	});
	}
	function getJson(){
		//var gID = document.getElementById('groupID').value;
		//var pID = document.getElementById('postID').value;
		var url = document.getElementById('urlID').value;
		//console.log("URL ", url);
		var tmp = url.match(/(groups)(.+)/);
		if(tmp == null || tmp.length<3){
			alert("Wrong URL");
			return;
		}
		var str = tmp[2].substring(1,tmp[2].indexOf("/permalink"));
		//console.log(str);
		if(isNaN(str)){
			//console.log(str);
			FB.api('/search','GET',{"q":str,"type":"group","access_token":user_access_token},
				function(response){
					if (!response || response.error) {
						alert("error:\n"+response.error.message);
					}else{
						var result = tmp[2].replace(str,response.data[0].id).replace("/permalink/","_");
						result += "comments";
						//console.log(result);
						getNames(result);
					}
				});
		}else{
			var result = tmp[2].replace("/permalink/","_");
			result += "comments";
			//console.log(result);
			getNames(result);
		}
		
		//console.log(str);

		//console.log(result);

		//var full = "/"+gID+"_"+pID+"/comments";
		
	}
