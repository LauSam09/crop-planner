import { useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";

import { requireUserSession } from "~/utils/session.server";
import { Main, NavBar, NavPanel } from "~/components/routes/_app";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUserSession(request);

  return json({ email: user.email });
};

const Layout = () => {
  const { email } = useLoaderData<typeof loader>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebarOpen = () => setSidebarOpen((previous) => !previous);

  const closeSideBar = () => setSidebarOpen(false);

  return (
    <>
      <NavBar email={email} onClickToggle={toggleSidebarOpen} />
      <NavPanel mobileSidebarOpen={sidebarOpen} onClickLink={closeSideBar} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
};

export default Layout;
