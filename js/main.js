// reporting immediately 
function myPrecious(data, id){
    return data.filter(x => x.Parent == id).length;
}

// all reporting
function everyonesPrecious(data, id, count = 0){
    if(id.length == 0){
        return count;
    } else {
        children =  data.filter(x => x.Parent == id[0]).map(x => x.Id);
        id.splice(0, 1);
        id = [...id, ...children];
        count += children.length;
        return everyonesPrecious(data, id, count);
    }
}

// generates card
function cardTemplate(data, all) {

    if(data.Id == localStorage.getItem("marker")){
        let activeClass = 'activeTeam'
    }
    let activeClass = (data.Id == localStorage.getItem("marker") || data.Parent == localStorage.getItem("marker")) ? 'activeTeam' : '';
    return `
    <li class="card" data-id="${data.Id}">
        <div class="team ${activeClass}">
            ${data.Id}
        </div>
        <div class="name">
            <span>
                ${data.Name}
            </span>
            <br>
            <span>
                ${data.title}
            </span>
            <div class="members">
                <span>
                    ${myPrecious(all, data.Id)}
                </span>
                <span>
                    ${everyonesPrecious(all, [data.Id])}
                </span>
                <span>
                    +
                </span>
            </div>
        </div>
    </li>
    `;
}

// generates tree onclick
function respawn(data, marker) {
    flag = 0;
    current = data.find(x => x.Id == marker);
    tempMarker = current.Id;
    result = data.filter(x => {
        if(x.depth < current.depth && flag == 0){
            return true;
        } else if(x.depth == current.depth && x.Parent == current.Parent) {
            return true;
        }
        else if((x.Parent == tempMarker || x.Parent == marker) && x.depth - current.depth == 1) {
            flag = 1;
            tempMarker = x.Id;
            return true;
        } else {
            return false;
        }
    });
    printLevels(result, data);
    return result;
}

// print the entire generated tree
function printLevels(data, all) {
    temp = data[0].depth;
    html = data.map(x => {
        if(x.depth == temp){
            return cardTemplate(x, all);
        } else {
            temp++;
            return '<br>'+cardTemplate(x, all);
        }
    }).join('');
    root.innerHTML = html;
}

// handles click on card
function handleClick(e, result) {
    let li = e.target.closest('li');    
    
    if (!li) return;
    if (!root.contains(li)) return;
    init(li.dataset.id);
}

const root = document.querySelector('#root');
root.addEventListener('click', handleClick);

// initializing the tree
function init(marker = 0){

data = [
    {"Id": 1,"Name": "I am the 1","team": "Company","title": "","Parent": "","root": "true", "depth": 0},
    {"Id": 2,"Name": "child of 1","team": "Rentomojo","title": "CEO","Parent": 1, "depth": 1},
    {"Id": 3,"Name": "child of 2","team": "Core Management","title": "CXO","Parent": 2, "depth": 2},
    {"Id": 4,"Name": "child of 2","team": "Core Management","title": "CFO","Parent": 2, "depth": 2},
    {"Id": 5,"Name": "child of 2","team": "Core Management","title": "EA","Parent": 2, "depth": 2},
    {"Id": 6,"Name": "child of 2","team": "KYC","title": "EA","Parent": 2, "depth": 2},
    {"Id": 7,"Name": "child of 3","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 3, "depth": 3},
    {"Id": 8,"Name": "child of 4","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 4, "depth": 3},
    {"Id": 9,"Name": "child of 5","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 5, "depth": 3},
    {"Id": 10,"Name": "child of 5","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 5, "depth": 3},
    {"Id": 11,"Name": "child of 6","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 6, "depth": 3},
    {"Id": 12,"Name": "child of 8","team": "Finance & Accounts","title": "Head-Accounts & Payments","Parent": 8, "depth": 4}
];

// imitating get request

    // fetch('../data.json')
    // .then(response => response.json())
    // .then(data => data.data)
    // .then(data => {
        if(marker == localStorage.getItem("marker")){
            marker = data.find(x => x.Id == marker);
            if(marker.Parent != ""){
                localStorage.setItem("marker", marker.Parent);
                return respawn(data, marker.Parent);
            }
            return respawn(data, 1);
        } else {
            localStorage.setItem("marker", marker);
            return respawn(data, marker);
        }
    // });
}

let marker = localStorage.getItem("marker") || 1;
init(1);
