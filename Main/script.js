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

// -------------------- MOBILE MENU & ACTIVE LINK --------------------
const navbar = document.querySelector('.navbar, .landing-nav');
const nav = document.querySelector('.navbar nav, .home-nav-links');

if (nav && navbar) {
  const menuButton = document.createElement('button');
  menuButton.textContent = '☰';
  menuButton.className = 'menu-btn';
  menuButton.title = 'Open menu';

  navbar.appendChild(menuButton);

  menuButton.addEventListener('click', function () {
    nav.classList.toggle('show-menu');
    menuButton.textContent = nav.classList.contains('show-menu') ? '✕' : '☰';
  });

  // Automatically close menu when any link is clicked
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('show-menu');
      menuButton.textContent = '☰';
    });
  });

  // Auto-detect and set active class based on current URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a:not(.nav-signin)').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop().split('#')[0];
    if (linkPath === currentPath) {
      nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
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

// -------------------- DYNAMIC & PERSONALIZED GREETING --------------------
const dashboardTitle = document.querySelector('#dashboard-greeting') || document.querySelector('.dashboard-welcome h1');

if (dashboardTitle) {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  const savedName = localStorage.getItem('studentName') || 'Student';
  dashboardTitle.textContent = greeting + ', ' + savedName + ' 👋';
}

// -------------------- DASHBOARD SEARCH --------------------
const dashboardCards = document.querySelectorAll('.dashboard-card, .dashboard-section .card');

if (dashboardCards.length > 0) {
  const searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = 'Search campus services...';
  searchBox.className = 'service-search';

  const gridContainer = document.querySelector('.dashboard-section .grid');
  if (gridContainer && gridContainer.parentElement) {
    gridContainer.parentElement.insertBefore(searchBox, gridContainer);

    searchBox.addEventListener('input', function () {
      const searchText = searchBox.value.toLowerCase();

      dashboardCards.forEach(function (card) {
        const cardText = card.textContent.toLowerCase();

        if (cardText.includes(searchText)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// -------------------- INTERACTIVE DASHBOARD CARDS --------------------
dashboardCards.forEach(function (card) {
  card.addEventListener('click', function (event) {
    if (event.target.tagName !== 'A') {
      card.style.transform = 'scale(0.98)';
      setTimeout(function () {
        card.style.transform = '';
      }, 150);
    }
  });
});

// -------------------- CONTACT FORM VALIDATION --------------------
const contactForm = document.querySelector('.contactform, .contact-form form');

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

// -------------------- HERO DASHBOARD PREVIEW DATE --------------------
// The dashboard preview in the hero section had a hardcoded date "03 SEP".
// This code updates it automatically to today's real date every time the page loads.
const previewDate = document.querySelector('.preview-date');
if (previewDate) {
  const today = new Date();
  // toLocaleDateString('en-IN') gives a date like "7 Sept"
  // We format it ourselves to get "07 SEP" style
  const day = String(today.getDate()).padStart(2, '0');
  const month = today.toLocaleString('en-IN', { month: 'short' }).toUpperCase();
  previewDate.textContent = day + ' ' + month;
}

// -------------------- SCROLL REVEAL --------------------
// IntersectionObserver is a browser API that "watches" elements.
// When a watched element enters the visible part of the screen
// (the viewport), the callback runs and we add the "visible" class.
// This triggers the CSS transition defined in dashboard.css / home.css.

(function () {
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) return; // no reveal elements on this page

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Element is now visible on screen -> add the class
        entry.target.classList.add('visible');
        // Stop watching it - no need to re-animate
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12  // trigger when 12% of the element is visible
  });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
}());

// -------------------- COUNT-UP ANIMATION --------------------
// Elements with class "count-up" and a data-target attribute
// animate their number from 0 up to the target value.
// requestAnimationFrame asks the browser to call our function
// on every screen refresh (~60 times/second) - this creates
// a perfectly smooth animation without using setInterval.

(function () {
  var counters = document.querySelectorAll('.count-up');

  if (counters.length === 0) return;

  counters.forEach(function (counter) {
    var target = parseInt(counter.getAttribute('data-target'), 10);
    var duration = 900; // milliseconds the count-up lasts
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;           // ms elapsed
      var fraction = Math.min(progress / duration, 1); // 0 to 1

      // easeOutQuart: starts fast, slows down at the end
      var eased = 1 - Math.pow(1 - fraction, 4);
      counter.textContent = Math.floor(eased * target);

      if (fraction < 1) {
        requestAnimationFrame(step); // keep going
      } else {
        counter.textContent = target; // make sure we land on exact number
      }
    }

    // Only start the count-up when the card is visible on screen
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}());
