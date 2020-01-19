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
    if (typeof express_user != "undefined") 
    {
        var button = document.getElementById("connectDiscord");
        var buttonParent = button.parentNode;
        var newElem = document.createElement("h1")
        newElem.innerHTML = `Bienvenue <img class='discordAvatar' style='width: 1.5em;' src=https://cdn.discordapp.com/avatars/${express_user.id}/${express_user.avatar}> ${express_user.username}`
        buttonParent.appendChild(newElem)
        
        var testElem = document.createElement("h1")
        axios.get("/discord/usersMe").then((res)=>{
            testElem.innerHTML = `Test : ${JSON.stringify(res.data)}`
            buttonParent.appendChild(testElem)
        })
        
        buttonParent.removeChild(button)
    }
    
    window.addEventListener("scroll", function(){
        var scrollTop = window.scrollY;
        var backTitle=document.getElementsByClassName("backTitle");
        var mpicon=document.getElementById("mpicon");
        var tableMenu = document.getElementById("menu");
        var maxHeight = backTitle[0].offsetHeight;
        if (scrollTop>maxHeight) {
            mpicon.classList.add("mpicon-topscreen");
            if (!tableMenu.classList.contains("topscreen"))
                tableMenu.classList.add("topscreen")
        } else {
            mpicon.classList.remove("mpicon-topscreen");
            if (tableMenu.classList.contains("topscreen"))
                tableMenu.classList.remove("topscreen")
        }
    })
}, false);
