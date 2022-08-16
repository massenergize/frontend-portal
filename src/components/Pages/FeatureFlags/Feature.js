import { useSelector } from "react-redux";

export default function Feature({ name,fallback, children}) {
  let flags = []
  const community_flags = useSelector((state) => state.page?.community?.feature_flags)||[];
  const user_flags = useSelector((state) => state.user?.info?.feature_flags)||[];
  flags = community_flags?.concat(user_flags);
  
  const flag = flags.find((f) => f?.key === name);
  if (flag) {
    return children;
  }
  if(fallback){
    return fallback;
  }
  return null
}
