import { useSelector } from "react-redux";

export default function Feature({ name, children }) {
  const flags = useSelector((state) => state.page.community.feature_flags);
  const flag = flags.find((f) => f.key === name);
  if (flag) {
    return children;
  }
  return null
}
