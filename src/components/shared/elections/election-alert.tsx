import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Ban } from "lucide-react";

const ICONS = {
  upcoming: <AlertCircle className="h-4 w-4 text-amber-600" />,
  ongoing: <CheckCircle className="h-4 w-4 text-green-600" />,
  ineligible: <Ban className="h-4 w-4 text-red-600" />,
};

const STYLES = {
  upcoming: {
    container: "mb-6 bg-amber-50 border-amber-200",
    title: "text-amber-800",
    description: "text-amber-700",
  },
  ongoing: {
    container: "mb-6 bg-green-50 border-green-200",
    title: "text-green-800",
    description: "text-green-700",
  },
  ineligible: {
    container: "mb-6 bg-red-50 border-red-200",
    title: "text-red-800",
    description: "text-red-700",
  },
};

export default function ElectionAlert({
  count,
  type,
  isUnderage = false,
}: {
  count: number;
  type: "upcoming" | "ongoing";
  isUnderage?: boolean;
}) {
  if (isUnderage) {
    const style = STYLES.ineligible;
    return (
      <Alert className={style.container}>
        {ICONS.ineligible}
        <AlertTitle className={style.title}>Not Eligible to Vote</AlertTitle>
        <AlertDescription className={style.description}>
          You must be at least 18 years old to vote in elections.
        </AlertDescription>
      </Alert>
    );
  }

  if (count <= 0) return null;

  const isSingular = count === 1;
  const style = STYLES[type];
  const title = type === "upcoming" ? "Upcoming Elections" : "Active Elections";

  const description =
    type === "upcoming"
      ? `You have ${count} upcoming election${
          !isSingular ? "s" : ""
        } that will open soon.`
      : `There ${isSingular ? "is" : "are"} ${count} active election${
          !isSingular ? "s" : ""
        } where you can cast your vote now.`;

  return (
    <Alert className={style.container}>
      {ICONS[type]}
      <AlertTitle className={style.title}>{title}</AlertTitle>
      <AlertDescription className={style.description}>
        {description}
      </AlertDescription>
    </Alert>
  );
}
