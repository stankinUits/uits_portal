import {
  ScienceRawPublication
} from '@app/views/uits/public/scientific-publications/interface/science-publications-from-scholar.interface';

export interface SciencePublicationResponseInterface {
  isOverRequested: boolean
  sciencePublicationCards: ScienceRawPublication[]
}
