function resetContent()
{
    var ctpages = document.getElementsByClassName("content-page")
    Array.from(ctpages).forEach(ctpage => {
        ctpage.classList.add('hidden')
    });
}
function displayContent(which)
{
    resetContent()
    var ctpage=document.getElementById(which);
    ctpage.classList.remove("hidden")
}
document.addEventListener('DOMContentLoaded', function(){ 
    window.addEventListener("scroll", function(){
        var scrollTop = window.scrollY;
        var backTitle=document.getElementsByClassName("backTitle");
        var mpicon=document.getElementById("mpicon");
        var tableMenu = document.getElementById("menu");
        var maxHeight = backTitle[0].offsetHeight;
        if (scrollTop>maxHeight) {
            mpicon.style.position="fixed";
            if (!tableMenu.classList.contains("topscreen"))
                tableMenu.classList.add("topscreen")
        } else {
            mpicon.style.position="static";
            if (tableMenu.classList.contains("topscreen"))
                tableMenu.classList.remove("topscreen")
        }
    })
}, false);
