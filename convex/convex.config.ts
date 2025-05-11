import aggregate from "@convex-dev/aggregate/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(aggregate, { name: "aggregateReviewsByAlbum" });
app.use(aggregate, { name: "aggregateReviewsByUsers" });
app.use(aggregate, { name: "followerCount" });
app.use(aggregate, { name: "followingCount" });
export default app;

