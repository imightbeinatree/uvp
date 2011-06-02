    
    function check_valid_field(field_id, type, default_val){
      var field_val = $(type+"#"+field_id).val();
      if (field_val == "" || field_val == default_val) {
        $("p#"+field_id+"_error").show();
        $(type+"#"+field_id).focus();
        return false;
      }
      return true;
    }
    
    function convert_time(time){
      //TODO: write this function
      //if less than a minute old "Less than a minute ago"
      //if less than an hour old "N minutes ago"
      //if less than a day old "N hours ago"
      //else return input format (eg: 12 May 2010 14:25)
      return time
    }

    function ready_reply_form(thought_id){
      $("#reply_id").val(thought_id);
      $("#reply_message").show();
      return true;
    }

    function cancel_reply_form(){
      $("#reply_id").val("");
      $("#reply_message").hide();
      return false;
    }
    
        
    function load_thought_in_dialog(name, thought_text, time, comments){
      time = convert_time(time);      
      var thought_id = $("#thoughts").children().length;
      var str = '<div class="thought" id="thought_'+thought_id+'"><p><strong>'+name+'</strong> '+thought_text+'</p><p class="thought_meta">'+time+' &bull; <a href="#thought_form" onclick="ready_reply_form('+thought_id+')">Reply</a></p><ul id="replies_'+thought_id+'" class="replies">';
      for(i=0; i<comments.length; i++){
        comment = comments[i];
        comment[2] = convert_time(comment[2]);          
        str = str + '<li id="reply_'+thought_id+'_'+i+'"';
        if(i == 0){ str = str + ' class="latest"'; }
        str = str + '><span class="reply_text"><strong>'+comment[0]+' replied</strong> '+comment[1]+'<span class="reply_time">'+comment[2]+'</span></span></li>';
      }
      str = str + '</ul></div>';
      $(str).prependTo("#thoughts");        
      return true;
    }
    
    function load_reply_in_dialog(name, reply_text, time, thought_id){
      time = convert_time(time);
      var reply_num = $("#replies_"+thought_id).children().length;
      var str = '<li id="reply_'+thought_id+'_'+reply_num+'"';
      if(reply_num == 0){ str = str + ' class="latest"'; }
      str = str + '><span class="reply_text"><strong>'+name+' replied</strong> '+reply_text+'<span class="reply_time">'+time+'</span></span></li>';
      $(str).appendTo("#replies_"+thought_id);
      return true;
    }    
    
    function initialize_data(){
      //felt it decluttered the html to just go ahead and load most of the test data this way since i made these handy little functions to use for the form anyway
      // typically this function would make an ajax call to get current thoughts and display them in a much more programatic fashion
      load_thought_in_dialog("Brenda Jones","Make the logo bigger.","22 December 2009 14:25", []);
      load_thought_in_dialog("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","13 February 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","13 February 2010 13:17"]]); 
      load_thought_in_dialog("Darren Peakock","I hate blue. Can you add more pink?","13 February 2010 11:13",  []);       
      load_thought_in_dialog("Brenda Jones","Make the logo bigger","13 February 2010 14:25",  []);
      load_thought_in_dialog("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","12 May 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","12 May 2010 13:17"]]); 
      load_thought_in_dialog("Darren Peakock","I hate blue. Can you add more pink?","12 May 2010 11:13", []);       
      load_thought_in_dialog("Brenda Jones","Make the logo bigger","12 May 2010 14:25",  []);
      load_thought_in_dialog("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","11 July 2010 01:13", [["John Spitzer","I think you're in the wrong forum.","11 July 2010 13:17"],["Brenda Jones","Fo' real.","11 July 2010 14:23"]]); 
      load_thought_in_dialog("Darren Peakock","I hate blue. Can you add more pink?","11 July 2010 11:13",  []);       
      load_thought_in_dialog("Brenda Jones","Make the logo bigger","11 July 2010 14:25",[]);
      load_thought_in_dialog("Julie Zinger","I cant find out how 2 get 2 check my email. My password is 'password', but theirs no place to put it. Can you help me.","8 hours ago", [["John Spitzer","I think you're in the wrong forum.","4 hours ago"]]); 
      load_thought_in_dialog("Darren Peakock","I hate blue. Can you add more pink?","2 hours ago", []);       
      load_thought_in_dialog("Brenda Jones","Make the logo bigger","6 minutes ago", []);      
      return true;
    }
    
    $(document).ready(function(){
       //load data and show main dialog
       initialize_data();
       var windowH = $(window).height()/2-240;
       var windowW = $(window).width()/2-320;
       $("#thought_box").css('top', windowH > 0 ? windowH : 0);
       $("#thought_box").css('left', windowW > 0 ? windowW : 0);
       $("#thought_box").show();
       
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
       
       //TODO: add handler to alter form for reply instead of new thought (also add fields to form to track this and section to ajax handler)
       
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
             //append new thought to existing display
             data = jQuery.parseJSON(data);
             $("#name").val("Your name");    
             $("#thought_text").val("Enter your thought here...");
             if(data[0] == "thought"){
               load_thought_in_dialog(data[1],data[2],"Less than a minute ago",[]);
             } else {
               $("#reply_id").val("");
               $("#reply_message").hide();
               load_reply_in_dialog(data[1],data[2],"Less than a minute ago",data[3]);
             }
           }
         });
         return false;           
       });            
       
       $("#thought_close").click(function(event){
            alert("Yes, clicking this should close the dialog, but then how would you reopen it? Implement Closing Logic Here");
       });         
     });
