// services/metApi.ts
import type {
  MetArtwork,
  MetSearchResponse,
  MetDepartmentsResponse,
  MetArtistProfile,
} from "../types/metTypes";

const proxy = "https://corsproxy.io/?";
const BASE_URL = `${proxy}https://collectionapi.metmuseum.org/public/collection/v1`;

export const metApi = {
  // Search artworks — returns array of object IDs
  async search(
    query: string,
    options: {
      hasImages?: boolean;
      isPublicDomain?: boolean;
      departmentId?: number;
    } = {},
  ): Promise<MetSearchResponse> {
    const params = new URLSearchParams({ q: query });

    if (options.hasImages) params.set("hasImages", "true");
    if (options.isPublicDomain) params.set("isPublicDomain", "true");
    if (options.departmentId) params.set("departmentId", String(options.departmentId));

    const response = await fetch(`${BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    console.log({ query, params });
    return response.json();
  },

  // Fetch a single artwork by ID
  async getArtwork(id: number): Promise<MetArtwork> {
    const response = await fetch(`${BASE_URL}/objects/${id}`);
    if (!response.ok) throw new Error(`Artwork ${id} not found`);
    return response.json();
  },

  // Fetch multiple artworks by IDs — skips ones with no image
  async getArtworks(ids: number[], limit: number = 20): Promise<MetArtwork[]> {
    const sliced = ids.slice(0, limit);

    const results = await Promise.allSettled(sliced.map((id) => metApi.getArtwork(id)));
    // && r.value.objectName == "Dress"

    return results
      .filter(
        (r): r is PromiseFulfilledResult<MetArtwork> =>
          r.status === "fulfilled" &&
          !!r.value.primaryImageSmall &&
          !!r.value.primaryImage &&
          !!r.value.artistDisplayName &&
          !!r.value.accessionYear &&
          !!r.value.measurements &&
          !!r.value.artistDisplayName &&
          !!r.value.artistDisplayBio &&
          !!r.value.title,
      )
      .map((r) => r.value);
  },

  // Fetch all departments
  async getDepartments(): Promise<MetDepartmentsResponse> {
    const response = await fetch(`${BASE_URL}/departments`);
    if (!response.ok) throw new Error("Failed to fetch departments");
    return response.json();
  },

  // Search artworks by artist name
  async searchByArtist(
    artistName: string,
    options: { hasImages?: boolean; isPublicDomain?: boolean } = {},
  ): Promise<MetSearchResponse> {
    const params = new URLSearchParams({
      q: artistName,
      artistOrCulture: "true",
    });

    if (options.hasImages) params.set("hasImages", "true");
    if (options.isPublicDomain) params.set("isPublicDomain", "true");

    const response = await fetch(`${BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error(`Artist search failed: ${response.status}`);
    return response.json();
  },

  // Build artist profile from their artworks (only for the specific artist)
  buildArtistProfile(artworks: MetArtwork[], total: number): MetArtistProfile | null {
    if (artworks.length === 0) return null;

    // Prefer an artwork that has constituent data for richer metadata
    const sourceArtwork =
      artworks.find((a) => a.constituents && a.constituents.length > 0) || artworks[0];

    const constituent = sourceArtwork?.constituents?.[0];

    // Collect unique departments (only from this artist's works)
    const departments = [...new Set(artworks.map((a) => a.department).filter(Boolean))];

    return {
      constituentID: constituent?.constituentID ?? 0,
      name: sourceArtwork?.artistDisplayName || "Unknown Artist",
      gender: constituent?.gender ?? "",
      wikidataURL: constituent?.constituentWikidata_URL ?? "",
      ulanURL: constituent?.constituentULAN_URL ?? "",
      nationality: sourceArtwork?.artistNationality ?? "",
      bio: sourceArtwork?.artistDisplayBio ?? "",
      beginDate: sourceArtwork?.artistBeginDate ?? "",
      endDate: sourceArtwork?.artistEndDate ?? "",
      totalWorks: total,
      departments,
      artworks, // only this artist's artworks
    };
  },
};
