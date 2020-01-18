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
    if (express_user) 
    {
        var button = document.getElementById("connectDiscord")
        var newElem = document.createElement("h1")
        newElem.innerHTML = `Bienvenue <img class='discordAvatar' style='width: 1.5em;' src=https://cdn.discordapp.com/avatars/${express_user.id}/${express_user.avatar}> ${express_user.username}`
        button.parentNode.appendChild(newElem)
        button.parentNode.removeChild(button)
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
