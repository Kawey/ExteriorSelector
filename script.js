//Current satate obj
const userSelect = {}
fetch('asset.json')
  .then(response => response.json())
  .then(data => {
    const imgBox = document.getElementById('image-container')
    // Access the data and create list items for each item in the array
    const importTabs = data.Tabs;

    loadImages(data) //load img tags
    loadTabMenu(data)//load tab link buttons
    loadTabContent(data)
    loadSummary(data)
    activateDefaultColors(data)
    document.getElementById("defaultOpen").click();
  })
  .catch(error => console.error(error));


function activateDefaultColors(mainObj) {
  const importTabs = mainObj.Tabs;

  for (let i = 0; i < importTabs.length; i++) {
    const tab = importTabs[i].toLowerCase();
    const activElm = document.getElementById(`${tab}-color0`)
    activeColor(`${tab}-color`, activElm)
  }
}

function loadSummary(mainObj) {
  const importTabs = mainObj.Tabs;
  const defaulObj = mainObj.Default;
  const summaryDiv = document.getElementById('element-to-print')
  
  for (let i = 0; i < importTabs.length; i++) {
    let tabItems = ""
    tabItems = `<div class="pdf-option-box">
      <p>${importTabs[i]}</p>
      <p id="option-${importTabs[i].toLowerCase()}">${defaulObj[importTabs[i]].name}</p>
      <div id="${importTabs[i].toLowerCase()}-color" class="color" 
      style="background: ${defaulObj[importTabs[i]].color}";></div>
    </div>`; 
    summaryDiv.innerHTML += tabItems
  }
  
}

function colorClick(evt, itemName) {
  //console.log(evt.target.parentElement.id.toLowerCase());
  const img = document.getElementById(`img${itemName}`)
  img.src = `images/${evt.target.dataset.file}`;
  document.getElementById(`option-${itemName.toLowerCase()}`).innerText = evt.target.dataset.itemName;
  document.getElementById(`${itemName.toLowerCase()}-color`).style.background = evt.target.dataset.color;
  //console.log(evt.target.parentElement.id.toLowerCase(), evt.target);
  activeColor(`${evt.target.parentElement.id.toLowerCase()}-color`, evt.target) 
}

function loadTabContent(imgObj) {
  const importTabs = imgObj.Tabs;
  const allTabsDiv = document.getElementById('allTabsDiv')

  for (let i = 0; i < importTabs.length; i++) {
    let tabItems = '';
    const tab = importTabs[i];
    const div = document.createElement("div")
    div.id = tab
    //console.log(tab, imgObj.Default[tab]);
    //console.log("foo" ,iterateColorObject(imgObj.Default[tab],"src"));
    if (i == 0) { //default tab?
      
      div.className = "tabcontent active" //static for def?
      div.style.display = "flex"
      
    } else { //not default tab?
      div.classList.add("tabcontent")
      // tabItems += `<button class="tablinks" 
      // onclick="openTab(event, '${tab}')">${tab}</button>`
    }
    //add default color item
    //console.log("imgObj[tab]", imgObj.Default[tab]);
    const { name, color, src } = imgObj.Default[tab]
    //console.log(name,color,src);
    tabItems += `<div id="${tab.toLowerCase()}-color0" class="color ${tab.toLowerCase()}-color" 
    data-file="${src}" data-item-name="${name}"
        data-color="${color}" style="background: ${color};"
    onclick="colorClick(event, '${tab}')"></div>`

    for (const key in imgObj[tab]) {
      if (Object.hasOwnProperty.call(imgObj[tab], key)) {
        const element = imgObj[tab][key];
        //console.log(element)
        const { name, color, src } = element
        //console.log(name, color, src);
        tabItems += `<div class="color ${tab.toLowerCase() }-color" 
    data-file="${src}" data-item-name="${name}"
        data-color="${color}" style="background: ${color};"
    onclick="colorClick(event, '${tab}')"></div>`
      }
    }
    div.innerHTML += tabItems
    allTabsDiv.appendChild(div)
  }
  
}

function addTabItem2DOM(obj, tab, div) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        //console.log("test", obj[property].name);
        //console.log("test", obj[property].src);

        div.innerHTML += `<div class="color ${tab}-color" 
    onclick="openTab(event, '${tab.toLowerCase()}0')"></div>`
        //console.log(`<img src="images\\${obj[property].src}" alt="" style="display: none;"></img>`);
        addImg2DOM(obj[property], tab); // recursive call
      } else {
        //console.log(`${property}: ${obj[property]}`);
      }
    }
  }
}

