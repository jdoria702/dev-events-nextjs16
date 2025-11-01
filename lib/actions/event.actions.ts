'use server';

import Event from '@/database/event.model'
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug })

        if (!event) {
            return [];
        }

        // _id must not be equal to the event we found about
        // how are we going to know what are similar? Tags
        // if event match tags of original, they must be similar
        // $ne = Not Equal, $in = In Array
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()
    } catch {
        return [];
    }
}