var tipi = ["total_cases", "active_cases", "deaths", "recovered"];
var trad = ["Casi totali:", "Attualmente positivi:", "Morti:", "Guariti:"]

function fetchData(url) {
    return fetch(url)
      .then(function(response) {
        if(response.ok) {
          return response.json();
        }
      })
      .then(function(payload) {
        return payload['data'] || {};
      });
  }

function onJson(json){
    const s = document.querySelector(".totali");
    const r = document.querySelector(".cambio");
    if(s.childNodes){
        while(s.firstChild){
            s.removeChild(s.firstChild);
        }
        while(r.firstChild){
            r.removeChild(r.firstChild);
        }
    }
    if(s.classList.contains("hidden")){
      s.classList.remove("hidden");
      r.classList.remove("hidden");
    }
    const t = document.createTextNode("Dati Complessivi");
    const e = document.createTextNode("Variazione giornaliera");
    const d = document.createElement("h3");
    const n = document.createElement("h3");
    d.appendChild(t);
    n.appendChild(e);
    s.appendChild(d);
    r.appendChild(n);
    const data = document.createElement("div");
    const data2 = document.createElement("div");
    data.classList.add("dati");
    data2.classList.add("dati");
    s.appendChild(data);
    r.appendChild(data2);

    const lis = document.querySelectorAll(".dati");
    for(let i=0; i<lis.length; i++){
      const tot = document.createElement("div");
      tot.classList.add("tot");
      const cl = document.createElement("div");
      cl.classList.add("cl");
      lis[i].appendChild(cl);
      lis[i].appendChild(tot);
    }
    for(let i =0; i<tipi.length; i++){
      const text = document.createTextNode(trad[i] + " " + parseInt(json['summary'][tipi[i]]).toLocaleString());
      const el = document.createElement("a");
      el.classList.add(tipi[i]);

      el.appendChild(text);
      if(i===0){
        const f = document.querySelectorAll(".tot");
        f[0].appendChild(el);
      }else{
        const f = document.querySelectorAll(".cl");
        f[0].appendChild(el);
      }
    }

    for(let i =0; i<tipi.length; i++){
      const text = document.createTextNode(trad[i] + " " + parseInt(json['change'][tipi[i]]).toLocaleString());
      const el = document.createElement("a");
      el.classList.add(tipi[i]);

      el.appendChild(text);
      if(i===0){
        const f = document.querySelectorAll(".tot");
        f[1].appendChild(el);
      }else{
        const f = document.querySelectorAll(".cl");
        f[1].appendChild(el);
      }
    }
}

function search(event){
    event.preventDefault();
    const country = document.querySelector("#paese");
    const cvalue = encodeURIComponent(country.value);
    rest_url = 'https://api.quarantine.country/api/v1/summary/region?region=' + cvalue;
    fetchData(rest_url).then(onJson);
}

function Oninfo(json){
  const giornali = document.querySelector('#giornali');
  for(let i=1; i<4; i++){
    const block = document.createElement("div");
    block.classList.add("giorn");
    const tit = document.createElement("h2");
    const tito = document.createTextNode(json[i]["title"]);
    tit.appendChild(tito);
    block.appendChild(tit);
    if(json[i]["image"]){
      const pic = document.createElement("img");
      pic.src = json[i]["image"];
      block.appendChild(pic);
    }
    const link = document.createElement("a");
    link.classList.add("buttom");
    link.href = json[i]["url"];
    const tex = document.createTextNode("Apri articolo");
    link.appendChild(tex);
    block.appendChild(link);
    giornali.appendChild(block);
  }
}


const form = document.querySelector('form');
form.addEventListener('submit', search);
rest_url = 'http://api.mediastack.com/v1/news?access_key=e061e486d826b15e25d337d0f4d2506e&keywords=covid&languages=it&sources=ilfattoquotidiano';
fetchData(rest_url).then(Oninfo);
