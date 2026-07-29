export interface Bid {
  slug: string; // gotten from the auction lot data
  bidAmount: number;
  placedAt: string;
  auctionID: string; // from firebase to get the auction lot data...to listing...after the bid has been won
  id: string;
  userID: string;
  lastBid: number;

  lotTitle: string;
  fullName: string;
  email: string;
  status: string;
}

export interface Listing {
  title: string;
  userName: string;
  userID: string;
  bidAmount: number;
  year: string | number;
  category: string;
  description: string;
  images: string[];
  createdAt: string;
  dimensions: string;
  status: string;
  medium: string;
  slug: string;
  provenance: string;
  condition: string;
  totalBidCounts: number;
  placedAt: string;
}
