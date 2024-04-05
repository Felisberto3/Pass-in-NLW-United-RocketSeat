
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-events";
import { registerForEvent } from "./routes/regiter-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkin } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";


const app = fastify()

app.register(fastifyCors, {
    origin: "*"
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    swagger: {
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
            title: "pass.in",
            description:"Documentando a api",
            version: "1.0.0"
        },
    },
    transform: jsonSchemaTransform
})


app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})



app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkin)
app.register(getEventAttendees)





app.listen({ port: 3333 }).then(() => {
    console.log(' HTTP running server')
})