import { useSelector } from "react-redux";
import { IS_LOCAL } from "../../../config";

export default function Feature({ name, fallback, children }) {
  const flags = useSelector((state) => state.page.communityFeatureFlags);
  const flag = (flags || []).find((f) => f?.key === name);

  // Unless we are specifically testing feature flags, its better if every feature is available when we are local mode
  if (IS_LOCAL) return children;
  if (flag) return children;
  if (fallback) return fallback;
  return null;
}
