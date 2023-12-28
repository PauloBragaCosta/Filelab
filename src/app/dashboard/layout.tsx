import Header from "@/components/Pages/menus/header";
import Nav from "@/components/Pages/menus/nav";
import PageHeading from "@/components/Pages/menus/page-headings";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <PageHeading />
      <Nav />
    </div>
  );
}