function loadTabMenu(imgObj) {
  const importTabs = imgObj.Tabs;
  const tabBox = document.getElementById('tab')

  let tabItems = '';
  for (let i = 0; i < importTabs.length; i++) {
    const tab = importTabs[i];
    //console.log(tab, imgObj.Default[tab]);
    //console.log("foo" ,iterateColorObject(imgObj.Default[tab],"src"));
    if (i==0) {
      tabItems += `<button id="defaultOpen" class="tablinks" 
      onclick="openTab(event, '${tab}')">${tab}</button>`
    } else {
      tabItems += `<button class="tablinks" 
      onclick="openTab(event, '${tab}')">${tab}</button>`
    }
  }
  tabBox.innerHTML += tabItems
}

function loadImages(imgObj) {
  const importTabs = imgObj.Tabs;
  //const importDefaultObj = imgObj.Default;
  const imgBox = document.getElementById('image-container')
  imgBox.innerHTML += `<img class="imgBG" src="images\\${imgObj.BG}" alt=""></img>`
  //Default options loop imgObj.Default
  let imgItems = '';
  for (let i = 0; i < importTabs.length; i++) {
    const tab = importTabs[i];
    const imgsrc = getDefaultImg(imgObj.Default[tab], "src")
    //console.log(tab, imgObj.Default[tab]);
    //console.log("foo" ,iterateColorObject(imgObj.Default[tab],"src"));
    imgItems += `<img id="img${tab}" src="images\\${imgsrc}" alt=""></img>`
    addImg2DOM(imgObj[tab], tab)
  }
  imgBox.innerHTML += imgItems
  for (let i = 0; i < importTabs.length; i++) {
    const tab = importTabs[i];
  }
}

function getDefaultImg(obj, target) {
  //console.log("fuunc");
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        return getDefaultImg(obj[property], target); // recursive call
      } else {
        //console.log(`this ${property}: ${target}`);
        //console.log(target === property);
        if (target === property) {
          //console.log("return", obj[property] );
          return obj[property]
        }
        //console.log(`this${property}: ${obj[property]}`);
      }
    }
  }
}

function addImg2DOM(obj, tab) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        //console.log("test", obj[property].name);
        //console.log("test", obj[property].src);
        const imgBox = document.getElementById('image-container')
        imgBox.innerHTML += `<img src="images\\${obj[property].src}" alt="" style="display: none;"></img>`
        //console.log(`<img src="images\\${obj[property].src}" alt="" style="display: none;"></img>`);
        addImg2DOM(obj[property], tab); // recursive call
      } else {
        //console.log(`${property}: ${obj[property]}`);
      }
    }
  }
}

function iterateObject(obj) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        iterateObject(obj[property]); // recursive call
      } else {
        console.log(`${property}: ${obj[property]}`);
      }
    }
  }
}

function downloadPDF() {
  const btnPDF = document.getElementById('btnPDFF');
  btnPDF.style.display = "none";

  const element2print = document.createElement("div");
  const imgContainer = document.getElementById('image-container');
  const copyImg = imgContainer.cloneNode(true);

  const element = document.getElementById('element-to-print');
  const copyElement = element.cloneNode(true);

  const pageBreak = document.createElement("div");
  pageBreak.classList.add('html2pdf__page-break')
  element2print.appendChild(copyImg);
  element2print.appendChild(pageBreak);
  element2print.appendChild(copyElement);

  var opt = {
    margin: 5,
    filename: 'hosue.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 5 },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
  };

  // New Promise-based usage:
  html2pdf().set(opt).from(element2print).save();
  btnPDF.style.display = "block";
}

window.onload = function () {
  // Code that relies on the page being fully loaded goes here
  
  // Do something with the element
  const btnPDF = document.getElementById('btnPDFF'); //button to download pdf
  console.log(btnPDF);
  const btnJson = document.getElementById("btnJSON");

  btnPDF.addEventListener("click", () => {
    console.log("Click");
    
  })

  btnJson.addEventListener("click", () => {
    console.log("click");
    fetch('asset.json')
      .then(response => response.json())
      .then(data => {
        iterateObject(data);
      })
      .catch(error => console.error(error));

    // Create a new HTML document
    const doc = document.implementation.createHTMLDocument();

    // Create a new HTML element
    const div = doc.createElement('div');
    div.textContent = 'Hello, world!';

    // Add the new element to the document's body
    doc.body.appendChild(div);

    // Output the resulting HTML program
    console.log(doc.documentElement.outerHTML);
  })

  /**
   * DOWNLOAD PDF BUTTON
   */
  console.log(btnPDF);
 

  document.addEventListener("click", (target) => {
    console.log("test\n", target.target);
  })
};

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
}

function activeColor(activTab, evt) {
  // Declare all variables
  var i, colorBox;

  // Get all elements with class="tabcontent" and hide them
  colorBox = document.getElementsByClassName(activTab);
  for (i = 0; i < colorBox.length; i++) {
    colorBox[i].style.borderStyle = "none";
  }
  evt.style.borderStyle = "solid"
  evt.style.borderColor = "white"
}

