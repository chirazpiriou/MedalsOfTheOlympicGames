
// interface Olympic for an olympic country

import { Participation } from "./Participation";

export interface Olympic
{
    id: number,
    country: string,
    participations: Participation []
}