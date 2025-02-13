const mobileToggle = document.querySelector('.mobile-toggle');
const closeSidebar = document.querySelector('.close-sidebar');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.sidebar-overlay');

function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

mobileToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

