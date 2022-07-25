'use strict';

let table = document.querySelector("#the-people");

//  helper functions to render the table correctly
const columnOrder = ["name","height","dob","interests","hobby"];
const dataFormatters = {
    "name": (d) => { return d; },
    "height": (d) => { return (Math.floor(d/12)) + "'" + (d % 12) + '"'; },
    "dob": (d) => { 
        d = new Date(d);
        return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear(); 
    },
    "interests": (d) => { return d.join(", "); },
    "hobby": (d) => { return d; }
};
const dataParsers = {
    "name": (d) => { 
        let tmp = d.split(" ");
        return tmp[1] + ", " + tmp[0];
    },
    "height": (d) =>{
        let tmp = d.split("'");
        return Number(parseInt(tmp[0], 10) * 12) + parseInt(tmp[1], 10);
    },
    "dob": (d) => { return new Date(d).valueOf(); },
    "interests": (d) => { return d },
    "hobby": (d) => { return d; }
};

//  render cell
const renderCell = (field, value, dir) => {
    let trueValue = dataParsers[field](value);
    let trueFormat = dataFormatters[field](trueValue);
    let td = document.createElement("td");
    td.setAttribute("data-value", trueValue);
    if(dir > 0){
        td.setAttribute("data-sort", dir);
    }
    td.classList.add("field-" + field);
    td.innerHTML = trueFormat;
    return td;
};

//  0 = reset, 1 = asc, 2 = desc
const render = (data, field, dir) => {
    if(!dir || dir == 0){
        //  this is a reset
        field = "name";
        dir = 1;    //  aec
    }

    const tbody = table.querySelector("tbody");

    //  pull the existing data
    while(tbody.childNodes.length) tbody.removeChild(tbody.childNodes[0]);

    //  sort our data
    let sorted = data.slice();
    sorted.sort((a, b) => {
        const aValue = dataParsers[field](a[field]);
        const bValue = dataParsers[field](b[field]);
        return aValue > bValue;
    });
    if(dir == 2){
        sorted = sorted.reverse();
    }

    //  rebuild the table body
    for(let j = 0; j < sorted.length; j++){
        const source = sorted[j];
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", j);
    
        for(let field in source){
            tr.appendChild(renderCell(field, source[field]), dir);
        }
        tbody.appendChild(tr);
    }
}

//  do our setup
const thead = table.querySelector("thead tr");
thead.addEventListener("click", (e)=>{
    const t = e.target;
    const field = t.getAttribute("data-field");
    let sorted = t.getAttribute("data-sort"),
        dir = 1;
    if(sorted){
        //  if the value is 2 (desc), pull the attribute and set our render to pass 0
        if(sorted == "2"){
            dir = 0;
            t.removeAttribute("data-sort");
        } else {
            dir = 2;
            t.setAttribute("data-sort", "2");
        }
    } else {
        //  doesn't have the attribute, add it
        t.parentNode.querySelectorAll("th").forEach((item)=>{ item.removeAttribute("data-sort"); });
        t.setAttribute("data-sort", "1");
    }
    //  send it off to render
    render(data, field, dir);
});

//  finally, the initial render.
thead.querySelector('th[data-field="name"]').setAttribute("data-sort", "1");
render(data, "name", 1);
