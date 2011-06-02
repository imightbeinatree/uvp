<?php
//receives a thought ord reply post and returns a JSON representation of it
$date = date("j F Y H:i", mktime());
$thought_text = str_replace("\n","<br />",$_POST["thought_text"]);
if($_POST["reply_id"] != "" && $_POST["reply_id"] != "undefined"){
  print(json_encode(array("reply", $_POST["name"], $thought_text, $date, $_POST["reply_id"])));
} else  {
  print(json_encode(array("thought", $_POST["name"], $thought_text, $date)));
}


