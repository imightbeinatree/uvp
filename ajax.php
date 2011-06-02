<?php
if($_POST["reply_id"] != "" && $_POST["reply_id"] != "undefined"){
  print(json_encode(array( "reply", $_POST["name"], $_POST["thought_text"], $_POST["reply_id"]  )));
} else  {
  print(json_encode(array( "thought", $_POST["name"], $_POST["thought_text"] )));
}


