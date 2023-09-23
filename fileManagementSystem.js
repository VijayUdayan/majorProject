#!/usr/bin/env node
// {#!/usr/bin/env node} helps to make global command

// filesystem module
let fs = require('fs');
// operating system module
//let os = require('os');
// chalk module ==> change color and appearence atterminal 
//let chalk  = require('chalk');
// figlet module ==> magnifying the terminal
//let figlet = require('figlet');
// path module ==> geting full path
let path = require('path');

//global variables
let destPath;
let inputArr = process.argv.slice(2);
// console.log(inputArr);
let command = inputArr[0]

// types array will help to search for file types
let types = {
    media: ["mp4", "mkv",'jpeg', 'jpg', 'mp3', 'png'],
    archives: ['zip', 'rar'],
    documents: ['docx', 'doc', 'pdf', 'txt','xls', 'ppt', 'txt'],
    app: ['exe', 'dmg', 'pkg', 'deb'],
    projects: ['c', 'cpp', 'java', 'js', 'html', 'css', 'htm', 'py'],
    links: ['url']
}


switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1])
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log(`\n⚠ ⚠ ⚠ Please enter correct command....\n
Type help for HELP`)
        break;
}


function treeFn(dirPath) {
    if (dirPath == undefined) {
        treeHelper(process.cwd(), "");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        }
        else {
            console.log("Kindly Enter the Correct Path.");
            return;
        }
    }
}


function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else{
        let dirName = path.basename(dirPath);
        console.log(indent+ "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i = 0; i < childrens.length; i++){
            let childrensPath = path.join(dirPath, childrens[i]);
            treeHelper(childrensPath, indent + "\t");
        }
    }
}

function organizeFn(dirPath) {
    //console.log("organize command implemented for: ", dirPath);
    if (dirPath == undefined) {
        dirPath = path.join(process.cwd());
        destPath = path.join(process.cwd(), "OrganizedDir");
        if (fs.existsSync(destPath) == false) {
            fs.mkdirSync(destPath);
        }
        // return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            destPath = path.join(dirPath, "OrganizedDir");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        }
        else {
            console.log("Kindly Enter the Correct Path.");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    //console.log(childNames);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            //console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "\tbelogs to -->\t", category);

            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category){
    let categoryPath = path.join(dest, category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath)
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    // copy/paste..................................................
    fs.copyFileSync(srcFilePath, destFilePath);
    // cut/paste...................................................
    //fs.unlinkSync(srcFilePath);
    console.log(fileName, "copied to ", category);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "other";
    //console.log(ext);
}

function helpFn() {
    console.log(`Wrire these commands: 
     ⚠ ⚠ ⚠ commands are case-senstive!!!\n
     node main.js tree "DirPath"
     node main.js orgaize "Dirpath"
     node main.js help\n`)
}
