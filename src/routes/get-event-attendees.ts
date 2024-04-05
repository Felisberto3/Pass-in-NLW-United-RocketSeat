import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prima";

export async function getEventAttendees(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {

            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullable().default("0").transform(Number),
                }),
                response: {}

            }

        }, async (request, reply) => {

            const { eventId } = request.params
            const { pageIndex, query } = request.query

            const attendee = await prisma.attendee.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    Checkin:{
                        select:{
                            createdAt: true
                        }
                    }
                },
                where: 
                query ? { 
                    eventId,
                    name:{
                        contains: query
                    }
                }: 
                {
                    eventId
                },
                take: 10,
                skip: pageIndex * 10,
                
            })

            if (!attendee) {
                throw new Error("Event not found");
            }

            return reply.send({
                attendee: attendee.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkedInAt: attendee.Checkin?.createdAt
                    }
                })
            })


        })
}