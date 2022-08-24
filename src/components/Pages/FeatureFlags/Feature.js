import { useSelector } from "react-redux";

export default function Feature({ name, fallback, children }) {
  const flags = useSelector((state) => state.page.community.feature_flags);
  const flag = (flags || []).find((f) => f?.key === name);
  if (flag) {
    return children;
  }
  if (fallback) {
    return fallback;
  }
  return null;
}
