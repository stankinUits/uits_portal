export interface ScienceReadyPublication {
    id?: number,
    name?: string,
    author?: string[]
    description?: string,
    url?: string,
    file?: File,
    tags?: string[],
    source?: string,
    year?: number,
    id_for_unique_identify_component?: string
}