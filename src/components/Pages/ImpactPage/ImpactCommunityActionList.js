import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import LoadingCircle from "../../Shared/LoadingCircle";
import { smartString } from "../../Utils";

const LOADING = "LOADING";
function ImpactCommunityActionList({ list, history, links }) {
  const [listResponse, setListResponse] = useState(LOADING);

  useEffect(() => {
    setListResponse(list);
  }, [list]);

  if (listResponse === LOADING) return <LoadingCircle simple />;

  if (!listResponse)
    return (
      <p style={{ color: "var(--app-theme-orange)" }}>
        Sorry, for some reason we could not load the list of actions that people
        in your community have taken
      </p>
    );

  const columns = [
    {
      name: "Action Name",
      selector: (row) => row.name,
      sortable: true,
      width: 40,
      cell: ({ name, id }) => (
        <span
          className="touchable-opacity me-team-table-cell"
          onClick={() => history?.push(links?.actions + "/" + id)}
        >
          {smartString(name, 40)}
        </span>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      width: 20,
    },
    {
      name: "# Done",
      selector: (row) => row.done_count,
      sortable: true,
      center: true,
      width: 6,
    },
    {
      name: "Carbon savings",
      selector: (row) => row.carbon_total,
      sortable: true,
      center: true,
      width: 12,
    },
    {
      name: "# Todo",
      selector: (row) => row.todo_count,
      sortable: true,
      center: true,
      width: 6,
    },
  ];

  return (
    <div
      className="z-depth-float me-anime-open-in"
      style={{ padding: 15, borderRadius: 10 }}
    >
      <center><h4>Actions Completed by Community Members</h4></center>
      <DataTable columns={columns} data={listResponse} dense />
    </div>
  );
}

export default ImpactCommunityActionList;
