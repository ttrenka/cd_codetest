'use strict';

let table = document.querySelector("#the-people");

//  helper functions to render the table correctly
const columnOrder = ["name","height","dob","interests","hobby"];
const dataFormatters = {
    "name": (d) => { return d; },
    "height": (d) => { return (Math.floor(d/12)) + "'" + (d % 12) + '"'; },
    "dob": (d) => { return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear(); },
    "interests": (d) => { return d.join(", "); },
    "hobby": (d) => { return d; }
};
const dataParsers = {
    "name": (d) => { return d; },
    "height": (d) =>{
        let tmp = d.split("'");
        return (parseInt(tmp[0], 10) * 12) + parseInt(tmp[1], 10);
    },
    "dob": (d) => { return new Date(d); },
    "interests": (d) => { return d },
    "hobby": (d) => { return d; }
};

//  render cell
const renderCell = (field, value) => {
    let trueValue = dataParsers[field](value);
    let trueFormat = dataFormatters[field](trueValue);
    let td = document.createElement("td");
    td.setAttribute("data-value", trueValue);
    td.classList.add("field-" + field);
    td.innerHTML = trueFormat;
    return td;
};

//  0 = reset, 1 = asc, 2 = desc
const render = (data, field, dir) => {
    if(dir && dir == 0){
        //  this is a reset
        field = "name";
        dir = 1;    //  aec
    }
    const tbody = table.querySelector("tbody");

    //  pull the existing data
    while(tbody.childNodes.length) tbody.removeChild(tbody.childNodes[0]);

    //  sort our data
    let sorted = data.slice();    //tmp

    //  rebuild the table body
    for(let j = 0; j < sorted.length; j++){
        const source = sorted[j];
        let tr = document.createElement("tr");
        tr.setAttribute("data-id", j);
    
        for(let field in source){
            tr.appendChild(renderCell(field, source[field]));
        }
        tbody.appendChild(tr);
    }
}

//  do our setup
render(data, "name", 1);
