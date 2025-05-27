export const getDaysRemaining = (startDate: Date, endDate: Date) => {
  const now = new Date();

  const getTimeParts = (diffTime: number) => {
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0 && diffHours === 0)
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    if (diffDays === 0 && diffHours > 0)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;

    return [diffDays, diffHours]
      .filter((v) => v > 0)
      .map((v, i) =>
        i === 0
          ? `${v} day${v !== 1 ? "s" : ""}`
          : `${v} hour${v !== 1 ? "s" : ""}`
      )
      .join(" ");
  };

  if (now < startDate) {
    const diffTime = startDate.getTime() - now.getTime();
    const timeStr = getTimeParts(diffTime);
    return `Starts in ${timeStr}`;
  } else if (now <= endDate) {
    const diffTime = endDate.getTime() - now.getTime();
    const timeStr = getTimeParts(diffTime);
    return `${timeStr}`;
  } else {
    return "Completed";
  }
};

export const getTimeProgress = (startDate: Date, endDate: Date) => {
  const now = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();

  if (now < startDate) return 0;
  if (now > endDate) return 100;

  console.log("Total Duration:", totalDuration);
  console.log("Elapsed Time:", elapsed);
  console.log("Progress Percentage:", (elapsed / totalDuration) * 100);

  return Math.round((elapsed / totalDuration) * 100);
};
