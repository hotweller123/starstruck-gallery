// types/met.ts

export interface MetArtwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistNationality: string;
  artistBeginDate: string;
  artistEndDate: string;
  objectDate: string;
  objectName: string;
  classification?:
    | "Paintings"
    | "Sculpture"
    | "Photograph"
    | "Drawings"
    | "Horology"
    | "Codices"
    | "Ceramics"
    | "Calligraphy"
    | "Ceramics-Porcelain";
  medium: string;
  country: string;
  dimensions: string;
  department: string;
  measurements: Record<string, any>[];
  culture: string;
  period: string;
  primaryImage: string; // full resolution JPEG URL
  primaryImageSmall: string; // web-optimized JPEG URL
  additionalImages: string[];
  isPublicDomain: boolean;
  isHighlight: boolean;
  accessionNumber: string;
  accessionYear: string;
  constituents: Constituent[] | null;
  tags: Tag[] | null;
  objectURL: string; // link to artwork on metmuseum.org
}

export interface Constituent {
  constituentID: number;
  role: string;
  name: string;
  constituentULAN_URL: string;
  constituentWikidata_URL: string;
  gender: string;
}

export interface Tag {
  term: string;
  AAT_URL: string;
  Wikidata_URL: string;
}

export interface MetSearchResponse {
  total: number;
  objectIDs: number[] | null;
}

export interface MetDepartment {
  departmentId: number;
  displayName: string;
}

export interface MetDepartmentsResponse {
  departments: MetDepartment[];
}

// Enriched artist profile — built from aggregating artwork data
export interface MetArtistProfile {
  constituentID: number;
  name: string;
  gender: string;
  wikidataURL: string;
  ulanURL: string;
  nationality: string; // from artistNationality on artworks
  bio: string; // from artistDisplayBio on artworks
  beginDate: string; // birth year
  endDate: string; // death year
  totalWorks: number; // total results from search
  departments: string[]; // unique departments their work appears in
  artworks: MetArtwork[]; // their actual works
}

export interface UseArtistReturn {
  artist: MetArtistProfile | null;
  artworks: MetArtwork[];
  isLoading: boolean;
  error: string | null;
  total: number;
  fetchMore: () => void;
  fetchForArtist: (name: string) => void;
  hasMore: boolean;
}
