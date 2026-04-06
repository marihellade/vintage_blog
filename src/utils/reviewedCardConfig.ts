import { starsHtml, starsLabel } from './stars';

export type ReviewedCardField =
  | 'cover'
  | 'rating'
  | 'title'
  | 'author'
  | 'status'
  | 'tags'
  | 'year'
  | 'mood'
  | 'cta';

export type ReviewedCardRatingVariant = 'stars' | 'icons' | 'numeric' | 'both';

export interface ReviewedCardConfig {
  frontFields: ReviewedCardField[];
  backFields: ReviewedCardField[];
  enableFlip: boolean;
  ratingVariant: ReviewedCardRatingVariant;
  viewMoreHref: string;
}

export type ReviewedCardConfigInput = Partial<ReviewedCardConfig>;

export const DEFAULT_REVIEWED_CARD_CONFIG: ReviewedCardConfig = {
  frontFields: ['cover', 'rating'],
  backFields: ['title', 'author', 'status', 'tags', 'year', 'cta'],
  enableFlip: true,
  ratingVariant: 'stars',
  viewMoreHref: '/books',
};

export const normalizeReviewedCardConfig = (
  config: ReviewedCardConfigInput = {},
): ReviewedCardConfig => ({
  frontFields: config.frontFields ?? DEFAULT_REVIEWED_CARD_CONFIG.frontFields,
  backFields: config.backFields ?? DEFAULT_REVIEWED_CARD_CONFIG.backFields,
  enableFlip: config.enableFlip ?? DEFAULT_REVIEWED_CARD_CONFIG.enableFlip,
  ratingVariant: config.ratingVariant ?? DEFAULT_REVIEWED_CARD_CONFIG.ratingVariant,
  viewMoreHref: config.viewMoreHref ?? DEFAULT_REVIEWED_CARD_CONFIG.viewMoreHref,
});

export const hasReviewedCardField = (
  fields: ReviewedCardField[],
  field: ReviewedCardField,
) => fields.includes(field);

export const formatReviewedCardRating = (
  rating: number | null | undefined,
  ratingVariant: ReviewedCardRatingVariant,
) => {
  if (typeof rating !== 'number') {
    return null;
  }

  const numericValue = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
  const numericText = `${numericValue}/5`;
  const starText = starsHtml(rating);

  const text = ratingVariant === 'numeric'
    ? numericText
    : ratingVariant === 'both'
      ? `${starText} ${numericText}`
      : starText;

  return {
    text,
    starText,
    numericText,
    label: starsLabel(rating),
  };
};
