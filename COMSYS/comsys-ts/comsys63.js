//  v.6.31 (comsys63.ts)
/* users passports base */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var uBase = [
    { name: "Андрей", imgSrc: "img/a.jpg" } /*	uBase[0]	*/,
    { name: "Борис", imgSrc: "img/b.jpg" } /*	uBase[1]	*/,
    { name: "Вика", imgSrc: "img/c.jpg" } /*	uBase[2]	*/,
    { name: "Гоша", imgSrc: "img/g.jpg" },
], /*	uBase[3]	*/ validUser = 0, errorFlag = false, usrID, cBase, rBase, mobile376 = false, auxMockDateTime, // to store the previous function mockDateTime return value
funcPool = []; // to store event handlers functions pool, only for 'buildReplyButtonsHandlers'
var doc = document, px = "px", requestString = "https://randomuser.me/api/", normal = "normal", ver = 631, minusColor = "red", plusColor = "rgb(138,197,64)", dec = "-", inc = "+", messageWrap = doc.createElement("div"), progressWrap = doc.createElement("div"), meStyl = messageWrap.style, progStyl = progressWrap.style, uBaseLen = uBase.length, timing1 = 2000, timing2 = timing1 / 4, brdWdth = "1px solid ", shadow = "3px 3px 2px 1px lightgray";
meStyl.border = brdWdth + "red";
meStyl.padding = '8' + px;
meStyl.display = "inline-block";
meStyl.fontSize = '22' + px;
progStyl.border = brdWdth + "blue";
progStyl.minWidth = '100' + px;
progStyl.display = "inline-flex";
meStyl.boxShadow = shadow;
progStyl.marginLeft = '10' + px;
progStyl.background = "green";
progStyl.boxShadow = shadow;
/* mobile version width marker */
var widthBrkPnt = 376, 
/* rating counter changes attempts limit */
userRatingChangesLimit = 1, 
/* in range [0..3] */
defaultSortMenuItemNumber = 2, 
/* user input comment text max length limit */
maxTextLength = 1000, 
/* sort menu items */
menuSort = [
    { text: "По дате", krit: "date" },
    { text: "По количеству оценок", krit: "rate" },
    { text: "По актуальности", krit: normal },
    { text: "По количеству ответов", krit: "answers" },
], inActFavPic = "Gry", actFavPic = "Red", centeredWrap = doc.querySelector(".bin1"), container = doc.querySelector(".commentContainer"), commntsAmount = doc.querySelector(".commntsAmount"), commntsHeaderLine = doc.querySelector(".commntsHeaderLine"), favControl = doc.querySelector(".favCntrl");
function insBrik() {
    var progressBrik = doc.createElement("div"), brikStyl = progressBrik.style;
    brikStyl.width = '20' + px;
    brikStyl.height = '10' + px;
    brikStyl.background = "red";
    progressWrap.appendChild(progressBrik);
}
;
function messageShow() {
    var text;
    var basyP = " базы пользователей ";
    switch (errorFlag) {
        case false:
            text = "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430".concat(basyP, "\u0438\u0437 ").concat(requestString, ": \u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ").concat(validUser, " \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0438\u0437 ").concat(uBaseLen);
            break;
        case true:
            text = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438".concat(basyP, "\u0438\u0437 ").concat(requestString, ". \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0443\u044E \u0431\u0430\u0437\u0443");
            break;
    }
    messageWrap.innerHTML = text + ".";
}
;
function requestUserData() {
    var xhR = new XMLHttpRequest();
    xhR.open("get", requestString);
    xhR.onload = function () {
        if (xhR.status === 200) {
            var xhRResp = JSON.parse(xhR.response)["results"][0], name_1 = xhRResp["name"]["first"] + " " + xhRResp["name"]["last"], picURL = xhRResp["picture"]["large"];
            uBase[validUser] = { name: name_1, imgSrc: picURL };
            validUser++;
            insBrik();
        }
    };
    xhR.onerror = function () {
        errorFlag = true;
    };
    xhR.send();
}
;
/* Data save to and load from local browser storage */
function sTor(keyName, value) {
    if (keyName === void 0) { keyName = null; }
    if (value === void 0) { value = null; }
    var functionOut = null;
    /* if no arguments (i.e. keyName=null) then con('stor: ERR - no args') and return */
    if (keyName === null) {
        console.log("sTor: ERR - function call with no arguments");
    }
    else {
        if (value === null) {
            /* request to local Stor for key named `keyName` */
            value = localStorage.getItem(keyName);
            if (value === null) {
                /* console.log('sTor: no key named - ',keyName,' in storage'); */
            }
            else {
                functionOut = JSON.parse(value);
            }
        }
        else {
            /* save the value named as `keyName` value */
            localStorage.setItem(keyName, JSON.stringify(value));
        }
    }
    return functionOut;
}
;
/* saving base to local storage */
function baseToStor(base) {
    switch (base) {
        case uBase:
            sTor("uBase", uBase);
            break;
        case cBase:
            sTor("cBase", cBase);
            break;
        case rBase:
            sTor("rBase", rBase);
            break;
        case usrID:
            sTor("usrID", usrID);
            break;
    }
}
;
/* bases initialization procedure */
function baseInit(keyName, cbFunction) {
    var xValue = sTor(keyName);
    if (xValue === null) {
        xValue = cbFunction();
        sTor(keyName, xValue);
    }
    return xValue;
}
;
/* load previous users base from storage */
var auxBase = sTor("uBase");
function script2() {
    /*	----	M A i N  	P R O C E D U R E 	----	*/
    var spHoopWidth = sTor("spHoopWidth");
    if (centeredWrap) {
        centeredWrap.style.display = "block";
    }
    /* user ID index base init */
    usrID = baseInit("usrID", function () {
        return {
            byCIDX: [] /* to get user ID number by comment index */,
            byRIDX: [] /* to get user (replier) ID number by reply index */,
            byName: {} /* to get user ID number by user name */,
        };
    });
    /* comments base init */
    cBase = baseInit("cBase", function () {
        return [];
    });
    /* replies base init */
    rBase = baseInit("rBase", function () {
        return [];
    });
    /* Actual Date and Time Acquisition */
    function getDateTime() {
        var tday1 = new Date(), date1 = [
            tday1.getDate(),
            tday1.getMonth() + 1,
            tday1.getHours(),
            tday1.getMinutes(),
        ];
        date1.forEach(function (x, n, date1item) {
            if (x < 10) {
                date1item[n] = "0" + x;
            }
        });
        return { date: "".concat(date1[0], ".").concat(date1[1]), time: "".concat(date1[2], ":").concat(date1[3]) };
    }
    ;
    function mockDateTime(a) {
        var tday1 = new Date();
        var day, month, monthPlus = false, date1;
        if (a) {
            day = Number(a["date"].slice(0, 2));
            month = Number(a["date"].slice(3, 5));
        }
        else {
            day = 0;
            month = 1;
        }
        day++;
        if (day > 30) {
            day = 1;
            monthPlus = true;
        }
        if (monthPlus) {
            month++;
            monthPlus = false;
            if (month > 12) {
                month = 1;
            }
        }
        date1 = [day, month, tday1.getHours(), tday1.getMinutes()];
        date1.forEach(function (x, n, date1item) {
            if (x < 10) {
                date1item[n] = "0" + x;
            }
        });
        return { date: "".concat(date1[0], ".").concat(date1[1]), time: "".concat(date1[2], ":").concat(date1[3]) };
    }
    ;
    function buildUsersIndexTable() {
        // ext. for new users enrollment to acquire userID by name
        uBase.forEach(function (i, count) {
            usrID["byName"][i["name"]] = count;
        });
    }
    ;
    buildUsersIndexTable();
    baseToStor(usrID);
    var Comment = /** @class */ (function () {
        function Comment(userName) {
            this.user = userName;
            this.showFavoritesOnly = false;
            var loadParams = [
                {
                    keyName: "uFav", initValue: { cIDX: [], rIDX: [] }
                },
                {
                    keyName: "uChange",
                    initValue: { rPermissions: [], cPermissions: [] },
                },
                {
                    keyName: "uSort",
                    initValue: { sortCriteria: null, sortOrder: Comment.iniSortOrder },
                },
            ];
            loadParams.forEach(function (paramObj, n) {
                var sTorKeyName = "".concat(paramObj["keyName"], "-").concat(userName);
                if (sTor(sTorKeyName) === null) {
                    sTor(sTorKeyName, paramObj["initValue"]);
                }
                loadParams[n]["keyName"] = sTorKeyName;
            });
            this.uFav = sTor(loadParams[0]["keyName"]);
            this.uChange = sTor(loadParams[1]["keyName"]);
            this.uSort = sTor(loadParams[2]["keyName"]);
        }
        Object.defineProperty(Comment.prototype, "getName", {
            get: function () {
                return this.user;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Comment.prototype, "getIDByName", {
            get: function () {
                return usrID["byName"][this.user];
            },
            enumerable: false,
            configurable: true
        });
        Comment.prototype.rebuildComments = function () { };
        Comment.prototype.placeComment = function (commentText) { };
        Comment.prototype.placeReply = function (comIDX, orderNumber) { };
        Comment.prototype.allowToChangeRate = function (IDX, base) { return false; };
        Comment.prototype.showFavOnly = function (state) {
            switch (state) {
                case true:
                    this.showFavoritesOnly = true;
                    break;
                case false:
                    this.showFavoritesOnly = false;
                    break;
            }
            return this.showFavoritesOnly;
        };
        Comment.prototype.setFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            return false;
        };
        Comment.prototype.findFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            return false;
        };
        Comment.iniSortOrder = true;
        return Comment;
    }());
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        User.prototype.placeComment = function (commentText) {
            auxMockDateTime = mockDateTime(auxMockDateTime);
            var dateTime1 = auxMockDateTime, cBaseLen;
            // Get real Date and Time if no Date and Time specified
            if (!dateTime1) {
                dateTime1 = getDateTime();
            }
            var messageRecord = {
                text: commentText,
                rate: 0,
                date: dateTime1["date"],
                time: dateTime1["time"],
                answers: 0,
            };
            usrID["byCIDX"].push(this.getIDByName);
            cBase.push(messageRecord);
            baseToStor(usrID);
            baseToStor(cBase);
            cBaseLen = cBase.length - 1;
            showComment(cBaseLen);
            underLineSwitch();
        };
        User.prototype.placeReply = function (comIDX, orderNumber) {
            auxMockDateTime = mockDateTime(auxMockDateTime);
            inputTextForm(this.user, orderNumber, auxMockDateTime, comIDX);
        };
        User.prototype.allowToChangeRate = function (IDX, base) {
            function poolTest(auxPool, IDX) {
                var zero = 0;
                var maxChanges = userRatingChangesLimit, changes = zero;
                maxChanges--;
                if (maxChanges < zero) {
                    maxChanges = zero;
                }
                auxPool.forEach(function (i) {
                    if (i === IDX) {
                        changes++;
                    }
                });
                if (changes > maxChanges) {
                    return false;
                }
                else {
                    return true;
                }
            }
            ;
            if (base === cBase) {
                if (poolTest(this.uChange["cPermissions"], IDX)) {
                    this.uChange["cPermissions"].push(IDX);
                    sTor("uChange-".concat(this.user), this.uChange);
                    return true;
                }
            }
            else {
                if (poolTest(this.uChange["rPermissions"], IDX)) {
                    this.uChange["rPermissions"].push(IDX);
                    sTor("uChange-".concat(this.user), this.uChange);
                    return true;
                }
            }
            return false;
        };
        User.prototype.rebuildComments = function (sortCriteria, reverse) {
            if (sortCriteria === void 0) { sortCriteria = null; }
            if (reverse === void 0) { reverse = false; }
            var ordPic = doc.querySelector(".ordPic"), ordPicStl = ordPic.style;
            var vShift = Math.round(Number(ordPicStl.height.slice(0, 2)) * 2), shiftSign = "", angle = '45';
            if (sortCriteria === null) {
                if (this.uSort["sortCriteria"] === null) {
                    sortCriteria = defaultSortMenuItemNumber;
                }
                else {
                    sortCriteria = this.uSort["sortCriteria"];
                }
            }
            dispChoice(sortCriteria);
            if (this.uSort["sortCriteria"] === sortCriteria) {
                if (reverse) {
                    this.uSort["sortOrder"] = !this.uSort["sortOrder"];
                }
            }
            else {
                this.uSort["sortOrder"] = Comment.iniSortOrder;
            }
            rebuildAll(menuSort[sortCriteria]["krit"], this.uSort["sortOrder"]);
            if (this.uSort["sortOrder"]) {
                angle = '-135';
                shiftSign = "-";
                vShift += 15;
            }
            ordPicStl.rotate = "".concat(angle, "deg");
            ordPicStl.translate = "0px ".concat(shiftSign).concat(vShift, "%");
            this.uSort["sortCriteria"] = sortCriteria;
            sTor("uSort-".concat(this.user), this.uSort);
        };
        User.prototype.setFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            var favAux = [], inBase = true, favTyp = "cIDX";
            if (baseType === rBase) {
                favTyp = "rIDX";
            }
            this.uFav[favTyp].forEach(function (uFavCommentIndex) {
                if (commentIndex === uFavCommentIndex) {
                    inBase = false;
                }
                else {
                    favAux.push(uFavCommentIndex);
                }
            });
            if (inBase) {
                favAux.push(commentIndex);
            }
            this.uFav[favTyp] = favAux;
            sTor("uFav-".concat(this.user), this.uFav);
            heartSwitch();
            return inBase;
        };
        User.prototype.findFav = function (commentIndex, baseType) {
            if (baseType === void 0) { baseType = cBase; }
            var inBase = false, favTyp = "cIDX";
            if (baseType === rBase) {
                favTyp = "rIDX";
            }
            this.uFav[favTyp].forEach(function (uFavCommentIndex) {
                if (commentIndex === uFavCommentIndex) {
                    inBase = true;
                }
            });
            return inBase;
        };
        return User;
    }(Comment));
    var user = [];
    uBase.forEach(function (uBaseItem) {
        user.push(new User(uBaseItem["name"]));
    });
    var activeUser = user[Math.floor(Math.random() * 4)];
    function favPresent() {
        if (activeUser.uFav["cIDX"].length || activeUser.uFav["rIDX"].length) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    function heartSwitch() {
        var heartPic = inActFavPic;
        if (favPresent()) {
            heartPic = actFavPic;
        }
        doc.querySelector(".heartPic").src = "img/heart".concat(heartPic, ".gif");
    }
    ;
    function cls(remForm) {
        if (remForm === void 0) { remForm = false; }
        /* cls(false) - keep main input form;
       cls(true)  - remove everything (include the form) */
        var iNameToRemove = [
            ".commentBlock",
            ".commentBlockSeparator",
            ".spHoop",
            ".vertMargin",
            ".replyForm",
            ".replyBlock",
        ];
        if (remForm) {
            iNameToRemove.push(".inputForm");
        }
        var blocksToRemove = [];
        iNameToRemove.forEach(function (i) {
            blocksToRemove.push(doc.querySelectorAll(i));
        });
        blocksToRemove.forEach(function (blocks) {
            blocks.forEach(function (block) {
                block.remove();
            });
        });
    }
    ;
    function parentElFind(event) {
        if (event.target instanceof HTMLImageElement) {
            return event.target.parentElement;
        }
        else {
            return event.target;
        }
    }
    ;
    function buildReplyButtonsHandlers() {
        /* old handlers removing */
        funcPool.forEach(function (arg) {
            arg["node"].removeEventListener("click", arg["func"]);
        });
        funcPool = [];
        /* setting new handlers */
        var replyBtn = doc.querySelectorAll(".bottomCommentF0");
        replyBtn.forEach(function (i, orderNumber) {
            function placeReplyForm(event) {
                activeUser.placeReply(Number(parentElFind(event).dataset.cIDX), orderNumber);
            }
            ;
            funcPool.push({ node: i, func: placeReplyForm });
            i.addEventListener("click", placeReplyForm);
        });
    }
    ;
    function dateToNumber(stringDate) {
        var a = Number(stringDate), b = Math.floor(a);
        return b + Math.round((a - b) * 100 * 31);
    }
    ;
    function rebuildAll(krit, order) {
        if (krit === void 0) { krit = normal; }
        if (order === void 0) { order = false; }
        var auxArray = [];
        cls(true);
        container.style.display = "block";
        if (krit === normal) {
            // sort by normal
            cBase.forEach(function (commentRecord, cIDX) {
                if (order) {
                    auxArray.push(cIDX);
                }
                else {
                    auxArray.unshift(cIDX);
                }
            });
        }
        else {
            // sort by answers,rate,date
            var sBase_1 = [];
            //sBase Fill
            var locBas_1 = null;
            cBase.forEach(function (commentRecord) {
                var result;
                if (commentRecord) {
                    if (krit === "date") {
                        result = dateToNumber(commentRecord["date"]);
                    }
                    else {
                        result = commentRecord[krit];
                    }
                    sBase_1.push(result);
                    /* locBase searching */
                    if (locBas_1 === null) {
                        locBas_1 = result;
                    }
                    else {
                        if ((order && result > locBas_1) || (!order && result < locBas_1)) {
                            locBas_1 = result;
                        }
                    }
                }
            });
            if (order) {
                locBas_1++;
            }
            else {
                locBas_1--;
            } // local base setting
            var lockNext_1, cIDXi_1;
            do {
                lockNext_1 = locBas_1;
                cIDXi_1 = null;
                sBase_1.forEach(function (ans, n) {
                    if ((order && ans < lockNext_1) || (!order && ans > lockNext_1)) {
                        lockNext_1 = ans;
                        cIDXi_1 = n;
                    }
                });
                if (cIDXi_1 === null) {
                    break;
                }
                else {
                    auxArray.push(cIDXi_1);
                    sBase_1[cIDXi_1] = locBas_1;
                }
            } while (true);
        }
        auxArray.forEach(function (comIDX) {
            if (!activeUser.showFavOnly() || activeUser.findFav(comIDX)) {
                showComment(comIDX, krit, order);
            }
        });
        buildReplyButtonsHandlers();
        //main comment form 0 - main form
        var inputTextFormMain = doc.querySelector(".inputForm");
        if (!inputTextFormMain) {
            inputTextForm(activeUser.getName, 0);
        }
    }
    ;
    function getProp(DomElement, propertyName) {
        if (DomElement instanceof HTMLElement) {
            return window
                .getComputedStyle(DomElement, null)
                .getPropertyValue(propertyName);
        }
        else {
            return '';
        }
        ;
    }
    ;
    function putDiv(className, baseForm, mode, innerContent) {
        if (baseForm === void 0) { baseForm = null; }
        if (mode === void 0) { mode = null; }
        if (innerContent === void 0) { innerContent = ""; }
        if (mode === null) {
            if (baseForm === null) {
                mode = 3;
            }
            else {
                mode = 2;
            }
        }
        var sampDiv = doc.createElement("div");
        sampDiv.className = className;
        sampDiv.innerHTML = innerContent;
        switch (mode) {
            case 0:
                container.insertBefore(sampDiv, baseForm);
                break;
            case 1:
                baseForm.innerHTML = "";
            case 2:
                baseForm.appendChild(sampDiv);
            case 3:
                break;
            default:
                console.log("putDiv:incorrect operMode -", mode);
        }
        return sampDiv;
    }
    ;
    // 			---	sort order Menu selector	---
    var sortMenuWrap = doc.querySelector(".sortMenuWrap"), sortMenuLink = putDiv("sortMenu", sortMenuWrap), sortMenuBottom = sortMenuLink.getBoundingClientRect().bottom, listContainer = putDiv("listContainer", sortMenuWrap), sortOrdPicWrap = putDiv("sortMenuOrdPic", sortMenuWrap), ordPic = putDiv("ordPic", sortOrdPicWrap), ordPicWidth = ordPic.getBoundingClientRect().width, back = getProp(ordPic, "background-color"), srtMnuSty = listContainer.style, ordPicStl = ordPic.style;
    ordPicStl.background = "linear-gradient(135deg, ".concat(back, " 50%, transparent 50%)");
    ordPicStl.transform = "skew(15deg, 15deg)";
    ordPicStl.height = ordPicWidth + px;
    sortOrdPicWrap.style.width =
        Math.round(Math.sqrt(3 * Math.pow(ordPicWidth, 2))) + px;
    sortMenuWrap.style.position = "relative";
    srtMnuSty.display = "none";
    srtMnuSty.position = "absolute";
    srtMnuSty.zIndex = "1";
    srtMnuSty.top = Math.round(sortMenuBottom * 0.7) + px;
    function underLineSwitch(evTarget) {
        if (evTarget === void 0) { evTarget = null; }
        var comHeaderChilds = [commntsAmount, sortMenuLink, favControl], activeClr = "black", inActiveClr = "gray", borderThickness = '5' + px;
        comHeaderChilds.forEach(function (i) {
            var ist = i.style;
            if (i === evTarget) {
                ist.color = activeClr;
                ist.textDecoration = "";
                ist.borderBottom = "".concat(borderThickness, " solid ").concat(activeClr);
            }
            else {
                ist.color = inActiveClr;
                ist.borderBottom = "".concat(borderThickness, " solid transparent");
                ist.textDecoration = "underline";
                ist.textUnderlinePosition = "under";
            }
        });
        if (evTarget === favControl) {
            activeUser.showFavOnly(true);
        }
        else {
            activeUser.showFavOnly(false);
        }
        activeUser.rebuildComments();
    }
    ;
    commntsAmount.addEventListener("click", function () {
        underLineSwitch(commntsAmount);
    });
    function dispChoice(iNumber) {
        var itemMark = doc.querySelectorAll(".itemMark");
        itemMark.forEach(function (mark) {
            mark.style.opacity = "0";
        });
        if (iNumber != null) {
            itemMark[iNumber].style.opacity = "1";
            sortMenuLink.innerHTML = "".concat(menuSort[iNumber]["text"]);
        }
    }
    ;
    menuSort.forEach(function (i, n) {
        var itemLine = putDiv("listItem", listContainer), mark1 = putDiv("itemMark", itemLine), mark1Stl = mark1.style, markSign = putDiv("markSign", mark1), markSignStl = markSign.style, itemDesc = putDiv("itemDesc", itemLine, 2, "".concat(i["text"]));
        var nStr = n;
        if (i["krit"] === normal) {
            mark1Stl.opacity = "1";
        }
        else {
            mark1Stl.opacity = "0";
        }
        markSignStl.borderStyle = "solid";
        markSignStl.rotate = "35deg";
        markSign.dataset.choiceNum = nStr;
        itemLine.dataset.choiceNum = nStr;
        mark1.dataset.choiceNum = nStr;
        itemDesc.dataset.choiceNum = nStr;
        itemLine.addEventListener("click", function (ev) {
            if (ev.target instanceof HTMLDivElement) {
                var iNumber = Number(ev.target.dataset.choiceNum);
                dispChoice(iNumber);
                activeUser.rebuildComments(iNumber, true);
                srtMnuSty.display = "none";
            }
        });
    });
    sortMenuLink.addEventListener("click", function () {
        underLineSwitch(sortMenuLink);
        if (srtMnuSty.display === "block") {
            srtMnuSty.display = "none";
            return;
        }
        else {
            srtMnuSty.display = "block";
        }
        var itemMark = doc.querySelectorAll(".itemMark"), itemDesc = doc.querySelector(".itemDesc"), itemDescDim = itemDesc.getBoundingClientRect(), markDim = Math.floor(itemDescDim.height), markSign = doc.querySelectorAll(".markSign");
        itemMark.forEach(function (mark) {
            var markStl = mark.style;
            var markDimStr = markDim;
            markStl.width = markDimStr + px;
            markStl.height = markDimStr + px;
        });
        markSign.forEach(function (sign) {
            var signStl = sign.style;
            signStl.width = Math.floor(markDim / 2.7) + px;
            signStl.height = Math.floor(markDim / 1.5) + px;
            signStl.translate = "0px -" + Math.floor(markDim / 5) + px;
        });
    });
    doc.addEventListener("click", function (ev) {
        if (!(ev.target === listContainer || ev.target === sortMenuLink) &&
            srtMnuSty.display === "block") {
            srtMnuSty.display = "none";
        }
    });
    listContainer.addEventListener("click", function () {
        srtMnuSty.display = "none";
    });
    // end of 		---	sort order Menu selector		---
    //         		---	favorites on/off Menu control		---
    favControl.addEventListener("click", function () {
        underLineSwitch(favControl);
    });
    // end of 		---	favorites on/off Menu control		---
    function putBtn(className1, baseForm, caption, func) {
        var sample = doc.createElement("button");
        sample.innerHTML = caption;
        sample.className = className1;
        if (baseForm) {
            baseForm.appendChild(sample);
        }
        else {
            baseForm = doc.querySelector("div");
            doc.body.insertBefore(sample, baseForm);
        }
        sample.addEventListener("click", func);
        return sample;
    }
    ;
    function strToNum(str) {
        return Number(str.match(/\d+/));
    }
    ;
    /* mobile 376 px width mode */
    function checkWidth() {
        if (strToNum(getProp(centeredWrap, "width")) === widthBrkPnt) {
            mobile376 = true;
        }
        else {
            mobile376 = false;
        }
    }
    ;
    function buildBlock(baseForm, IDX, baseType) {
        if (baseType === void 0) { baseType = false; }
        var prefixFv = "<img class='cmntFavFild' src='img/heart", postfix1 = ".gif'>\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E", inFav = "".concat(prefixFv).concat(actFavPic).concat(postfix1, "\u043C"), toFav = "".concat(prefixFv).concat(inActFavPic).concat(postfix1, "\u0435"), startDiv = "<div class=", termDiv = "</div>", backArrowPic = "<img class='talkBackArrow' src='img/talkBackArrow.gif'>", dateTimeFieldClass = "".concat(startDiv, "'dateTimeField'>"), dateTimeSepar = "89162318y", dateTimeSpace = '9';
        var replyToName = "* unknown *", userData = uBase[usrID["byCIDX"][IDX]], hFC = [], base = cBase, bottomF = "bottomCommentF", bFC = [], reply = false, favItemOrder = 1;
        function pushReplyTo() {
            hFC.push("".concat(backArrowPic));
            hFC.push("".concat(startDiv, "'replyToName'>").concat(replyToName).concat(termDiv));
        }
        ;
        if (baseType) {
            reply = true;
            base = rBase;
            userData = uBase[usrID["byRIDX"][IDX]];
            bottomF = "bottomReplyF";
            favItemOrder = 0;
            replyToName = uBase[usrID["byCIDX"][base[IDX]["toCIDX"]]]["name"];
            if (!mobile376) {
                pushReplyTo();
            }
        }
        else {
            bFC.push("".concat(backArrowPic, "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"));
        }
        bFC.push(toFav);
        hFC.unshift(userData["name"]);
        hFC.push("".concat(dateTimeFieldClass).concat(base[IDX]["date"]).concat(termDiv));
        hFC.push(dateTimeSepar);
        hFC.push("".concat(dateTimeFieldClass).concat(base[IDX]["time"]).concat(termDiv));
        /* Rating control block preforming */
        var rateBlock0 = [dec, base[IDX]["rate"], inc];
        var rateBlock = rateBlock0;
        if (mobile376) {
            /* rateBlock = rateBlock0.toReversed(); */
            rateBlock = [];
            rateBlock0.forEach(function (item) { rateBlock.unshift(item); });
            if (reply) {
                pushReplyTo();
            }
        }
        bFC = bFC.concat(rateBlock);
        /*User Avatar Section*/
        putDiv("userAvatarWrap", baseForm, 2, "<img src=".concat(userData["imgSrc"], " class=\"userAvatar\">"));
        /*User Content Section Left Margin */
        putDiv("userContentLMargin", baseForm);
        /*User Content Section: Header (FIO, BackArrow Sign, Date, Time*/
        var usrCntnt = putDiv("userContent", baseForm);
        /*User content section header container*/
        var contentHeader = putDiv("contentHeader", usrCntnt);
        /*Header blocks building*/
        /* hFC = [userData['name'],'1.BackArrow',replyToName,base[IDX]['date'],'*S*',base[IDX]['time']]; */
        hFC.forEach(function (hFC, i) {
            var space = putDiv("headerF headerF".concat(i), contentHeader, 2, hFC);
            if (hFC === dateTimeSepar) {
                space.style.width = dateTimeSpace + px;
                space.innerHTML = "";
            }
        });
        /*User Comment Textblock*/
        putDiv("commentText", usrCntnt, 2, "".concat(base[IDX]["text"]));
        /*User content section bottom container*/
        var contentBottom = putDiv("contentBottom", usrCntnt);
        /*Bottom blocks building*/
        /* bFC = ['0.Reply',`${base[IDX]['fav']}`,`${base[IDX]['rate']}`]; */
        function rateClr(rateValue, elementStyle) {
            // set the comment/reply rate counter font color. 
            // negative values rate - 'minusColor'; positive values with 'plusColor'
            if (rateValue > 0) {
                elementStyle.color = plusColor;
            }
            else {
                if (rateValue === 0) {
                    elementStyle.color = "";
                }
                else {
                    elementStyle.color = minusColor;
                }
            }
        }
        ;
        var rateCtrlWrap = null;
        bFC.forEach(function (bFC, i) {
            var contentBottomF = null;
            if ((bFC === inc || bFC === dec) && !rateCtrlWrap) {
                rateCtrlWrap = putDiv("rateCtrlWrap", contentBottom);
            }
            if (rateCtrlWrap) {
                contentBottomF = putDiv("rateCtrl", rateCtrlWrap, 2, "".concat(bFC));
                if (mobile376) {
                    contentBottomF.style.margin = '0' + px;
                }
            }
            else {
                contentBottomF = putDiv("bottomF ".concat(bottomF).concat(i), contentBottom, 2, "".concat(bFC));
            }
            // cBFs - auxiliary local constant
            var cBFs = contentBottomF.style;
            if (bFC === inc || bFC === dec) {
                // bFC is plus or minus
                cBFs.borderRadius = "50%";
                cBFs.backgroundColor = "rgb(230,230,230)";
                if (bFC === inc) {
                    cBFs.color = plusColor;
                }
                else {
                    cBFs.color = minusColor;
                }
                /* set + and - rating control wrap width equal to the height from CSS file */
                var iHeight = Math.floor(contentBottomF.getBoundingClientRect().height);
                cBFs.width = iHeight + px;
                contentBottomF.addEventListener("click", function (ev) {
                    if (ev.target instanceof HTMLDivElement) {
                        var bottomBlock = ev.target.parentElement, rateDisplayEl = bottomBlock.querySelector(".rateCtrl").nextSibling;
                        if (activeUser.allowToChangeRate(IDX, base)) {
                            if (ev.target.innerHTML === dec) {
                                base[IDX]["rate"]--;
                            }
                            else {
                                base[IDX]["rate"]++;
                            }
                            rateClr(base[IDX]["rate"], rateDisplayEl.style);
                            baseToStor(base);
                            rateDisplayEl.innerHTML = base[IDX]["rate"];
                        }
                    }
                    ;
                });
            }
            else {
                // bFC is not plus or minus
                if (rateCtrlWrap) {
                    // rating counter style
                    cBFs.cursor = "default";
                    rateClr(base[IDX]["rate"], cBFs);
                    cBFs.fontWeight = "600";
                }
                contentBottomF.dataset.cIDX = IDX;
                if (favItemOrder === i) {
                    if (reply) {
                        cBFs.marginLeft = "";
                    }
                    else {
                        cBFs.marginLeft = '15' + px;
                    }
                    if (activeUser.findFav(IDX, base)) {
                        contentBottomF.innerHTML = inFav;
                    }
                    else {
                        contentBottomF.innerHTML = toFav;
                    }
                    contentBottomF.addEventListener("click", function (ev) {
                        if (activeUser.setFav(Number(parentElFind(ev).dataset.cIDX), base)) {
                            contentBottomF.innerHTML = inFav;
                            // parent comment switch to favorite
                            if (base === rBase) {
                                if (!activeUser.findFav(rBase[IDX]["toCIDX"])) {
                                    // comment block favorite display on
                                    var cmntFavFPool = doc.querySelectorAll(".bottomCommentF1");
                                    cmntFavFPool.forEach(function (i) {
                                        if (Number(i.dataset.cIDX) === rBase[IDX]["toCIDX"]) {
                                            i.innerHTML = inFav;
                                        }
                                    });
                                    activeUser.setFav(rBase[IDX]["toCIDX"]);
                                }
                            }
                        }
                        else {
                            contentBottomF.innerHTML = toFav;
                            if (base === cBase) {
                                // reply blocks favorites displays off
                                var rplytFavFPool_1 = doc.querySelectorAll(".bottomReplyF0");
                                rBase.forEach(function (i, rIDX) {
                                    if (i["toCIDX"] === IDX && activeUser.findFav(rIDX, rBase)) {
                                        activeUser.setFav(rIDX, rBase);
                                        // all replies favorites displays set off
                                        rplytFavFPool_1.forEach(function (replyFav) {
                                            if (Number(replyFav.dataset.cIDX) === rIDX) {
                                                replyFav.innerHTML = toFav;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            } //bFC is not plus or minus (else end)
        }); //bFC.forEach end
    }
    ; // end of buildBlock procedure
    /* get summarized space Hooper width for Reply block left margin (showReply())*/
    function getSpHoopWidth(clasName) {
        var className = '.' + clasName;
        if (doc.querySelector(className)) {
            return strToNum(getProp(doc.querySelector(className), "width"));
        }
        else {
            return 0;
        }
        ;
    }
    ;
    function showReply(frameElement, rIDX) {
        putDiv("commentBlockSeparator", frameElement, 0);
        var replyBlock = putDiv("replyBlock", frameElement, 0), spHoop = putDiv("spHoop", replyBlock);
        if (spHoopWidth === null) {
            spHoopWidth =
                (getSpHoopWidth("userAvatarWrap") + getSpHoopWidth("userContentLMargin"));
            sTor("spHoopWidth", spHoopWidth);
        }
        ;
        spHoop.style.width = spHoopWidth + px;
        frameElement.remove();
        putDiv("vertMargin", replyBlock, 0);
        var innerReplyBlock = putDiv("innerReplyBlock", replyBlock);
        buildBlock(innerReplyBlock, rIDX, true);
    }
    ;
    function inputTextForm(userName, orderNumber, dateTime, comIDX) {
        if (dateTime === void 0) { dateTime = null; }
        if (comIDX === void 0) { comIDX = null; }
        var textLength = 0, maxLen = 0, allowComment = false, messageRecord, separ = null, headerWidth = '400' + px, sumWidth = 0;
        var sumComponents = ["width", "padding-left", "padding-right"], senderID = usrID["byName"][userName] /* message length warning display colors */, tooLongMessage = "Слишком длинное сообщение", warningActiveClr = "#FF0000", inputYourText = "Введите здесь текст Вашего ", btnSndActiveClr = "black", buttonActiveBackgroundClr = "rgb(171,216,115)", firstComment = "Комментариев пока нет. Напишите здесь первый!", max1000chrsMessage = "\u041C\u0430\u043A\u0441. ".concat(maxTextLength, " \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"), commBlocksArray = doc.querySelectorAll(".commentBlock"), prevRplyForms = container.querySelectorAll(".inputForm"), inputForm = putDiv("inputForm"), userData = uBase[usrID["byName"][userName]], inputFormAva = putDiv("userAvatarWrap", inputForm, 2, "<img src=".concat(userData["imgSrc"], " class=\"userAvatar\">")), inputFormContainer = putDiv("inputFormContainer", inputForm), inputFormHeader = putDiv("inputFormHeader", inputFormContainer), headerStyle = inputFormHeader.style, userNameField = putDiv("userNameField", inputFormHeader, 2, userName), warningField = putDiv("warningFWrap", inputFormHeader), warnFldStyle = warningField.style, symbCounter = putDiv("symbCounter", warningField), symbCntStyle = symbCounter.style, warningFieldText = putDiv("text", warningField, 2, max1000chrsMessage), inputFormMain = putDiv("inputFormMain", inputFormContainer), txtInput = doc.createElement("textarea"), txtInpInitRows = 2, txtInpStyle = txtInput.style;
        var inpPlaceholderTxt = firstComment, refreshAfterSend = false;
        txtInput.className = "textInput";
        txtInput.name = "userInputText";
        txtInpStyle.resize = "none";
        txtInpStyle.overflowY = "hidden";
        inputFormMain.appendChild(txtInput);
        /* show symbol counter or warning message at inputFormHeader */
        function showHeader(messageType) {
            if (messageType === void 0) { messageType = null; }
            if (messageType === "warning") {
                symbCounter.innerHTML = "";
                warningFieldText.innerHTML = max1000chrsMessage;
            }
            else {
                symbCounter.innerHTML = "".concat(textLength, "/").concat(maxTextLength);
            }
            if (messageType === "counter") {
                allowComment = true;
                warningFieldText.innerHTML = "";
            }
            else {
                allowComment = false;
            }
            if (messageType === null) {
                warningFieldText.innerHTML = tooLongMessage;
                warnFldStyle.fontStyle = normal;
                symbCntStyle.color = warningActiveClr;
                headerStyle.width = "";
                warningFieldText.style.color = warningActiveClr;
                symbCntStyle.marginRight = '50' + px;
            }
            else {
                warnFldStyle.fontStyle = "";
                symbCntStyle.color = "";
                headerStyle.width = headerWidth;
                warningFieldText.style.color = "";
                symbCntStyle.marginRight = "";
            }
        }
        ;
        function txtInputViewReset(dontKeepValue) {
            if (dontKeepValue === void 0) { dontKeepValue = true; }
            var returnTxt = txtInput.value;
            txtInput.rows = txtInpInitRows;
            txtInpStyle.padding = "";
            maxLen = 0;
            if (dontKeepValue) {
                txtInput.value = "";
                textLength = 0;
                showHeader("warning");
            }
            return returnTxt;
        }
        ;
        var buttonSend = putBtn("formSendBtn", inputFormMain, "Отправить", function () {
            // Get real Date and Time if no Date and Time specified
            if (!dateTime) {
                dateTime = getDateTime();
            }
            /* allow to place comment or reply if the comment text length is smaller than the maxTextLength value
             and the input field contains at least one character (i.e. textLength variable value is greater than zero */
            if (allowComment) {
                if (comIDX === null) {
                    /* comment form send button reaction */
                    activeUser.placeComment(txtInputViewReset());
                    // if no comment blocks on display, switch to display all blocks (not fav only) and
                    // rebuild all blocks to set comment block under the main input form
                    if (refreshAfterSend || (!favPresent() && activeUser.showFavOnly())) {
                        underLineSwitch(commntsAmount);
                        refreshAfterSend = false;
                    }
                    buildReplyButtonsHandlers();
                }
                else {
                    /* reply form send button reaction */
                    messageRecord = {
                        toCIDX: comIDX,
                        text: txtInputViewReset(),
                        rate: 0,
                        date: dateTime["date"],
                        time: dateTime["time"],
                    };
                    cBase[comIDX]["answers"]++;
                    baseToStor(cBase);
                    usrID["byRIDX"].push(senderID);
                    baseToStor(usrID);
                    rBase.push(messageRecord);
                    baseToStor(rBase);
                    showReply(inputForm, rBase.length - 1);
                }
            }
            buttonSendActive();
        });
        var btnSndStyle = buttonSend.style;
        function buttonSendActive(state) {
            if (state === void 0) { state = false; }
            if (state) {
                btnSndStyle.color = btnSndActiveClr;
                btnSndStyle.backgroundColor = buttonActiveBackgroundClr;
            }
            else {
                btnSndStyle.color = "";
                btnSndStyle.backgroundColor = "";
            }
        }
        ;
        txtInput.addEventListener("input", function () {
            textLength = txtInput.value.length;
            if (txtInput.scrollTop) {
                txtInpStyle.paddingTop = '20' + px;
                txtInpStyle.paddingBottom = '20' + px;
                if (maxLen === 0) {
                    maxLen = Math.floor((textLength - 1) / txtInpInitRows);
                }
            }
            if (maxLen > 0) {
                txtInput.rows = Math.floor(textLength / maxLen) + txtInpInitRows - 1;
            }
            if (txtInput.rows < txtInpInitRows) {
                txtInputViewReset(false);
                btnSndStyle.alignSelf = "";
            }
            if (txtInput.rows > txtInpInitRows) {
                btnSndStyle.alignSelf = "flex-start";
            }
            if (textLength > maxTextLength) {
                showHeader();
                buttonSendActive();
            }
            else {
                {
                    if (textLength) {
                        buttonSendActive(true);
                        showHeader("counter");
                    }
                    else {
                        showHeader("warning");
                        buttonSendActive();
                    }
                }
            }
        });
        if (comIDX === null) {
            /* comment form building */
            if (doc.querySelector(".commentBlock")) {
                separ = putDiv("commentBlockSeparator");
                centeredWrap.insertBefore(separ, container);
            }
            else {
                // if no comment blocks on display set 'refreshAfterSend' to true
                refreshAfterSend = true;
            }
            if (cBase.length) {
                inpPlaceholderTxt = inputYourText + "комментария";
            }
            centeredWrap.insertBefore(inputForm, separ);
        }
        else {
            /* previous _EMPTY_ reply forms removing to escape _EMPTY_ reply forms dubbing */
            prevRplyForms.forEach(function (i) {
                if (i.querySelector(".textInput") != null) {
                    if (i.querySelector(".textInput").value === '') {
                        i.remove();
                    }
                }
            });
            /* reply form building */
            inpPlaceholderTxt = inputYourText + "ответа";
            commBlocksArray[orderNumber].insertAdjacentElement("afterend", inputForm);
            txtInput.focus();
        }
        txtInput.placeholder = inpPlaceholderTxt + ".";
        //inputFormHeader width calculation
        sumComponents.forEach(function (componentWidth) {
            sumWidth = sumWidth + strToNum(getProp(txtInput, componentWidth));
        });
        sumWidth = sumWidth - strToNum(getProp(txtInput, "margin-left"));
        headerWidth = sumWidth + px;
        headerStyle.width = headerWidth;
    }
    ; // end of inputTextForm proc
    function showComment(comIDX, krit, order) {
        if (krit === void 0) { krit = null; }
        if (order === void 0) { order = true; }
        var replyForm, auxArray = [];
        var prevCmntBlk = doc.querySelector(".commentBlock");
        /*Comment Block Root Element*/
        var emptyDiv = putDiv("commentBlockSeparator", prevCmntBlk, 0), commBlk = putDiv("commentBlock", emptyDiv, 0);
        if (krit) {
            rBase.forEach(function (reply, rIDX) {
                if (reply["toCIDX"] === comIDX &&
                    (!activeUser.showFavOnly() || activeUser.findFav(rIDX, rBase))) {
                    auxArray.push({ reply: reply, rIDX: rIDX });
                }
            });
            /* auxArray sorting */
            switch (krit) {
                case "rate":
                    auxArray.sort(function (a, b) {
                        return a["reply"]["rate"] - b["reply"]["rate"];
                    });
                    break;
                case "date":
                    auxArray.sort(function (a, b) {
                        return (dateToNumber(a["reply"]["date"]) -
                            dateToNumber(b["reply"]["date"]));
                    });
                    break;
            }
            /* reversing order */
            if (order || krit === "answers")
                auxArray.reverse();
            /* auxArray output */
            auxArray.forEach(function (i) {
                replyForm = putDiv("replyForm", emptyDiv, 0);
                showReply(replyForm, i["rIDX"]);
            });
        }
        // remove the lowest separator
        if (!prevCmntBlk) {
            emptyDiv.remove();
        }
        buildBlock(commBlk, comIDX, false);
    }
    ; // end of showComment proc
    /* --------------------------------- Test/Init/User login section ---------------------------- */
    /* Test comments */
    function testComments() {
        if (sTor("testPass") === null) {
            var comusr = " тестовый комментарий пользователя ";
            user[0].placeComment("\u041F\u0435\u0440\u0432\u044B\u0439".concat(comusr).concat(uBase[0]["name"]));
            user[0].placeComment("\u0412\u0442\u043E\u0440\u043E\u0439".concat(comusr).concat(uBase[0]["name"]));
            user[0].placeComment("\u0422\u0440\u0435\u0442\u0438\u0439".concat(comusr).concat(uBase[0]["name"]));
            user[1].placeComment("\u041F\u0435\u0440\u0432\u044B\u0439".concat(comusr).concat(uBase[1]["name"]));
            user[1].placeComment("\u0412\u0442\u043E\u0440\u043E\u0439".concat(comusr).concat(uBase[1]["name"]));
            user[2].placeComment("\u041F\u0435\u0440\u0432\u044B\u0439".concat(comusr).concat(uBase[2]["name"]));
            user[2].placeComment("\u0412\u0442\u043E\u0440\u043E\u0439".concat(comusr).concat(uBase[2]["name"]));
            user[0].placeComment("\u0427\u0435\u0442\u0432\u0451\u0440\u0442\u044B\u0439".concat(comusr).concat(uBase[0]["name"]));
            user[1].placeComment("\u0422\u0440\u0435\u0442\u0438\u0439".concat(comusr).concat(uBase[1]["name"]));
            user[3].placeComment("\u041F\u0435\u0440\u0432\u044B\u0439".concat(comusr).concat(uBase[3]["name"], " - idx 10 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"));
            buildReplyButtonsHandlers();
            sTor("testPass", true);
        }
    }
    ;
    testComments();
    /* active user selector control block related */
    function displayActiveUserName(userNumber) {
        var text = "\u0410\u043A\u0442\u0438\u0432\u0435\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C: ".concat(uBase[userNumber]["name"], " (userID ").concat(userNumber, ") *(v.").concat(ver, ")"), nameField = doc.querySelector(".nameField"), textLen = text.length + ver.length + 1, eventBtns1 = doc.querySelectorAll(".eventBtn1");
        eventBtns1.forEach(function (i, n) {
            var iSt = i.style;
            if (n === userNumber) {
                iSt.boxShadow = "0px 0px 3px 2px yellow";
                iSt.background = "greenyellow";
                iSt.borderColor = "lime";
                iSt.fontWeight = "700";
            }
            else {
                iSt.boxShadow = "0px 0px 0px 0px";
                iSt.background = "limegreen";
                iSt.borderColor = "black";
                iSt.fontWeight = "400";
            }
        });
        if (nameField) {
            nameField.style.width = textLen + "ch";
            nameField.innerHTML = text;
        }
    }
    ; //  end of  displayActiveUserName proc
    /* active user selector control block build */
    function buildUserSelector() {
        var lastButton;
        // previous selector block removing
        var prevUsrSlct = doc.querySelector(".usrSelector");
        if (prevUsrSlct) {
            prevUsrSlct.remove();
            doc.querySelector("br").remove();
        }
        var firstDiv = doc.querySelector("div"), usrSlct = putDiv("usrSelector"), usrSlctStyl = usrSlct.style, 
        // 
        selectorLeftMargin = strToNum(getProp(centeredWrap, "margin-left")), nameField = putDiv("nameField", usrSlct), cr = doc.createElement("br"), nFldStyl = nameField.style;
        usrSlctStyl.display = "inline-flex";
        usrSlctStyl.padding = "2px";
        usrSlctStyl.flexFlow = "row wrap";
        usrSlctStyl.marginLeft = selectorLeftMargin + px;
        usrSlctStyl.border = "1px solid lime";
        usrSlctStyl.boxShadow = "5px 5px 0px 0px lightgray";
        if (mobile376) {
            usrSlctStyl.width = (widthBrkPnt - 7) + px;
        }
        nFldStyl.textAlign = "center";
        nFldStyl.padding = "5px 8px 5px 8px";
        nFldStyl.background = "mistyrose";
        doc.body.insertBefore(cr, firstDiv);
        doc.body.insertBefore(usrSlct, cr);
        /* user switch buttons with handlers */
        var uBaseLengthAux = uBase.length - 1;
        uBase.forEach(function (i, n) {
            lastButton = putBtn("eventBtn1", usrSlct, i["name"], function () {
                displayActiveUserName(newUserLogIn(i["name"]));
            });
            lastButton.style.margin = "3px 10px 3px 0px";
            if (n === uBaseLengthAux) {
                lastButton.insertAdjacentElement("afterend", nameField);
            }
        });
    }
    ; // end of active user selector control block building ('buildUserSelector' procedure)
    /* user login procedure */
    function newUserLogIn(userName) {
        var userNumber = usrID["byName"][userName];
        commntsAmount.innerHTML = "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 <span class='commentsQuantity'>(".concat(cBase.length, ")</span>");
        checkWidth();
        activeUser = user[userNumber];
        heartSwitch();
        if (activeUser.showFavOnly()) {
            underLineSwitch(favControl);
        }
        else {
            underLineSwitch(commntsAmount);
        }
        return userNumber;
    }
    ;
    function pageInit() {
        var userNumber = newUserLogIn(activeUser.getName); //to show main comment form at page start/refresh
        buildUserSelector();
        displayActiveUserName(userNumber);
        // set name field top margin on selector height > 30 px
        var blkWidth = getProp(doc.querySelector(".usrSelector"), "height");
        if (strToNum(blkWidth) > 30) {
            doc.querySelector(".nameField").style.marginTop = '10' + px;
        }
    }
    ;
    pageInit();
    /* rebuild comments blocks at screen size change */
    window.onresize = pageInit;
}
; /* end of 		----	M A i N  	P R O C E D U R E 	----	*/
if (auxBase) {
    uBase = auxBase;
    script2();
}
else {
    doc.body.insertBefore(progressWrap, null);
    doc.body.insertBefore(messageWrap, progressWrap);
    messageShow();
    insBrik();
    uBase.forEach(function () {
        requestUserData();
    });
    var intervalId_1 = setInterval(function () {
        messageShow();
        if (!(validUser < uBaseLen) || errorFlag) {
            clearInterval(intervalId_1);
            if (errorFlag) {
                progressWrap.remove();
            }
            else {
                localStorage.clear();
                baseToStor(uBase);
            }
            setTimeout(function () {
                messageWrap.remove();
                progressWrap.remove();
                script2();
            }, timing1);
        }
    }, timing2);
}
