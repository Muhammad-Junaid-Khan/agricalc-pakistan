(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};

  const search = {
    init() {
      const searchInput = root.document.querySelector('.search-input');
      const searchItems = root.document.querySelectorAll('.searchable .category-card, .searchable .article-card, .searchable .tool-card, .searchable .feature-card, .searchable .card, .searchable-card .category-card, .searchable-card .article-card, .searchable-card .tool-card, .searchable-card .feature-card, .searchable-card .card');
      const clearButton = root.document.querySelector('.search-clear');
      const searchForm = root.document.querySelector('[data-search-form]');
      const resultBox = root.document.querySelector('.result-box');
      const resultTitle = resultBox?.querySelector('h2');
      const resultText = resultBox?.querySelector('p');
      const statusText = root.document.querySelector('[data-search-status]');

      if (!searchInput || !searchItems.length) return;

      const updateStatus = (query, visibleCount) => {
        if (statusText) {
          if (!query) {
            statusText.textContent = 'Enter a keyword to discover guides, calculators, and articles.';
          } else if (visibleCount) {
            statusText.textContent = `Showing ${visibleCount} matching result${visibleCount === 1 ? '' : 's'} for “${query}”.`;
          } else {
            statusText.textContent = 'No matches yet. Try a broader term such as wheat, fertilizer, water, or calculator.';
          }
        }

        if (resultBox && resultTitle && resultText) {
          if (!query) {
            resultTitle.textContent = 'No results layout';
            resultText.textContent = 'If nothing matches your query, try broader terms like crop, fertilizer, water, or calculator.';
          } else if (visibleCount) {
            resultTitle.textContent = 'Search results';
            resultText.textContent = `We found ${visibleCount} item${visibleCount === 1 ? '' : 's'} matching “${query}”.`;
          } else {
            resultTitle.textContent = 'No results found';
            resultText.textContent = 'Try broader terms like crop, fertilizer, water, or calculator.';
          }
        }
      };

      const filterItems = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        searchItems.forEach((item) => {
          const text = item.textContent.toLowerCase();
          const isVisible = !query || text.includes(query);
          item.style.display = isVisible ? '' : 'none';
          if (isVisible) {
            visibleCount += 1;
          }
        });

        if (clearButton) {
          clearButton.classList.toggle('visible', query.length > 0);
        }

        updateStatus(query, visibleCount);
      };

      searchInput.addEventListener('input', filterItems);
      searchForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        filterItems();
      });
      clearButton?.addEventListener('click', () => {
        searchInput.value = '';
        filterItems();
        searchInput.focus();
      });

      filterItems();
    }
  };

  namespace.modules.search = search;
})(window);
