const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Arithmetic API",
      version: "1.0.0",
      description: "API for basic arithmetic operations with security",
    },
    servers: [
      {
        url: "http://localhost:5000", // Change for production
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Your API Key",
        },
        SignatureAuth: {
          type: "apiKey",
          in: "header",
          name: "x-signature",
          description: "HMAC signature generated using secret key",
        },
        TimestampAuth: {
          type: "apiKey",
          in: "header",
          name: "x-timestamp",
          description: "Unix timestamp for request validation",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
        SignatureAuth: [],
        TimestampAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

// ✅ Fix: Initialize swaggerDocs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log("Swagger docs available at /api-docs");
};

module.exports = setupSwagger;
