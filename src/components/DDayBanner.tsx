import { getDDay, EXAM_DATE_LABEL } from "@/lib/utils";

export function DDayBanner() {
  const { label, isPast } = getDDay();

  return (
    <div className="card-cute !py-3 text-center">
      <p className="text-caption">시험까지</p>
      <p className="text-stat mt-1">{label}</p>
      <p className="text-caption mt-1">{EXAM_DATE_LABEL}</p>
      {isPast && (
        <p className="text-caption mt-1 font-medium text-pink">시험 끝! 수고했어요 🎉</p>
      )}
    </div>
  );
}
