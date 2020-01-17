discord={
    getAvatarLink: ()=>{
        if (!discord.me)
            return "";
        return `https://cdn.discordapp.com/avatars/${discord.me.id}/${discord.me.avatar}`;
    },
    retrieveUserMe: function(){
        return this.get("/users/@me").then(data=>{
            this.me=data.data;
        }).catch(err=>{
            console.log("error getMeUser : ")
            console.log(err)
            console.log(err)

        });
    },
    get: url=>{
        return axios.get(discord.apiEndpoint+url,{
            headers: {
                "Authorization": `Bearer ${discord.tokens.access_token}`,
                "Content-Type": "application/x-www-form-urlencoded" 
            }
        })
    },
    me:null,
    tokens:null,
    apiEndpoint: "https://discordapp.com/api"
}

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
            console.log("connexion ok")
            var test=0;
            discord.tokens = data.data;
            discord.retrieveUserMe().then(data=>{
                var button = document.getElementById("connectDiscord")
                var newElem = document.createElement("h2")
                newElem.innerHTML = `Connecté à discord - Bienvenue <img class='discordAvatar' style='width: 2em;' src=${discord.getAvatarLink()}> ${discord.me.username}`
                button.after(newElem)
                button.remove()
            })

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
