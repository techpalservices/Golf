import type {ECStatus} from "@/features/clubs/types.ts";

export interface Course {
    id: string;
    name: string;
    holeCount: number;
    greenFee: number;
    description: string;
    status: ECStatus;
    createdAt: string;
    imagesUrls: Array<string>;
}