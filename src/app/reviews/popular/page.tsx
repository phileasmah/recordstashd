
import MostPopularThisWeekFull from "@/components/most-popular-this-week/most-popular-this-week-full";

export default function MostPopularThisWeekPage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo.setHours(0, 0, 0, 0);

  return (
    <MostPopularThisWeekFull oneWeekAgo={oneWeekAgo} />
  );
}
