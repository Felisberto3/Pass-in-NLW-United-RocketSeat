import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prima";

export async function checkin(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {

            schema: {
                params: z.object({
                    attendeeId: z.coerce.number()
                }),
                response: {
                    201: z.null()
                }

            }

        }, async (request, reply) => {

            const { attendeeId } = request.params

            const attendeeCheckIn = await prisma.checkin.findUnique({
                where: {
                    attendeeId
                }
            })

            if (attendeeCheckIn) {
                throw new Error("Attendee already exit");
            }

            await prisma.checkin.create({
                data: {
                    attendeeId
                }
            })

            return reply.status(201).send()

        })
}