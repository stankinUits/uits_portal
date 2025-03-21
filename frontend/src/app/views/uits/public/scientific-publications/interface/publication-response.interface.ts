export interface PublicationResponse {
  id: number,
  name: string,
  year: number,
  author: string[],
  description: string,
  tags: string[],
  pages: number,
  vol_n: number,
  isbn: number,
  source: string | null,
  url: string | null,
  file: string | null,
}
