document.addEventListener('DOMContentLoaded', function(){ 
    window.addEventListener("scroll", function(){
        var scrollTop = window.scrollY;
        var backTitle=document.getElementsByClassName("backTitle");
        var mpicon=document.getElementById("mpicon");
        var maxHeight = backTitle[0].offsetHeight;
        if (scrollTop>maxHeight) {
            mpicon.style.position="fixed";
        } else {
            mpicon.style.position="static";
        }
    })
}, false);
