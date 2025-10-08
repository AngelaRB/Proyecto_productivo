
function toggleSidebar(){
  
const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById("sidebar")
toggleButton.addEventListener('click', toggleSidebar);


    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
}

toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
});


function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate') 
}