import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("db", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  },
  engine: "classic",
  datasource: { 
    url: process.env.DATABASE_URL || ""
  }
} satisfies PrismaConfig;