//Copyright Kyle C. Iverson

/*
Name: Text on option
Id: Unique identifier of option
Target: Element id where text will be appended
Output: Controlled from scribText() function
Tip: Placeholder text for the input box; if no input needed, set Tip to ""
Additional input from "scribzIn" input element
*/

const Scribz = [
    {Name: "Remote into Server", Id: "RemoteServer", Target: "trbl", Tip: "Server Name"},
    {Name: "Remote into Computer", Id: "RemoteComputer", Target: "trbl", Tip: "Computer Name"},
    {Name: "Lock & Close Session", Id: "LockClose", Target: "trbl", Tip: "Computer Name"},
    {Name: "Unlock User", Id: "UnlockAcct", Target: "trbl", Tip: "Server Name"}
];

function getText (index)
//Returns text written by Scribz[index]
//To add new text, enter a new case with the Scribz Name as the case value
//The string that is returned by that case is what that Scribz will write
{
    var scribzIn = document.getElementById("scribzIn").value;
    if (Scribz[index].Tip != "")
    {
        if (scribzIn == "") {scribzIn = document.getElementById("hdwrA").value.split('\n')[0].split(',')[0].split(' ')[0];}
        if (scribzIn == "") 
        {
            console.log("function getText(tag): scribzIn is empty")
            return "";
        }
    }
    var txt = "";
    var user = document.getElementById("user").value.split(' ')[0].split('\n')[0].split(',')[0];
    if (user == "") {user = document.getElementById("contact").value.split(' ')[0].split('\n')[0].split(',')[0];}
    switch (Scribz[index].Id)
    {
        case "UnlockAcct":
            txt += "- Opened remote session with " + scribzIn + " via BOIT Remote tool\n";
            txt += "- Logged into " + scribzIn + " with domain admin credentials from BMP\n";
            txt += "- Opened Active Directory and found " + user + "'s account\n";
            txt += "- Opened " + user + "'s account and unlocked it\n";
            txt += "- Asked " + user + " to try logging in: success\n";
            txt += "- Asked " + user + " to try logging out and back in: success\n";
            txt += "- Locked " + scribzIn + " and closed remote session\n";
            txt += "- Issue resolved\n";
            txt += "- Closing ticket"
            return txt;
        case "RemoteServer":
            txt = "- Opened remote session with " + scribzIn + " via BOIT Remote tool\n";
            txt += "- Logged into " + scribzIn + " with domain admin credentials from BMP\n";
            return txt;
        case "RemoteComputer":
            txt = "- Opened remote session with " + scribzIn + " via BOIT Remote tool\n";
            return txt;
        case "LockClose":
            txt = "- Locked " + scribzIn + " and closed remote session\n";
            return txt;
    }
}

//DO NOT EDIT BELOW THIS POINT!!!
function fillScribz ()
//Adds options to "scribz" select element
{
    for (var i = 0; i < Scribz.length; i++)
    {
        var opt = document.createElement("option");
        opt.innerHTML = Scribz[i].Name;
        opt.value = Scribz[i].Id;
        opt.id = Scribz[i].Id;
        document.getElementById("scribz").add(opt);
    }
}

function findScribz (id)
//Returns index of Scribz array with Id == id
{
    for (var i = 0; i < Scribz.length; i++) {if (Scribz[i].Id == id) {return i;}}
    console.log("function findScribz(id): Could not find Scribz with id");
    return -1;
}

function updateScribzIn (sel)
//Updates scribzIn when scribz select element changes
{
    var i = findScribz(sel.value);
    sel.setAttribute("data-i",i);
    if (sel.getAttribute("data-i") == -1) {document.getElementById("scribzIn").placeholder = "- none -";}
    else {document.getElementById("scribzIn").placeholder = Scribz[i].Tip;}
}



function scribeScribz ()
//Writes text in target
{
    var i = document.getElementById("scribz").getAttribute("data-i");
    var tgt = document.getElementById(Scribz[i].Target);
    if (i == -1) {return;}
    tgt.innerHTML += getText(i);
    if (tgt.tagName == "TEXTAREA") {while (tgt.scrollHeight > (tgt.clientHeight + 1)) {tgt.rows += 1;}}
}