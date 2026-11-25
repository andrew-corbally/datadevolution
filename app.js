(() => {
  'use strict';

  const menuButton = document.querySelector('.govuk-header__menu-button');
  const navigation = document.getElementById('service-navigation');
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      navigation.classList.toggle('app-open', !open);
      menuButton.textContent = open ? 'Menu' : 'Close';
    });
  }

  const search = document.getElementById('request-search');
  const clear = document.getElementById('clear-search');
  const count = document.getElementById('request-count');
  const noResults = document.getElementById('no-results');
  const cards = [...document.querySelectorAll('.app-request')];
  const filters = [...document.querySelectorAll('.app-filter')];
  let activeFilter = 'all';

  const normalise = value => value.toLowerCase().replace(/[–—]/g, '-').trim();

  function updateResults() {
    const query = normalise(search?.value || '');
    let visible = 0;

    cards.forEach(card => {
      const haystack = normalise(`${card.dataset.tags || ''} ${card.textContent || ''}`);
      const matchesText = !query || query.split(/\s+/).every(term => haystack.includes(term));
      const matchesFilter = activeFilter === 'all' || normalise(card.dataset.tags || '').split(/\s+/).includes(activeFilter);
      const show = matchesText && matchesFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = `Showing ${visible} ${visible === 1 ? 'request' : 'requests'}`;
    if (noResults) noResults.classList.toggle('app-hidden', visible !== 0);
  }

  search?.addEventListener('input', updateResults);
  clear?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    search.focus();
    updateResults();
  });

  function selectFilter(filter) {
    activeFilter = filter;
    filters.forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('app-filter--active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    updateResults();
  }

  filters.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter || 'all')));

  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => selectFilter(link.dataset.filterLink || 'all'));
  });

  updateResults();
})();
