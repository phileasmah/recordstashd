import aggregate from "@convex-dev/aggregate/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(aggregate, { name: "aggregateReviewsByAlbum" });
app.use(aggregate, { name: "aggregateReviewsByUsers" });
export default app;

