import React, {
  useState,
} from "react";

import AddressCard from "./AddressCard";
import EditAddressForm from "./EditAddressForm";
import { toast } from "react-toastify";

import {
  deleteAddress,
} from "../../services/addressService";

import DeleteAddressModal from "./DeleteAddressModal";
function AddressList({
  addresses,
  fetchAddresses,
  onSelectAddress,
}) {

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState(null);
const [
  addressToDelete,
  setAddressToDelete,
] = useState(null);

const [
  showDeleteModal,
  setShowDeleteModal,
] = useState(false);
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    editingAddress,
    setEditingAddress,
  ] = useState(null);
const handleDelete =
  async () => {

    try {
    
  const responce =   await deleteAddress(
        addressToDelete.id
      );

      toast.success(
        responce.data
      );

      fetchAddresses();

      setShowDeleteModal(
        false
      );

      setAddressToDelete(
        null
      );

    } catch (error) {

      toast.error(
        "Failed To Delete Address"
      );

    }
  };
  return (

    <>
      <div className="address-list">

        {addresses.map(
          (address) => (

           <AddressCard
  key={address.id}
  address={address}
  selectedAddress={selectedAddress}
  setSelectedAddress={setSelectedAddress}
  setEditingAddress={setEditingAddress}
  setShowEditModal={setShowEditModal}
  onSelectAddress={onSelectAddress}
  setAddressToDelete={setAddressToDelete}
  setShowDeleteModal={setShowDeleteModal}
/>
          )
        )}
   
      </div>

      <EditAddressForm
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        address={
          editingAddress
        }
        fetchAddresses={
          fetchAddresses
        }
      />
      <DeleteAddressModal
  showModal={
    showDeleteModal
  }
  setShowModal={
    setShowDeleteModal
  }
  handleDelete={
    handleDelete
  }
/>

    </>
  );
}

export default AddressList;