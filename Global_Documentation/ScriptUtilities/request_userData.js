var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
var theUrl = "http://flip3.engr.oregonstate.edu:[API PORT]/API";
xmlhttp.open("POST", theUrl);
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send(JSON.stringify({
    "username": "test_user00",
    "token": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
    "operation_name": "ADD_SESSION",
    "task_data": {
        "user_id" : "1",
        "token ": "d7727ef8f9b18177f91fec2dd57afafaa21a041de61391e684f20d45b70cb947",
        "exp_date" : "10-10-2020",
        "user_req_date" :"10-10-2020",
        "created_at" : "10-10-2020"
    }
}))

// 4. This will be called after the response is received
xmlhttp.onload = function() {
    if (xmlhttp.status != 200) { // analyze HTTP status of the response
      alert(`Error ${xmlhttp.status}: ${xmlhttp.statusText}`); // e.g. 404: Not Found
    } else { // show the result
      alert(`Done, got ${xmlhttp.response.length} bytes`); // response is the server response
    }
  };