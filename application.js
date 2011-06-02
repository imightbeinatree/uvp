//sets position of thought box based on screen size
function place_dialog(){
  var windowH = $(window).height()/2-240;
  var windowW = $(window).width()/2-320;
  $("#thought_box").css('top', windowH > 0 ? windowH : 0);
  $("#thought_box").css('left', windowW > 0 ? windowW : 0);
  return true;
}

//takes a field id, field type, and default value
//verifies that the field is filled in and does not have the default value
function check_valid_field(field_id, type, default_val){
  var field_val = $(type+"#"+field_id).val();
  if (field_val == "" || field_val == default_val) {
    $("p#"+field_id+"_error").show();
    $(type+"#"+field_id).focus();
    return false;
  }
  return true;
}

//changes thought form to a reply form
function ready_reply_form(thought_id){
  $("#reply_id").val(thought_id);
  $("#reply_message").show();
  return true;
}

//changes reply form back to thought form
function cancel_reply_form(){
  $("#reply_id").val("");
  $("#reply_message").hide();
  return false;
}

//loads a new thought into the dialog box
function load_thought(name, thought_text, time, comments){
  var thought_id = $("#thoughts").children().length;
  var str = '<div class="thought" id="thought_'+thought_id+'"><p><strong>'+name+'</strong> '+thought_text+'</p>'+
            '<p class="thought_meta"><span class="thought_time timeago" title="'+time+'">'+time+'</span> &bull; '+
            '<a href="#thought_form" onclick="ready_reply_form('+thought_id+')">Reply</a></p>'+
            '<ul id="replies_'+thought_id+'" class="replies">';
  for(i=0; i<comments.length; i++){
    comment = comments[i];
    str = str + '<li id="reply_'+thought_id+'_'+i+'"';
    if(i == 0){ str = str + ' class="latest"'; }
    str = str + '><span class="reply_text"><strong>'+comment[0]+' replied</strong> '+comment[1]+
                '<span class="reply_time timeago" title="'+time+'">'+comment[2]+'</span></span></li>';
  }
  str = str + '</ul></div>';
  $(str).prependTo("#thoughts");        
  return true;
}

//loads a new reply into the dialog box
function load_reply(name, reply_text, time, thought_id){
  var reply_num = $("#replies_"+thought_id).children().length;
  var str = '<li id="reply_'+thought_id+'_'+reply_num+'"';
  if(reply_num == 0){ str = str + ' class="latest"'; }
  str = str + '><span class="reply_text"><strong>'+name+' replied</strong> '+reply_text+
              '<span class="reply_time timeago" title="'+time+'">'+time+'</span></span></li>';
  $(str).appendTo("#replies_"+thought_id);
  return true;
}    

function initialize_data(){
  // felt it decluttered the html to just go ahead and load most of the test data this way 
  // since i had made these handy little functions to use for the form anyway
  // typically this function would make an ajax call to get current thoughts and display them in a much more programatic fashion
  load_thought("Brenda Jones","Make the logo bigger.","22 December 2009 14:25", []);
  load_thought("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","13 February 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","13 February 2010 13:17"]]); 
  load_thought("Darren Peakock","I hate blue. Can you add more pink?","13 February 2010 11:13",  []);       
  load_thought("Brenda Jones","Make the logo bigger","13 February 2010 14:25",  []);
  load_thought("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","12 May 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","12 May 2010 13:17"]]); 
  load_thought("Darren Peakock","I hate blue. Can you add more pink?","12 May 2010 11:13", []);       
  load_thought("Brenda Jones","Make the logo bigger","12 May 2010 14:25",  []);
  load_thought("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","11 July 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","11 July 2010 13:17"],["Brenda Jones","Fo' real.","11 July 2010 14:23"]]); 
  load_thought("Darren Peakock","I hate blue. Can you add more pink?","11 July 2010 11:13",  []);       
  load_thought("Brenda Jones","Make the logo bigger","11 July 2010 14:25",[]);
  load_thought("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","1 June 2011 13:22", [["John Spitzer","I think you're in the wrong forum.","1 June 2011 18:22"]]); 
  load_thought("Darren Peakock","I hate blue. Can you add more pink?","1 June 2011 22:22", []);       
  load_thought("Brenda Jones","Make the logo bigger","1 June 2011 23:22", []);      
  return true;
}



$(document).ready(function(){

  //load data
  initialize_data();

  //set up timeago, and show main dialog
  jQuery("span.timeago").timeago();
  place_dialog();
  $("#thought_box").show();

  //set handler to move position when window is resized
  $(window).resize(place_dialog);
 
  //handle showing/hiding of default text for form inputs
  $("#name").focus(function() {
   if($("#name").val() == "Your name"){ $("#name").val(""); }
  });
  $("#name").blur(function() {
   if($("#name").val() == ""){ $("#name").val("Your name"); }
  });
  $("#thought_text").focus(function() {
   if($("#thought_text").val() == "Enter your thought here..."){ $("#thought_text").val(""); }
  });
  $("#thought_text").blur(function() {
   if($("#thought_text").val() == ""){ $("#thought_text").val("Enter your thought here..."); }
  });

  //handle thought form submission via ajax
  $("#submit").click(function() {
   //hide any previously shown error messages and validate current form
   $(".error").hide();
   if(!check_valid_field("thought_text","textarea","Enter your thought here...")){ return false; }
   if(!check_valid_field("name","input","Your name")){ return false; }
   //submit form data to ajax endpoint
   var data_string = 'name='+ $("#name").val() + '&thought_text=' + $("#thought_text").val()+'&reply_id='+$("#reply_id").val();
   $.ajax({  
     type: "POST",  
     url: "ajax.php",  
     data: data_string,  
     success: function(data) {
       //append new thought or reply to existing display and reset form
       data = jQuery.parseJSON(data);
       $("#name").val("Your name");    
       $("#thought_text").val("Enter your thought here...");
       if(data[0] == "thought"){
         load_thought(data[1],data[2],data[3],[]);
       } else {
         $("#reply_id").val("");
         $("#reply_message").hide();
         load_reply(data[1],data[2],data[3],data[4]);
       }
       jQuery("span.timeago").timeago();  //be sure dates are set properly for new comments
     }
   });
   return false;           
  });            

  //throwing in a smary message on the close button
  $("#thought_close").click(function(event){
    alert("Yes, clicking this should close the dialog, but then how would you reopen it? Implement Closing Logic Here");
  });         
});

