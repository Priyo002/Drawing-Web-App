const localurl="http://localhost:3000"
const awsurl="https://www.drawhub.online"
         
document.getElementById('Ckey').addEventListener('click',async ()=>{
    const resp = await fetch(awsurl+"/createKey",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const temp = await resp.json();
    const str = String(temp.key);
    //console.log(temp.key);
    window.open(awsurl + "/" + str);
})

document.getElementById('btt').addEventListener('click',()=>{
    const t = document.getElementById('txtt').value;
    window.open(awsurl + "/" + t);
})