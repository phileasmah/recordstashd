
import MostPopularThisWeekFull from "@/components/most-popular-this-week/most-popular-this-week-full";

export default function MostPopularThisWeekPage() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  oneMonthAgo.setHours(0, 0, 0, 0);

  return (
    <MostPopularThisWeekFull oneWeekAgo={oneMonthAgo} />
  );
}
