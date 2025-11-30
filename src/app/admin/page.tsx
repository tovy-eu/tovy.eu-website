import dynamic from "next/dynamic";

const Cms = dynamic(() => import("./Cms"), {
  ssr: false,
  loading: () => <p className="h-screen w-full flex items-center justify-center">Loading Admin Panel...</p>,
});

export default function AdminPage() {
  return <Cms />;
}
