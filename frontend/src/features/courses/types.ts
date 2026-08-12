import type {ECStatus} from "@/features/clubs/types.ts";

export interface Course {
    id: string;
    name: string;
    holesCount: number;
    greenFee: number;
    description: string;
    status: ECStatus;
    CreatedAt: string;
    imagesUrls: Array<string>;
    price: number;
}