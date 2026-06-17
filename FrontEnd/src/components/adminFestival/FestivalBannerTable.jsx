import React from "react";

function FestivalBannerTable({
  banners,
  openEditModal,
  handleDelete,
}) {
  return (
    <div className="festival-table-shell">
      <div className="festival-table-wrapper">
        <table className="festival-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Banner</th>
              <th>Festival</th>
              <th>Title</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Product</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td
                  colSpan="13"
                  className="festival-empty"
                >
                  No Festival Banners Found
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
  <tr key={banner.id}>
   
                  <td>
                    {banner.id}
                  </td>

                  <td>
                    <img
                      src={banner.imageUrl}
                      alt={banner.festivalName}
                      className="festival-thumb"
                    />
                  </td>

                  <td>
                    {banner.festivalName}
                  </td>

                  <td>
                    {banner.title}
                  </td>

                 <td>
  {banner.categories?.join(", ") || "-"}
</td>

<td>
  {banner.subCategories?.join(", ") || "-"}
</td>

                 <td>
  {banner.products?.length > 0
    ? banner.products
        .map((p) => p.name)
        .join(", ")
    : "-"}
</td>

<td className="festival-description-cell">
  {banner.description || "-"}
</td>

                  <td>
                    {banner.startDate}
                  </td>

                  <td>
                    {banner.endDate}
                  </td>

                  <td>
                    {banner.priority}
                  </td>

                  <td>
                    {banner.active ? (
                      <span className="festival-status-active">
                        Active
                      </span>
                    ) : (
                      <span className="festival-status-inactive">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="festival-action-group">
                      <button
                        className="festival-action-btn edit"
                        onClick={() =>
                          openEditModal(
                            banner
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="festival-action-btn delete"
                        onClick={() =>
                          handleDelete(
                            banner.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FestivalBannerTable;