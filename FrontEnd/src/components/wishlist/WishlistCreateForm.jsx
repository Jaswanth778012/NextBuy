import React, {
  useState,
} from "react";

function WishlistCreateForm({
  onCreate,
  onClose,
}) {
  const [name, setName] =
    useState("");

  const [isPublic, setIsPublic] =
    useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onCreate({
      wishListName: name,
      isPublic: isPublic,
    });

    setName("");
    setIsPublic(false);
  };

  return (
    <div className="wishlist-modal-overlay">

      <div className="wishlist-modal">

        <h3>
          Create Wishlist
        </h3>

        <input
          type="text"
          placeholder="Enter wishlist name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <label className="wishlist-checkbox">

          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic(
                e.target.checked
              )
            }
          />

          Public Wishlist

        </label>

        <div className="wishlist-modal-actions">

          <button
            onClick={
              handleSubmit
            }
          >
            Create Wishlist
          </button>

          <button
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default WishlistCreateForm;