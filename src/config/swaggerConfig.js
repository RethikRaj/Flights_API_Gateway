const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight Booking API Gateway',
      version: '1.0.0',
      description: 'API Gateway for airline management system',
      contact: {
        name: 'Rethik',
        email: 'rethikrajrr@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.flightbooking.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            username: {
              type: 'string',
              description: 'Username (5-30 alphanumeric characters)',
              minLength: 5,
              maxLength: 30,
              example: 'johndoe123'
            },
            password: {
              type: 'string',
              description: 'Password (5-100 characters)',
              minLength: 5,
              maxLength: 100,
              example: 'SecurePass123!'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        UserSignupRequest: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'newuser@example.com'
            },
            username: {
              type: 'string',
              minLength: 5,
              maxLength: 30,
              example: 'newuser123'
            },
            password: {
              type: 'string',
              minLength: 5,
              maxLength: 100,
              example: 'MySecurePassword123!'
            }
          }
        },
        UserSigninRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'MySecurePassword123!'
            }
          }
        },
        SetRoleRequest: {
          type: 'object',
          required: ['id', 'role'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID to assign role to',
              example: 1
            },
            role: {
              type: 'string',
              enum: ['CUSTOMER', 'ADMIN'],
              description: 'Role to assign to user',
              example: 'ADMIN'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            error: {
              type: 'object',
              example: {}
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Operation failed'
            },
            data: {
              type: 'object',
              example: {}
            },
            error: {
              type: 'object',
              properties: {
                explanation: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  example: ['Invalid email format', 'Password too short']
                },
                statusCode: {
                  type: 'integer',
                  example: 400
                }
              }
            }
          }
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routers/v1/*.js', './src/controllers/*.js'] // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
