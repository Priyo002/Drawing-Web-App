
         
document.getElementById('Ckey').addEventListener('click',async ()=>{
    const resp = await fetch("http://localhost:3000/createKey",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const temp = await resp.json();
    const str = String(temp.key);
    console.log(temp.key);
    window.open("http://localhost:3000/" + str);
})
document.getElementById('btt').addEventListener('click',()=>{
    const t = document.getElementById('txtt').value;
    console.log(t);
})