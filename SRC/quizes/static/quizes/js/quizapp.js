var count = 0;
var time = 30;
var marks = 0;
var answer = [];
var timer;

$(document).ready(function(){
    $('#finish').hide();
    $('#Result').hide();
    
    buttons_manager();

// Create Function
    function buttons_manager(){
        if(count > 0){
            $('#prev').show();
            if(count = 4){
                $('#next').hide();
                $('finish').show();
            }
            else{
                $('#next').show();
            }
        }
        else{
            $('#prev').hide()
        }
    }
    // Create Question Function
    function adding_Question(data,pk){
        $('question').text(data[pk.Quiz])
    }
})