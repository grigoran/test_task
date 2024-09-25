import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import routesPlugin from "./Plugins/UserRoutes";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifySwagger } from "@fastify/swagger";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.register(fastifySwagger);
server.register(fastifySwaggerUi);


server.setErrorHandler((error, req, rep) => {
    rep.status(500).send({
        success: false,
        result: {
            error: error.message
        }
    });
});

server.setNotFoundHandler((req, rep) => {
    rep.status(404).send({
        success: false,
        result: {
            error: 'Not found'
        }
    })
})

server.register(routesPlugin);

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  
    server.log.info(`${process.env?.SERVICE_NAME?.toUpperCase()} started`);
  
    console.log(server.printRoutes())
  })