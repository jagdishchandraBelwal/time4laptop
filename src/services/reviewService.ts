import { Review } from '../types';

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'lap-01',
    userName: 'Karan Mehra',
    userEmail: 'karan.m@gmail.com',
    rating: 5,
    title: 'Looks brand new! Incredible condition',
    comment: 'Ordered ThinkPad T14 Grade A. Honestly looks like an unboxed unit. Battery health 96%, original charger included. Delivered in 2 days to Pune via Blue Dart.',
    verifiedPurchase: true,
    date: '2026-10-15',
    isApproved: true
  },
  {
    id: 'rev-02',
    productId: 'lap-02',
    userName: 'Sneha Rao',
    userEmail: 'sneha.rao@outlook.com',
    rating: 5,
    title: 'Best deal for MacBook Air M1',
    comment: 'Grade A condition with 100% genuine Apple diagnostics pass. Super fast dispatch and 1-year warranty paper inside box.',
    verifiedPurchase: true,
    date: '2026-10-18',
    isApproved: true
  },
  {
    id: 'rev-03',
    productId: 'mob-01',
    userName: 'Amit Trivedi',
    userEmail: 'amit.t@yahoo.com',
    rating: 4,
    title: 'iPhone 13 Grade B - Small scuff on edge, screen pristine',
    comment: 'Battery health is 88%, FaceID and cameras are top notch. Very transparent grading system by Time4Laptop.',
    verifiedPurchase: true,
    date: '2026-10-20',
    isApproved: true
  }
];

class ReviewService {
  private storageKey = 'time4laptop_reviews';

  getReviews(productId?: string): Review[] {
    const raw = localStorage.getItem(this.storageKey);
    let list: Review[] = INITIAL_REVIEWS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    if (productId) {
      return list.filter(r => r.productId === productId && r.isApproved);
    }
    return list;
  }

  getAllReviewsForAdmin(): Review[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  }

  addReview(newReview: Omit<Review, 'id' | 'date' | 'isApproved'>): Review {
    const all = this.getAllReviewsForAdmin();
    const review: Review = {
      ...newReview,
      id: 'rev-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      isApproved: true // default approved for demo, can be toggled by admin
    };
    const updated = [review, ...all];
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return review;
  }

  toggleReviewApproval(reviewId: string): Review[] {
    const all = this.getAllReviewsForAdmin();
    const updated = all.map(r => r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }

  deleteReview(reviewId: string): Review[] {
    const all = this.getAllReviewsForAdmin();
    const updated = all.filter(r => r.id !== reviewId);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return updated;
  }
}

export const reviewService = new ReviewService();
