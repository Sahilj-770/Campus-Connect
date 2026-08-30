// CampusConnect - Main JavaScript
// This file is shared by the Home, Dashboard and Contact pages.

// -------------------- DARK MODE --------------------
const darkModeButton = document.createElement('button');
darkModeButton.textContent = '🌙';
darkModeButton.title = 'Toggle dark mode';
darkModeButton.className = 'dark-mode-btn';

document.body.appendChild(darkModeButton);

// Remember the user's theme choice
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeButton.textContent = '☀️';
}

darkModeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'true');
    darkModeButton.textContent = '☀️';
  } else {
    localStorage.setItem('darkMode', 'false');
    darkModeButton.textContent = '🌙';
  }
});

// -------------------- MOBILE MENU --------------------
const nav = document.querySelector('.navbar nav');

if (nav) {
  const menuButton = document.createElement('button');
  menuButton.textContent = '☰';
  menuButton.className = 'menu-btn';
  menuButton.title = 'Open menu';

  document.querySelector('.navbar').appendChild(menuButton);

  menuButton.addEventListener('click', function () {
    nav.classList.toggle('show-menu');
  });
}

// -------------------- BACK TO TOP --------------------
const topButton = document.createElement('button');
topButton.textContent = '↑';
topButton.title = 'Back to top';
topButton.className = 'top-btn';
document.body.appendChild(topButton);

window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    topButton.classList.add('show-top-btn');
  } else {
    topButton.classList.remove('show-top-btn');
  }
});

topButton.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// -------------------- HOME PAGE --------------------
const exploreButton = document.querySelector('.btn-primary');
const quickItems = document.querySelectorAll('.quick-item');

if (exploreButton) {
  exploreButton.addEventListener('click', function () {
    console.log('User clicked Explore Campus');
  });
}

quickItems.forEach(function (item) {
  item.addEventListener('click', function () {
    console.log('Opening: ' + item.textContent.trim());
  });
});

// -------------------- DASHBOARD DATE --------------------
const dateElement = document.getElementById('current-date');

if (dateElement) {
  const date = new Date();
  dateElement.textContent = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

// -------------------- DYNAMIC GREETING --------------------
const dashboardTitle = document.querySelector('.dashboard-welcome h1');

if (dashboardTitle) {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Good Morning! 👋';
  } else if (hour < 18) {
    greeting = 'Good Afternoon! 👋';
  } else {
    greeting = 'Good Evening! 👋';
  }

  dashboardTitle.textContent = greeting + ' What do you want to explore today?';
}

// -------------------- DASHBOARD SEARCH --------------------
const dashboardCards = document.querySelectorAll('.dashboard-section .card');

if (dashboardCards.length > 0) {
  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = '🔍 Search campus services...';
  searchBox.className = 'service-search';

  const firstSection = document.querySelector('.dashboard-section');
  firstSection.insertBefore(searchBox, firstSection.querySelector('.grid'));

  searchBox.addEventListener('input', function () {
    const searchText = searchBox.value.toLowerCase();

    dashboardCards.forEach(function (card) {
      const cardText = card.textContent.toLowerCase();

      if (cardText.includes(searchText)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// -------------------- INTERACTIVE DASHBOARD CARDS --------------------
dashboardCards.forEach(function (card) {
  card.addEventListener('click', function (event) {
    // Do not stop the card's normal links from working.
    if (event.target.tagName !== 'A') {
      card.style.transform = 'scale(0.98)';
      setTimeout(function () {
        card.style.transform = '';
      }, 150);
    }
  });
});

// -------------------- CONTACT FORM VALIDATION --------------------
const contactForm = document.querySelector('.contactform');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || email === '' || message === '') {
      showMessage('Please fill in all fields.', false);
      return;
    }

    if (!email.includes('@')) {
      showMessage('Please enter a valid email address.', false);
      return;
    }

    showMessage('Message sent successfully! Thank you for your feedback.');
    contactForm.reset();
  });
}

// Reusable message popup
function showMessage(text, success = true) {
  const oldMessage = document.querySelector('.js-message');

  if (oldMessage) {
    oldMessage.remove();
  }

  const message = document.createElement('div');
  message.className = 'js-message';
  message.textContent = text;
  message.dataset.success = success;
  document.body.appendChild(message);

  setTimeout(function () {
    message.remove();
  }, 3000);
}
