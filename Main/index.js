// Get elements from the HTML
const exploreButton = document.querySelector('.btn-primary');
const quickItems = document.querySelectorAll('.quick-item');

// Show a small message when the user clicks Explore Campus
exploreButton.addEventListener('click', function () {
  alert('Welcome to CampusConnect! Explore the campus services.');
});

// Add click feedback to Quick Access items
quickItems.forEach(function (item) {
  item.addEventListener('click', function () {
    console.log('Opening: ' + item.textContent.trim());
  });
});