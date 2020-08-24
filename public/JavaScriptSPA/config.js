// @ts-check

const config = {
  endpoint: "https://giga.documents.azure.com:443/",
  key: "31N8ElaFSu4BeMv6cIfCrRgwzGfbxyZ8a7IKjssbAJ10gYswIwtcEXB2nnA0RoQACQvXknVyoNNP405vfRfs4g==",
  databaseId: "ToDoList",
  containerId: "Items",
  partitionKey: { kind: "Hash", paths: ["/category"] }
};

module.exports = config;
