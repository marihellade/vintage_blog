import {
  formatReviewedCardRating,
  hasReviewedCardField,
  normalizeReviewedCardConfig,
  type ReviewedCardConfigInput,
} from '../utils/reviewedCardConfig';

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
  statusText: string;
  viewMoreHref: string;
};

const initReviewedBooks = () => {
  const dataElement = document.querySelector('#reviewed-books-data');
  const configElement = document.querySelector('#reviewed-card-config');
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
    || !(grid instanceof HTMLElement)
    || !(emptyState instanceof HTMLElement)
    || !(pagination instanceof HTMLElement)
    || !(previousButton instanceof HTMLButtonElement)
    || !(nextButton instanceof HTMLButtonElement)
    || !(pageIndicator instanceof HTMLElement)
  ) {
    return;
  }

  const booksPerPage = 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardConfig = configElement instanceof HTMLScriptElement
    ? normalizeReviewedCardConfig(
        JSON.parse(configElement.textContent || '{}') as ReviewedCardConfigInput,
      )
    : normalizeReviewedCardConfig();

  let currentYear = 'all';
  let currentTag = 'all';
  let currentSort = 'date';
  let currentPage = 1;
  let extraFiltersVisible = false;
  let renderVersion = 0;

  const books = JSON.parse(dataElement.textContent || '[]') as ReviewedBook[];

  const escapeHtml = (value: string | number | null | undefined) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

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

  const instructionIdForSlug = (slug: string) => `reviewed-card-help-${slug.replace(/[^a-z0-9_-]/gi, '-')}`;

  const renderTagButtons = (tags: string[]) => tags
    .map((tag) => `<button type="button" class="tag reviewed-card-tag" data-tag-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
    .join('');

  const renderCard = (book: ReviewedBook) => {
    const firstLetter = escapeHtml((book.title || '').charAt(0) || '?');
    const instructionId = instructionIdForSlug(book.slug);
    const rating = formatReviewedCardRating(book.rating, cardConfig.ratingVariant);
    const resolvedViewMoreHref = book.viewMoreHref || cardConfig.viewMoreHref;

    const showFrontCover = hasReviewedCardField(cardConfig.frontFields, 'cover');
    const showFrontRating = hasReviewedCardField(cardConfig.frontFields, 'rating') && Boolean(rating);
    const showFrontTitle = hasReviewedCardField(cardConfig.frontFields, 'title');
    const showFrontAuthor = hasReviewedCardField(cardConfig.frontFields, 'author');
    const showFrontStatus = hasReviewedCardField(cardConfig.frontFields, 'status') && Boolean(book.statusText);
    const showFrontYear = hasReviewedCardField(cardConfig.frontFields, 'year') && Boolean(book.year);
    const showFrontMood = hasReviewedCardField(cardConfig.frontFields, 'mood') && Boolean(book.mood);
    const showFrontTags = hasReviewedCardField(cardConfig.frontFields, 'tags') && book.tags.length > 0;
    const showFrontCopy = showFrontTitle || showFrontAuthor || showFrontStatus || showFrontYear || showFrontMood || showFrontTags;

    const showBackTitle = hasReviewedCardField(cardConfig.backFields, 'title');
    const showBackAuthor = hasReviewedCardField(cardConfig.backFields, 'author');
    const showBackStatus = hasReviewedCardField(cardConfig.backFields, 'status') && Boolean(book.statusText);
    const showBackYear = hasReviewedCardField(cardConfig.backFields, 'year') && Boolean(book.year);
    const showBackMood = hasReviewedCardField(cardConfig.backFields, 'mood') && Boolean(book.mood);
    const showBackRating = hasReviewedCardField(cardConfig.backFields, 'rating') && Boolean(rating);
    const showBackTags = hasReviewedCardField(cardConfig.backFields, 'tags') && book.tags.length > 0;
    const showBackCta = hasReviewedCardField(cardConfig.backFields, 'cta');
    const showBackMeta = showBackStatus || showBackYear || showBackMood || showBackRating;

    const coverMarkup = book.cover
      ? `<img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}" class="book-cover reviewed-book-cover" style="width: var(--reviewed-cover-width); height: var(--reviewed-cover-height);" loading="lazy" />`
      : `<div class="book-cover-placeholder reviewed-book-cover-placeholder" style="background: ${escapeHtml(book.coverGradient)}; width: var(--reviewed-cover-width); height: var(--reviewed-cover-height);"><span>${firstLetter}</span></div>`;

    const frontTagMarkup = showFrontTags
      ? `<div class="tag-row reviewed-tag-row reviewed-tag-row--front">${renderTagButtons(book.tags)}</div>`
      : '';

    const backTagMarkup = showBackTags
      ? `
        <div class="reviewed-card-tag-block">
          <p class="reviewed-card-section-label">Labels</p>
          <div class="tag-row reviewed-tag-row">${renderTagButtons(book.tags)}</div>
        </div>
      `
      : '';

    const frontMetaMarkup = (showFrontStatus || showFrontYear || showFrontMood)
      ? `
        <p class="reviewed-card-line">
          ${showFrontStatus ? `<span class="reviewed-card-status">${escapeHtml(book.statusText)}</span>` : ''}
          ${showFrontStatus && (showFrontYear || showFrontMood) ? '<span class="reviewed-card-divider" aria-hidden="true">·</span>' : ''}
          ${showFrontYear ? `<span class="reviewed-card-status">${escapeHtml(book.year)}</span>` : ''}
          ${showFrontYear && showFrontMood ? '<span class="reviewed-card-divider" aria-hidden="true">·</span>' : ''}
          ${showFrontMood ? `<span class="reviewed-card-status">${escapeHtml(book.mood)}</span>` : ''}
        </p>
      `
      : '';

    const backMetaRows = [
      showBackStatus ? `<dt>Status</dt><dd>${escapeHtml(book.statusText)}</dd>` : '',
      showBackYear ? `<dt>Year</dt><dd>${escapeHtml(book.year)}</dd>` : '',
      showBackMood ? `<dt>Mood</dt><dd>${escapeHtml(book.mood)}</dd>` : '',
      showBackRating && rating
        ? `<dt>Rating</dt><dd><span role="img" aria-label="${escapeHtml(rating.label)}">${escapeHtml(rating.text)}</span></dd>`
        : '',
    ].join('');

    const frontFooterMarkup = (showFrontCopy || showFrontRating)
      ? `
        <div class="reviewed-card-front-footer">
          ${showFrontCopy ? `
            <div class="reviewed-card-front-copy">
              ${showFrontTitle ? `<h3 class="reviewed-card-title reviewed-card-title--front">${escapeHtml(book.title)}</h3>` : ''}
              ${showFrontAuthor ? `<p class="reviewed-card-author reviewed-card-author--front">${escapeHtml(book.author)}</p>` : ''}
              ${frontMetaMarkup}
              ${frontTagMarkup}
            </div>
          ` : ''}
          ${showFrontRating && rating
            ? `<span class="reviewed-card-rating-accent" role="img" aria-label="${escapeHtml(rating.label)}">${escapeHtml(rating.text)}</span>`
            : ''}
        </div>
      `
      : '';

    return `
      <article class="book-card card reviewed-card" data-reviewed-card data-card-title="${escapeHtml(book.title)}" data-flipped="false" data-flip-enabled="${String(cardConfig.enableFlip)}">
        <div
          class="reviewed-card-shell${cardConfig.enableFlip ? ' is-interactive' : ''}"
          ${cardConfig.enableFlip ? 'role="button" tabindex="0" aria-pressed="false"' : ''}
          ${cardConfig.enableFlip ? `aria-label="Show details for ${escapeHtml(book.title)}" aria-describedby="${instructionId}"` : ''}
          ${cardConfig.enableFlip ? 'data-reviewed-card-toggle="true"' : ''}
        >
          ${cardConfig.enableFlip ? `<span id="${instructionId}" class="reviewed-card-sr-only">Press Enter or Space to flip this book card.</span>` : ''}

          <div class="reviewed-card-face reviewed-card-face--front" data-reviewed-face="front" aria-hidden="false">
            <div class="reviewed-card-surface reviewed-card-surface--front">
              ${showFrontCover ? `<div class="reviewed-card-figure reviewed-card-figure--front">${coverMarkup}</div>` : ''}
              ${frontFooterMarkup}
            </div>
          </div>

          <div class="reviewed-card-face reviewed-card-face--back" data-reviewed-face="back" aria-hidden="${cardConfig.enableFlip ? 'true' : 'false'}">
            <div class="reviewed-card-surface reviewed-card-surface--back">
              ${(showBackTitle || showBackAuthor) ? `
                <div class="reviewed-card-back-header">
                  ${showBackTitle ? `<h3 class="reviewed-card-title">${escapeHtml(book.title)}</h3>` : ''}
                  ${showBackAuthor ? `<p class="reviewed-card-author">${escapeHtml(book.author)}</p>` : ''}
                </div>
              ` : ''}

              ${showBackMeta ? `<dl class="reviewed-card-meta-grid">${backMetaRows}</dl>` : ''}
              ${backTagMarkup}
              ${showBackCta ? `<div class="reviewed-card-actions"><a href="${escapeHtml(resolvedViewMoreHref)}" class="reviewed-card-view-more">View more</a></div>` : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  };

  const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const setFlipState = (card: HTMLElement, flipped: boolean) => {
    if (card.dataset.flipEnabled !== 'true') {
      return;
    }

    card.dataset.flipped = String(flipped);

    const toggle = card.querySelector('[data-reviewed-card-toggle]');
    const frontFace = card.querySelector('[data-reviewed-face="front"]');
    const backFace = card.querySelector('[data-reviewed-face="back"]');
    const title = card.dataset.cardTitle ?? 'this book';

    if (toggle instanceof HTMLElement) {
      toggle.setAttribute('aria-pressed', String(flipped));
      toggle.setAttribute(
        'aria-label',
        `${flipped ? 'Hide details for' : 'Show details for'} ${title}`,
      );
    }

    if (frontFace instanceof HTMLElement) {
      frontFace.setAttribute('aria-hidden', String(flipped));
    }

    if (backFace instanceof HTMLElement) {
      backFace.setAttribute('aria-hidden', String(!flipped));
    }
  };

  const toggleCard = (card: HTMLElement) => {
    const nextState = card.dataset.flipped !== 'true';
    setFlipState(card, nextState);
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
    pageIndicator.textContent = formatRomanPageCount(totalPages === 0 ? 0 : currentPage, totalPages);
    previousButton.disabled = totalPages === 0 || currentPage <= 1;
    nextButton.disabled = totalPages === 0 || currentPage >= totalPages;
    pagination.hidden = totalPages === 0;
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

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const cardTag = target?.closest('.reviewed-card-tag[data-tag-filter]');
    const yearButton = target?.closest('[data-year-filter]');
    const tagButton = target?.closest('[data-tag-filter]');
    const sortButton = target?.closest('[data-sort]');
    const filterToggle = target?.closest('#reviewed-filter-toggle');
    const previousShelfButton = target?.closest('#reviewed-prev-button');
    const nextShelfButton = target?.closest('#reviewed-next-button');
    const cardToggle = target?.closest('[data-reviewed-card-toggle]');

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
      return;
    }

    if (cardToggle instanceof HTMLElement) {
      const nestedInteractive = target?.closest('a[href], button, input, select, textarea, summary');

      if (nestedInteractive instanceof HTMLElement && nestedInteractive !== cardToggle) {
        return;
      }

      const card = cardToggle.closest('[data-reviewed-card]');

      if (card instanceof HTMLElement) {
        toggleCard(card);
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;

    if (!(target instanceof HTMLElement) || target.dataset.reviewedCardToggle !== 'true') {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();

    const card = target.closest('[data-reviewed-card]');

    if (card instanceof HTMLElement) {
      toggleCard(card);
    }
  });

  void render();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReviewedBooks, { once: true });
} else {
  initReviewedBooks();
}
