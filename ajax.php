<?php
//receives a thought ord reply post and returns a JSON representation of it
$date = date("j F Y H:i", mktime());
if($_POST["reply_id"] != "" && $_POST["reply_id"] != "undefined"){
  print(json_encode(array("reply", $_POST["name"], $_POST["thought_text"], $date, $_POST["reply_id"])));
} else  {
  print(json_encode(array("thought", $_POST["name"], $_POST["thought_text"], $date)));
}


