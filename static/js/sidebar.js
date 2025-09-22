
const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
    sidebar.classList.add('close')
    toggleButton.classList.toggle('rotate')
}

function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate') 
}