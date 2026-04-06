type ReviewedBook = {
  slug: string;
  title: string;
  author: string;
  cover: string | null;
  rating: number | null;
  mood: string | null;
  tags: string[];
  year: number | 'Undated';
  dateFinished: string | null;
  coverGradient: string;
  ratingText: string | null;
  ratingLabel: string | null;
  finishedLabel: string;
};

const initReviewedBooks = () => {
  const dataElement = document.querySelector('#reviewed-books-data');
  const browser = document.querySelector('#reviewed-browser');
  const grid = document.querySelector('#reviewed-grid');
  const emptyState = document.querySelector('#reviewed-empty');
  const pagination = document.querySelector('#reviewed-pagination');
  const previousButton = document.querySelector('#reviewed-prev-button');
  const nextButton = document.querySelector('#reviewed-next-button');
  const pageIndicator = document.querySelector('#reviewed-page-indicator-value');
  const filterToggleButton = document.querySelector('#reviewed-filter-toggle');
  const yearButtons = Array.from(document.querySelectorAll('.reviewed-year-pills [data-year-filter]'));
  const tagButtons = Array.from(document.querySelectorAll('.reviewed-tag-pills [data-tag-filter]'));
  const sortButtons = Array.from(document.querySelectorAll('.reviewed-sort-group [data-sort]'));

  if (
    !(dataElement instanceof HTMLScriptElement)
    || !(browser instanceof HTMLElement)
    || !(grid instanceof HTMLElement)
    || !(emptyState instanceof HTMLElement)
    || !(pagination instanceof HTMLElement)
    || !(previousButton instanceof HTMLButtonElement)
    || !(nextButton instanceof HTMLButtonElement)
    || !(pageIndicator instanceof HTMLElement)
  ) {
    return;
  }

  const booksPerPage = 6;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentYear = 'all';
  let currentTag = 'all';
  let currentSort = 'date';
  let currentPage = 1;
  let extraFiltersVisible = false;
  let measuredGridMinHeight = 0;
  let renderVersion = 0;

  const books = JSON.parse(dataElement.textContent || '[]') as ReviewedBook[];

  const escapeHtml = (value: string | number | null | undefined) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const starsForRating = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '✦'.repeat(full) + (half ? '✩' : '') + '✧'.repeat(empty);
  };

  const compareByDate = (a: ReviewedBook, b: ReviewedBook) => {
    const aTime = a.dateFinished ? new Date(a.dateFinished).getTime() : null;
    const bTime = b.dateFinished ? new Date(b.dateFinished).getTime() : null;

    if (aTime !== null && bTime !== null) {
      if (bTime !== aTime) {
        return bTime - aTime;
      }
    } else if (aTime !== null) {
      return -1;
    } else if (bTime !== null) {
      return 1;
    }

    return a.title.localeCompare(b.title);
  };

  const compareByRating = (a: ReviewedBook, b: ReviewedBook) => {
    const aRating = typeof a.rating === 'number' ? a.rating : Number.NEGATIVE_INFINITY;
    const bRating = typeof b.rating === 'number' ? b.rating : Number.NEGATIVE_INFINITY;

    if (bRating !== aRating) {
      return bRating - aRating;
    }

    return compareByDate(a, b);
  };

  const romanNumerals = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ] as const;

  const toRomanNumeral = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
      return '—';
    }

    let remaining = Math.floor(value);
    let roman = '';

    for (const [symbol, amount] of romanNumerals) {
      while (remaining >= amount) {
        roman += symbol;
        remaining -= amount;
      }
    }

    return roman;
  };

  const formatRomanPageCount = (page: number, total: number) => total > 0
    ? `${toRomanNumeral(page)} / ${toRomanNumeral(total)}`
    : '— / —';

  const collapsibleTagButtons = tagButtons.filter(
    (button): button is HTMLButtonElement => button instanceof HTMLButtonElement && button.dataset.collapsibleFilter === 'true',
  );

  const renderCard = (book: ReviewedBook) => {
    const firstLetter = escapeHtml((book.title || '').charAt(0) || '?');
    const coverMarkup = book.cover
      ? `<img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}" class="book-cover reviewed-book-cover" style="width: var(--reviewed-cover-width); height: var(--reviewed-cover-height);" loading="lazy" />`
      : `<div class="book-cover-placeholder reviewed-book-cover-placeholder" style="background: ${escapeHtml(book.coverGradient)}; width: var(--reviewed-cover-width); height: var(--reviewed-cover-height);"><span>${firstLetter}</span></div>`;
    const moodMarkup = book.mood
      ? `<p class="mood-line reviewed-card-mood">${escapeHtml(book.mood)}</p>`
      : '';
    const ratingMarkup = typeof book.rating === 'number'
      ? `<span class="reviewed-card-rating" role="img" aria-label="${escapeHtml(book.ratingLabel || `Rating: ${book.rating} out of 5`)}">${escapeHtml(book.ratingText || starsForRating(book.rating))}</span>`
      : '';
    const tagMarkup = (book.tags || [])
      .slice(0, 2)
      .map((tag: string) => `<button type="button" class="tag reviewed-card-tag" data-tag-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
      .join('');
    const tagSection = tagMarkup
      ? `<div class="tag-row reviewed-tag-row">${tagMarkup}</div>`
      : '';
    const dividerMarkup = ratingMarkup
      ? '<span class="reviewed-card-divider" aria-hidden="true">·</span>'
      : '';

    return `
      <a href="/books/${escapeHtml(book.slug)}" class="book-card card reviewed-card">
        <div class="reviewed-card-figure">
          ${coverMarkup}
        </div>
        <div class="book-info reviewed-card-copy">
          <h3 class="reviewed-card-title">${escapeHtml(book.title)}</h3>
          <p class="meta reviewed-card-author">${escapeHtml(book.author)}</p>
          ${moodMarkup}
          <div class="reviewed-card-line">
            ${ratingMarkup}
            ${dividerMarkup}
            <span class="reviewed-card-status">${escapeHtml(book.finishedLabel)}</span>
          </div>
          ${tagSection}
        </div>
      </a>
    `;
  };

  const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const measureStableGridHeight = () => {
    if (grid.clientWidth === 0) {
      return;
    }

    const totalPages = Math.max(1, Math.ceil(books.length / booksPerPage));
    const measureGrid = document.createElement('div');
    let tallestHeight = 0;

    measureGrid.className = 'book-grid reviewed-grid reviewed-grid--measure';
    measureGrid.setAttribute('aria-hidden', 'true');
    measureGrid.style.width = `${grid.clientWidth}px`;
    browser.appendChild(measureGrid);

    for (let page = 1; page <= totalPages; page += 1) {
      const startIndex = (page - 1) * booksPerPage;
      const pageBooks = books.slice(startIndex, startIndex + booksPerPage);
      measureGrid.innerHTML = pageBooks.map(renderCard).join('');
      tallestHeight = Math.max(tallestHeight, measureGrid.getBoundingClientRect().height);
    }

    measureGrid.remove();

    if (tallestHeight > 0) {
      measuredGridMinHeight = Math.ceil(tallestHeight);
      browser.style.minHeight = `${measuredGridMinHeight}px`;
    }
  };

  const updateControls = () => {
    yearButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const isActive = button.dataset.yearFilter === currentYear;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    tagButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const isActive = button.dataset.tagFilter === currentTag;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    sortButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const isActive = button.dataset.sort === currentSort;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    collapsibleTagButtons.forEach((button) => {
      const isActive = button.dataset.tagFilter === currentTag;
      button.hidden = !extraFiltersVisible && !isActive;
    });

    if (filterToggleButton instanceof HTMLButtonElement) {
      filterToggleButton.setAttribute('aria-expanded', String(extraFiltersVisible));
      filterToggleButton.textContent = extraFiltersVisible ? '− fewer' : `+ ${collapsibleTagButtons.length} more`;
      filterToggleButton.classList.toggle('is-active', extraFiltersVisible);
    }
  };

  const updateNavigation = (totalPages: number) => {
    pagination.hidden = totalPages <= 1;
    previousButton.hidden = totalPages <= 1;
    nextButton.hidden = totalPages <= 1;
    pageIndicator.textContent = formatRomanPageCount(totalPages === 0 ? 0 : currentPage, totalPages);
    previousButton.disabled = totalPages === 0 || currentPage <= 1;
    nextButton.disabled = totalPages === 0 || currentPage >= totalPages;
  };

  const render = async ({ animate = false } = {}) => {
    renderVersion += 1;
    const version = renderVersion;

    const filteredBooks = currentYear === 'all'
      ? books
      : books.filter((book: ReviewedBook) => String(book.year) === currentYear);
    const tagFilteredBooks = currentTag === 'all'
      ? filteredBooks
      : filteredBooks.filter((book: ReviewedBook) => book.tags.includes(currentTag));
    const sortedBooks = [...tagFilteredBooks].sort(currentSort === 'rating' ? compareByRating : compareByDate);
    const totalPages = Math.max(1, Math.ceil(sortedBooks.length / booksPerPage));

    if (currentPage > totalPages) {
      currentPage = 1;
    }

    const startIndex = (currentPage - 1) * booksPerPage;
    const pageBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);
    const cardsMarkup = pageBooks.map(renderCard).join('');

    updateControls();
    updateNavigation(sortedBooks.length === 0 ? 0 : totalPages);
    emptyState.textContent = currentYear === 'all' && currentTag === 'all'
      ? 'No books tucked onto this shelf yet.'
      : 'No books match this shelf filter yet.';
    emptyState.hidden = sortedBooks.length !== 0;

    if (!animate || prefersReducedMotion) {
      grid.classList.remove('flipping-out', 'flipping-in');
      grid.innerHTML = cardsMarkup;
      if (measuredGridMinHeight > 0) {
        browser.style.minHeight = `${measuredGridMinHeight}px`;
      }
      return;
    }

    grid.classList.remove('flipping-in');
    grid.classList.add('flipping-out');
    await wait(150);

    if (version !== renderVersion) {
      return;
    }

    grid.innerHTML = cardsMarkup;
    grid.classList.remove('flipping-out');
    grid.classList.add('flipping-in');
    await nextFrame();

    if (version !== renderVersion) {
      return;
    }

    grid.classList.remove('flipping-in');
  };

  let resizeFrame = 0;
  const handleResize = () => {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      browser.style.minHeight = '0px';
      measureStableGridHeight();
    });
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const cardTag = target?.closest('.reviewed-card-tag[data-tag-filter]');
    const yearButton = target?.closest('[data-year-filter]');
    const tagButton = target?.closest('[data-tag-filter]');
    const sortButton = target?.closest('[data-sort]');
    const filterToggle = target?.closest('#reviewed-filter-toggle');
    const previousShelfButton = target?.closest('#reviewed-prev-button');
    const nextShelfButton = target?.closest('#reviewed-next-button');

    if (cardTag instanceof HTMLButtonElement) {
      event.preventDefault();

      const nextTag = cardTag.dataset.tagFilter;

      if (!nextTag || nextTag === currentTag) {
        return;
      }

      const matchingPill = tagButtons.find(
        (button) => button instanceof HTMLButtonElement && button.dataset.tagFilter === nextTag,
      );

      if (matchingPill instanceof HTMLButtonElement && matchingPill.hidden) {
        extraFiltersVisible = true;
      }

      currentTag = nextTag;
      currentPage = 1;
      void render({ animate: true });

      const filterBlock = document.querySelector('.reviewed-controls');
      if (filterBlock instanceof HTMLElement) {
        filterBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    if (yearButton instanceof HTMLButtonElement) {
      const nextYear = yearButton.dataset.yearFilter;

      if (!nextYear || nextYear === currentYear) {
        return;
      }

      currentYear = nextYear;
      currentPage = 1;
      void render({ animate: true });
      return;
    }

    if (tagButton instanceof HTMLButtonElement) {
      const nextTag = tagButton.dataset.tagFilter;

      if (!nextTag || nextTag === currentTag) {
        return;
      }

      currentTag = nextTag;
      currentPage = 1;
      void render({ animate: true });
      return;
    }

    if (sortButton instanceof HTMLButtonElement) {
      const nextSort = sortButton.dataset.sort;

      if (!nextSort || nextSort === currentSort) {
        return;
      }

      currentSort = nextSort;
      currentPage = 1;
      void render({ animate: true });
      return;
    }

    if (filterToggle instanceof HTMLButtonElement) {
      extraFiltersVisible = !extraFiltersVisible;
      updateControls();
      return;
    }

    if (previousShelfButton instanceof HTMLButtonElement && !previousShelfButton.disabled) {
      const nextPage = currentPage - 1;

      if (nextPage < 1) {
        return;
      }

      currentPage = nextPage;
      void render({ animate: true });
      return;
    }

    if (nextShelfButton instanceof HTMLButtonElement && !nextShelfButton.disabled) {
      const nextPage = currentPage + 1;

      currentPage = nextPage;
      void render({ animate: true });
    }
  });

  measureStableGridHeight();
  window.addEventListener('resize', handleResize);
  void render();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviewedBooks, { once: true });
} else {
  initReviewedBooks();
}
