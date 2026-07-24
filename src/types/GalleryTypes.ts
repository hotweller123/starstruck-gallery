export interface Bid {
  slug: string; // gotten from the auction lot data
  bidAmount: number;
  placedAt: string;
  auctionID: string; // from firebase to get the auction lot data...to listing...after the bid has been won
  id: string;
  userID: string;
}
