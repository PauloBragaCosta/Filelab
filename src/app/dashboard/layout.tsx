import Header from "@/components/ui/dashboard/Header";
import Nav from "@/components/Pages/menus/nav";
import PageHeading from "@/components/Pages/menus/page-headings";

export default function Dashboard() {
  return (
    <div>
      <Header/>
      <PageHeading />
      <Nav />
    </div>
  );
}