let dt1, dt2;
let activeIn = document.getElementById('activeIn_default');

function about() {
    let versionNum = document.getElementById('verNum').innerHTML;
    alert(versionNum);
}

function tickMsg() {
    let active = document.getElementById('activeIn_default').value.split('\n')[0].split(',')[0];
    if (active === '') {
        active = document.getElementById('user').value.split('\n')[0].split(',')[0];
    }
    let ticketNum = document.getElementById('tickNum').value;
    if (active === '' || ticketNum === '') {
        return;
    }
    let message = `I have ${active} otp RE: Ticket# ${ticketNum}`;
    clipboard(message);
}

function timeStamp(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getYear() - 100;
    let time = date.toTimeString().substr(0, 8);
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year} - ${time}`;
}

function timeWorked() {
    if (dt1 == null || dt2 == null) {
        return 'Undefined';
    }
    let hours = dt2.getHours() - dt1.getHours();
    let minutes = dt2.getMinutes() - dt1.getMinutes();
    if (minutes < 0) {
        hours--;
        minutes += 60;
    }
    if (hours < 0) {
        return 'Undefined';
    }
    let totalHours = (hours + minutes / 60).toFixed(2);
    if (totalHours < 0.01) {
        totalHours = 0.01;
    }
    return `${totalHours} hrs.`;
}

function getStamp(button) {
    let now = new Date();
    if (button.id === 'ts1button') {
        if (dt1 == null) {
            dt1 = now;
            document.getElementById('ts1').innerHTML = timeStamp(now);
            document.getElementById('ts1').setAttribute('class', 'tsActive');
        } else if (confirm('Reset BEGIN work time?')) {
            dt1 = now;
            document.getElementById('ts1').innerHTML = timeStamp(now);
            document.getElementById('ts1').setAttribute('class', 'tsActive');
        }
    } else {
        if (dt1 != null) {
            dt2 = now;
            document.getElementById('ts2').innerHTML = timeStamp(now);
            document.getElementById('ts2').setAttribute('class', 'tsActive');
        }
    }
    let workedTime = timeWorked();
    document.getElementById('workTime').innerHTML = workedTime;
    document.getElementById('workTime').setAttribute('class', workedTime !== 'Undefined' ? 'tsActive' : 'tsInactive');
}

function forceStamp() {
    if (dt1 == null) {
        let now = new Date();
        dt1 = now;
        document.getElementById('ts1').innerHTML = timeStamp(now);
        document.getElementById('ts1').setAttribute('class', 'tsActive');
    }
}

function resize(element) {
    setTimeout(() => {
        if (element.scrollHeight > element.clientHeight + 1) {
            element.rows += 1;
        }
    }, 1);
}

function fit(element) {
    let minimumRows = element.className.includes('multi') ? 2 : 1;
    while (element.scrollHeight <= element.clientHeight + 1 && element.rows > minimumRows) {
        element.rows -= 1;
    }
    resize(element);
}

function setDate(inputId) {
    const inputField = document.getElementById(inputId);
    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    inputField.value = formattedDate;
}

function copy(src, tgtID) {
    let target = document.getElementById(tgtID);
    if (target.value !== '') return;
    if (target == null) return;
    if (tgtID === 'user') {
        target.value = src.value.split('\n')[0].split(',')[0];
        return;
    }
    if (src.tagName !== target.tagName) {
        console.log(`function copy(src,tgtID): src.tagName = ${src.tagName}, tgt.tagName = ${target.tagName}; element type mismatch`);
        return;
    }
    target.value = src.value;
    if (target.tagName === 'TEXTAREA') {
        while (target.scrollHeight > target.clientHeight + 1) {
            target.rows += 1;
        }
    }
}

function clearAll() {
    ['event', 'newCase'].forEach((cls) => {
        let elements = document.getElementsByClassName(cls);
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = '';
        }
    });
}

/*Copies relevant information from Case Details down to Event Notes*/

function forceCopy() {
    let elements = document.getElementsByClassName('newCase');
    
    Array.from(elements).forEach((element) => {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            let targetId = '';
            switch (element.previousElementSibling ? element.previousElementSibling.textContent : '') {
                case 'User(s) Affected:':
                    targetId = 'contact'; 
                    break;
                case 'Description of Issue:':
                    targetId = 'desc';
                    break;
                case 'Server/Workstation/etc:':
                    targetId = 'hdwrA';
                    break;
                case 'Printer/Scanner:':
                    targetId = 'hdwrB';
                    break;
                case 'Other Hardware:':
                    targetId = 'hdwrC';
                    break;
                case 'Software Affected:':
                    targetId = 'apps';
                    break;
                case 'When Issue Started':
                    targetId = 'started';
                    break;
                // Additional cases can be added as necessary
            }
            if (targetId) {
                let targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.value = element.value;
                }
            }
        }
    });
}


/*Copies New Case section*/

function copyNewCase(sectionClass) {
    let elements = document.getElementsByClassName(sectionClass);
    let copiedText = '';
    let seenLabels = new Set(); // Track the labels we've already added

    Array.from(elements).forEach((element) => {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            if (label && !seenLabels.has(label) && element.value.trim() !== '') {
                copiedText += `${label}\n${element.value.trim()}\n\n`;
                seenLabels.add(label); // Track this label
            }
        } else if (element.isContentEditable) {
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            if (label && !seenLabels.has(label) && element.innerHTML.trim() !== '') {
                // Convert HTML to plain text with line breaks
                let textContent = element.innerHTML
                    .replace(/<div>/gi, '\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/div>/gi, '')
                    .replace(/<\/p>/gi, '\n')
                    .replace(/<p>/gi, '')
                    .replace(/<[^>]+>/gi, ''); // Remove remaining HTML tags
                copiedText += `${label}\n${textContent.trim()}\n\n`;
                seenLabels.add(label); // Track this label
            }
        } else if (element.tagName === 'SPAN' && element.querySelector('input')) {
            // Check for spans with input fields (e.g., "When Issue Started")
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            let inputValue = element.querySelector('input').value.trim();
            if (label && !seenLabels.has(label) && inputValue !== '') {
                copiedText += `${label}\n${inputValue}\n\n`;
                seenLabels.add(label); // Track this label
            }
        }
    });

    copiedText = copiedText.replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    return copiedText.trim();
}


function clipNewCase(sectionClass) {
    let text = copyNewCase(sectionClass);
    clipboard(text);
}


/* Copies Event Notes section and stores information in Last Case Copied */

function copyEvent(sectionClass) {
    let elements = document.getElementsByClassName(sectionClass);
    let copiedText = '';
    let seenLabels = new Set(); // Track the labels we've already added

    Array.from(elements).forEach((element) => {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            if (label && !seenLabels.has(label) && element.value.trim() !== '') {
                copiedText += `${label}\n${element.value.trim()}\n\n`;
                seenLabels.add(label); // Track this label
            }
        } else if (element.isContentEditable) {
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            if (label && !seenLabels.has(label) && element.innerHTML.trim() !== '') {
                // Convert HTML to plain text with line breaks
                let textContent = element.innerHTML
                    .replace(/<div>/gi, '\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/div>/gi, '')
                    .replace(/<\/p>/gi, '\n')
                    .replace(/<p>/gi, '')
                    .replace(/<[^>]+>/gi, ''); // Remove remaining HTML tags
                copiedText += `${label}\n${textContent.trim()}\n\n`;
                seenLabels.add(label); // Track this label
            }
        } else if (element.tagName === 'SPAN' && element.querySelector('input')) {
            // Check for spans with input fields (e.g., "When Issue Started")
            let label = element.previousElementSibling ? element.previousElementSibling.textContent.trim() : '';
            let inputValue = element.querySelector('input').value.trim();
            if (label && !seenLabels.has(label) && inputValue !== '') {
                copiedText += `${label}\n${inputValue}\n\n`;
                seenLabels.add(label); // Track this label
            }
        }
    });

    copiedText = copiedText.replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    // Store copied text in localStorage
    localStorage.setItem('recentCasesContent', copiedText);

    return copiedText.trim();
}


function clipboard(text) {
    let tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
}

function clipEvent(sectionClass) {
    let text = copyEvent(sectionClass);
    clipboard(text);
}

function saveCase(sectionClass) { 
    let text = copyEvent(sectionClass); 
    let existingContent = localStorage.getItem('savedCasesContent') || ''; // Get existing content or initialize as empty
    let updatedContent = existingContent + (existingContent ? '\n\n________________________________________\n\n' : '') + text; 
    // Append new content with separator
    localStorage.setItem('savedCasesContent', updatedContent);
}

function clearSavedCases() {
    localStorage.removeItem('savedCasesContent');
}

function toolsDisp() {
    let bannerHeight = document.getElementById('banner').getBoundingClientRect().bottom;
    document.getElementById('tools').style.height = `${window.innerHeight - bannerHeight}px`;
}

function copyPage() {
    let text = `${document.getElementById('verNum').innerHTML}\n\nCASE DETAILS:\n\n`;
    text += document.getElementById('ts1').innerHTML;
    text += copyNewCase('newCase') ? `\n\n${copyNewCase('newCase')}` : '';
    text += copyEvent('event') ? `\n\nEVENT NOTES:\n\n${copyEvent('event')}` : '';
    text += `\n\n${document.getElementById('ts2').innerHTML}`;
    text += `\n${document.getElementById('workTime').innerHTML}`;
    clipboard(text);
}

function clearAll() {
    ['event', 'newCase'].forEach((cls) => {
        let elements = document.getElementsByClassName(cls);
        Array.from(elements).forEach((element) => {
            if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                element.value = '';
            } else if (element.isContentEditable) {
                element.innerHTML = ''; // Clear contenteditable elements
            }
        });
    });
}

function loadPage() {
    toolsDisp();
    clearAll();
    fillScribz();
}

function focusOutDuo(element, targetId) {
    copy(element, targetId);
    fit(element);
}

