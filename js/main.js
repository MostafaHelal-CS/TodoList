// Select date element
let theDate=document.querySelector(".headingDate");
// Select Input Field
let theInput=document.getElementById("theInput");
// Select Submit button
let theSubmitbtn=document.getElementById("addlist");
// Select Form
let theForm=document.getElementsByTagName("form")[0];
// Select the lists container
let theLists=document.querySelector(".lists");
// Select delete all button
let deleteall=document.querySelector(".deleteAll");
// Select popup
let thepopup=document.querySelector(".popup");

// Create Empty Array To Store tasks
let ArrayOfTasks=[];
// window.localStorage.removeItem("tasks");

// Check if thers is tasks in local storage
if(window.localStorage.getItem("tasks")) {
    ArrayOfTasks=JSON.parse(window.localStorage.getItem("tasks"));
    deleteall.style.display="block";
} else {
    ArrayOfTasks=[];
}

// Get data from local storage function
getdatafromlocalStorage();

// Array Of Weak Days
let weekDays=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Create Date Function
let date=new Date();
// Get The Day Name Via weak index
theDate.innerHTML=weekDays[date.getDay()];



// Prevent form from sending by default
theForm.addEventListener('submit', (e) => {
    e.preventDefault();
});


// Function To Add Tasks
theSubmitbtn.onclick=function () {
    if(theInput.value=="") {
        alert("Please Enter The List");
    } else {
        // Add Task To Array
        addTaskToArray(theInput.value);
        theInput.value="";
        deleteall.style.display="block";
    }
};

theLists.addEventListener("click", (e) => {
    if(e.target.classList.contains("clicked")) {
        // Add classlist to the parentElement
        e.target.parentElement.parentElement.classList.toggle("fliplist");
        // Store status via list id
        storeStatusVia(e.target.parentElement.parentElement.getAttribute("data-id"));
    }
});
// Function That Contain all Tasks
function addTaskToArray (taskText) {
    // Create object To Carry List Data
    let dataObj={
        id: Date.now(),
        taskvalue: taskText,
        status: false,
    };
    ArrayOfTasks.push(dataObj);
    AppendTasksToPageFrom(ArrayOfTasks);

    // Add array of tasks to local storage
    storeTasksInLocalStorage(ArrayOfTasks);

    // get Data from localstorage
    getdatafromlocalStorage();
};
// Function To create Tasks and append tasks in the page
function AppendTasksToPageFrom (ArrayOfTasks) {
    theLists.innerHTML="";
    ArrayOfTasks.forEach((task) => {
        // Create List
        let div=document.createElement("div");
        // Add Classname to the list
        div.className="list";
        // Add id to the list
        div.setAttribute("data-id", task.id);
        // Check for the ststus of each div
        if(task.status) {
            div.className="list fliplist";
        }

        // Create list contnet
        let listCont=document.createElement("div");
        listCont.className="listContent";
        // Create paragraph to carry the task value
        let paragraph=document.createElement("p");
        // Add classname to the paragraph
        paragraph.className="list-text";
        // Create span 
        let span=document.createElement("span");
        // Add classname to span
        span.className="clicked";
        // add span in the paragraph
        // paragraph.appendChild(span);
        // add paragraph value in the paragraph
        paragraph.appendChild(document.createTextNode(task.taskvalue));

        listCont.append(span, paragraph);
        // Create delete btn
        let btn=document.createElement("button");
        btn.className="deleteList";
        let deleteIcon=document.createElement("i");
        deleteIcon.className="fa-solid fa-trash";

        div.appendChild(listCont);
        btn.appendChild(deleteIcon);
        div.appendChild(btn);
        theLists.appendChild(div);

        btn.addEventListener('click', function () {
            div.remove();
            deleteTaskVia(task.id);
        });
    });
};

// storeTasksInLocalStorage function
function storeTasksInLocalStorage (ArrayOfTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(ArrayOfTasks));
}

// getdatafromlocalStorage function
function getdatafromlocalStorage () {
    let data=window.localStorage.getItem("tasks");
    // Check if there is data in local storage 
    if(data) {
        let tasks=JSON.parse(data);
        AppendTasksToPageFrom(tasks);
    }
};

function storeStatusVia (id) {
    for(let i=0; i<ArrayOfTasks.length; i++) {
        if(ArrayOfTasks[i].id==id) {
            ArrayOfTasks[i].status==false? ArrayOfTasks[i].status=true:ArrayOfTasks[i].status=false;
        }
    }
    // Update the local storage function
    storeTasksInLocalStorage(ArrayOfTasks);
}

// Function to delete tasks via id
function deleteTaskVia (id) {
    ArrayOfTasks=ArrayOfTasks.filter((task) => task.id!=id);

    // Update local storage with new array tasks
    storeTasksInLocalStorage(ArrayOfTasks);
}
// Function to delete all Lists
deleteall.onclick=() => {

    // Create popup div
    let popupDiv=document.createElement("div");
    popupDiv.className="popup";

    let popupHeading=document.createElement("div");
    popupHeading.className="popHeading";
    let span=document.createElement("span");

    let popupicon=document.createElement("i");
    popupicon.className="fa-solid fa-trash fa-bounce";
    span.append(document.createTextNode("Delete All"), popupicon);
    let closeBtn=document.createElement("i");
    closeBtn.className="fa-solid fa-close";
    popupHeading.append(span, closeBtn);

    let popupText=document.createElement("p");
    popupText.className="popupText";
    popupText.appendChild(document.createTextNode("Are you sure to delete all lists!"));
    let buttonsEvents=document.createElement("div");
    buttonsEvents.className="btnEvent";
    let deleteButton=document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete all"));
    let cancelDeleteButton=document.createElement("button");
    cancelDeleteButton.appendChild(document.createTextNode("Cancel"));

    popupDiv.append(popupHeading, popupText);
    buttonsEvents.append(cancelDeleteButton, deleteButton);
    popupDiv.appendChild(buttonsEvents);
    document.body.appendChild(popupDiv);

    popupDiv.style.display="block";

    deleteButton.addEventListener("click", () => {
        window.localStorage.removeItem("tasks");
        theLists.innerHTML="";
        window.location.reload()=() => {
            AppendTasksToPageFrom(ArrayOfTasks);
        };
    });

    cancelDeleteButton.addEventListener("click", () => {
        popupDiv.style.display="none";
    });
    closeBtn.addEventListener("click", () => {
        popupDiv.style.display="none";
    });
};