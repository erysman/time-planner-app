//https://orval.dev/guides/basics
//https://orval.dev/guides/react-query

module.exports = {
    'test-server-file': {
        output: {
            mode: 'single',
            target: './src/clients/time-planner-server/client.ts',
            schemas: './src/clients/time-planner-server/model',
            client: 'react-query',
            mock: false,
            override: {
              mutator: {
                path: './config/axios-instance.ts',
                name: 'customInstance',
              },
            },
          },
          input: {
            target: './config/time-planner-server-openapi.json',
          },
    },
};