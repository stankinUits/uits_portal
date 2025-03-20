export interface ITag {
  id: number;
  name: string;
}

export interface ScienceReadyPublication {
    id?: number,
    name?: string,
    author?: string[]
    description?: string,
    url?: string,
    file?: string,
    tags?: ITag[],
    source?: string,
    year?: number,
    pages?: string,
    vol_n?: string,
    isbn?: string,
    id_for_unique_identify_component?: string
}
