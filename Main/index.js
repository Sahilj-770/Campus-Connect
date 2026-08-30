
const exploreButton = document.querySelector('.btn-primary');
const quickItems = document.querySelectorAll('.quick-item');


exploreButton.addEventListener('click', function () {
  alert('Welcome to CampusConnect! Explore the campus services.');
});


quickItems.forEach(function (item) {
  item.addEventListener('click', function () {
    console.log('Opening: ' + item.textContent.trim());
  });
});