import { getDDay, EXAM_DATE_LABEL } from "@/lib/utils";

export function DDayBanner() {
  const { label, isPast } = getDDay();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-lavender/50 to-pink/40 px-4 py-2.5 text-center shadow-sm">
      <p className="text-[10px] text-soft-muted">시험까지</p>
      <p className="text-2xl font-semibold tracking-wide text-soft-text">{label}</p>
      <p className="text-[10px] text-soft-muted">{EXAM_DATE_LABEL}</p>
      {isPast && (
        <p className="mt-0.5 text-[10px] font-medium text-pink">시험 끝! 수고했어요 🎉</p>
      )}
    </div>
  );
}
