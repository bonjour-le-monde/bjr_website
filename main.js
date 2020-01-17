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
    if (window.location.pathname=="/onconnexion")
    {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get("code");
        var promax = axios.post("/connexion", {
            code: code
        });
        promax.then(data=>{
            var button = document.getElementById("connectDiscord")
            var newElem = document.createElement("h2")
            newElem.innerHTML = "Connecté à discord"
            button.after(newElem)
            button.remove()

        })
        .catch(err=>{
            console.log("error on connection : "+err)
        });

    }
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
