function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function createIssue(id) {
    const projectName = document.getElementById('project-name').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectAuthor = document.getElementById('project-author').value;
    if ("" == projectName || "" == projectDescription || "" == projectAuthor) {
        alert('Please fill all details')
        return;
    }
    closePopup();
}