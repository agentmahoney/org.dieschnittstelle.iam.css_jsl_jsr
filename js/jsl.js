/**
 * Created by Anton Richter on 02.05.2018
 */

window.addEventListener('DOMContentLoaded',initialiseView, true);

var body, tilebtn, ul, addbtn, refreshbtn, litemplate;


function initialiseView() {
    // alert("initialise!");
    tilebtn = document.getElementsByClassName("tile-view-btn") [0];
    body = document.querySelector("body");
    ul = document.getElementsByTagName("ul")[0];
    addbtn = document.getElementsByClassName("new-item-btn") [0];
    litemplate = document.getElementsByTagName("template") [0];
    refreshbtn = document.getElementsByClassName("refresh-btn") [0];

    // initially get items from json file:
    xhrGet();

    // fade to tile or list view:

    tilebtn.onclick = function() {
        body.classList.toggle("fade-out");
        body.addEventListener("transitionend", ontransitionend);

    }

    function ontransitionend(){
        body.classList.toggle("tile-view");
        body.classList.toggle("fade-out");
        body.removeEventListener("transitionend", ontransitionend);
    }

    // click on list-item dialog:

    ul.onclick = onlistitemSelected;

    function onlistitemSelected(event) {

        var li = lookupLi(event.target);

        if (li) {
            if (event.target.tagName =="BUTTON"){
                removeLi(li);
            }
            else {
                alert("selected: " + li.querySelector("h2").textContent);
            }
        } else {
            alert("something went wrong!");
        }
    }

    // getting parent Li:

    function lookupLi(el){
        if (el.tagName == "LI") {
            return el;
        }
        else if (el.tagName =="UL") {
            console.error("lookupLi(): have reached list root", el);
            return null;
        }
        else  if (el.parentNode){
            return lookupLi(el.parentNode);
        }
        else {
            console.error("lookupLi(): something went wrong", el)
            return null;
        }
    }

    // "remove list item?" dialog:

    function removeLi(li){
        if (confirm("Do you want the selected item \""+ li.querySelector("h2").textContent
            + "\"\nURL: \"" + li.querySelector("img").src + "\" to be removed?")){
            ul.removeChild(li);
        }
    }

    // new-item-btn:

    addbtn.onclick = function(event) {
        event.stopPropagation();
        var newItemFactor = (Date.now() % 10) +1;
        var newItem = {
            name: "item" + newItemFactor,
            owner:"lorempixel.com",
            added: (new Date()).toLocaleDateString(),
            numOfTags: 0,
            src:"https://placeimg.com/100/" + newItemFactor * 100 + "/city"};
        addNewListitem(newItem);
    }

    function addNewListitem(obj){
        // alert("add new element!" + JSON.stringify(obj));

        var li = document.importNode(litemplate.content, true);
        li.querySelector("h2").textContent = obj.name;
        li.querySelector(".owner").textContent = obj.owner;
        li.querySelector("img").src = obj.src;
        li.querySelector(".added").textContent = obj.added;
        li.querySelector(".numOfTags").textContent = obj.numOfTags;

        ul.appendChild(li);
    }

    //get items from json-file:


    function xhrGet() {
        xhr("GET", "data/listitems.json", null, function (xhrobj) {
            // alert("success! Got: " + xhrobj.responseText);
            var itemlist = JSON.parse(xhrobj.responseText);
            itemlist.forEach(function (obj) {
                addNewListitem(obj);
            })
        }, function () {
            alert("Something went wrong");
        })
    }

    // refresh-btn:

    refreshbtn.onclick = function(){
        ul.innerHTML ="";
        xhrGet()
    };
}