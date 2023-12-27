import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { serializeQueryPlan } from '@apollo/query-planner';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'hotels',
              url: 'http://localhost:5001/graphql',
            },
            {
              name: 'reviews',
              url: 'http://localhost:5002/graphql',
            },
          ],
        }),
        experimental_didResolveQueryPlan: function (options) {
          if (options.requestContext.operationName !== 'IntrospectionQuery') {
            console.log(serializeQueryPlan(options.queryPlan));
          }
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
