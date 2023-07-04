import React, { useEffect, useState } from "react";
import "./Home.css";
import Button from "@mui/material/Button";
import { InputSwitch } from "primereact/inputswitch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { BsCheckCircleFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Cart from "../Commomn/Cart/Cart";

import DiscountPopup from "../Commomn/DiscountPopup/DiscountPopup";
import DeletePopup from "../Commomn/DeletePopup/DeletePopup";

const offers = [
  {
    name: "Discount Name 1",
    details: " € 250,00 one time",
    type: "one-time",
    value: 25000,
    method: "euro",
  },
  {
    name: "Discount Name 2",
    details: "25 % one time",
    type: "one-time",
    value: 25,
    method: "percentage",
  },
  {
    name: "Discount Name 3",
    details: "20 % monthly first 3 months",
    type: "monthly",
    value: 20,
    duration: 3,
    method: "percentage",
  },
];

function HomePage() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("one-time");
  const [inputType, setInputType] = useState("euro");
  const [inputValue, setInputValue] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [discounts, setDiscounts] = useState(offers);
  const [selectedDiscountForEdit, setSelectedDiscountForEdit] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteDiscount, setDeleteDiscount] = useState(null);
  const [finalDiscount, setfinalDiscount] = useState("100000");
  const [discountName, setDiscountName] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  const generatePriceOption = (option, label) => (
    <div
      className={`price_option ${selectedOption === option ? "selected" : ""}`}
      onClick={() => handleOptionChange(option)}
      key={option}
    >
      {label}
      <BsCheckCircleFill className="check_fin" />
    </div>
  );
  const handleDiscountNameChange = (event) => {
    setDiscountName(event.target.value);
  };
  const handleDurationChange = (e) => {
    const durationValue = e.target.value;
    setDuration(durationValue);
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, "");

    if (inputType === "euro" && Number(value) > 100000) {
      value = "100000";
    }

    if (inputType === "percentage" && Number(value) > 100) {
      value = "100";
    }

    setInputValue(value);
  };

  const handleDropdownChange = (e) => {
    setInputType(e.target.value);
  };

  const handleClickOpen = (discountForEdit) => {
    if (discountForEdit && discountForEdit.value) {
      setSelectedDiscountForEdit(discountForEdit);
      setSelectedOption(discountForEdit.type);
      setInputType(discountForEdit.method);
      setDiscountName(discountForEdit.name);
      setInputValue(
        discountForEdit.value % 1 === 0
          ? discountForEdit.value.toString()
          : (discountForEdit.value * 100).toString()
      );
      if (discountForEdit.duration) {
        setDuration(discountForEdit.duration.toString());
      } else {
        setDuration("");
      }
      setDescription(discountForEdit.details);
      setDiscountedPrice("");
      setEditMode(true);
    } else {
      setSelectedOption("one-time");
      setInputType("euro");
      setSelectedDiscountForEdit(null);
      setDescription("");
      setDuration("");
      setDiscountName("");
      setInputValue("");
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    const discountValue = parseFloat(inputValue);

    if (selectedDiscountForEdit) {
      const updatedDiscount = {
        name: selectedDiscountForEdit.name,
        details: `${inputType === "euro" ? "€ " : ""}${discountValue}${
          inputType === "percentage" ? "% " : ""
        } ${selectedOption} ${
          selectedOption === "monthly" ? duration + " months" : ""
        }`,
        type: selectedOption,
        value: discountValue,
        method: inputType,
        duration: selectedOption === "monthly" ? parseInt(duration) : undefined,
      };

      const updatedDiscounts = discounts.map((discount) =>
        discount.name === selectedDiscountForEdit.name
          ? updatedDiscount
          : discount
      );
      setDiscounts(updatedDiscounts);
    } else {
      const newDiscount = {
        name: discountName,
        details: `${inputType === "euro" ? "€ " : ""}${discountValue}${
          inputType === "percentage" ? "% " : ""
        } ${selectedOption} ${
          selectedOption === "monthly" ? duration + " months" : ""
        }`,
        type: selectedOption,
        method: inputType,
        value: discountValue,
        duration: selectedOption === "monthly" ? parseInt(duration) : undefined,
      };

      const updatedDiscounts = [...discounts, newDiscount];
      setDiscounts(updatedDiscounts);
    }

    setOpen(false);
    setDuration("");
    setInputValue("");
    setDiscountedPrice("");
    setSelectedDiscountForEdit(null);
    setEditMode(false);
  };

  const handleDiscountSelect = (discount) => {
    const index = selectedDiscounts.findIndex(
      (selectedDiscount) => selectedDiscount.name === discount.name
    );

    let updatedSelectedDiscounts = [];

    if (index !== -1) {
      updatedSelectedDiscounts = selectedDiscounts.filter(
        (selectedDiscount) => selectedDiscount.name !== discount.name
      );
    } else {
      updatedSelectedDiscounts = [...selectedDiscounts, discount];
    }

    if (updatedSelectedDiscounts.length > 0) {
      const highestDiscount = updatedSelectedDiscounts.reduce(
        (prev, current) => (current.value > prev.value ? current : prev),
        updatedSelectedDiscounts[0]
      );
      updatedSelectedDiscounts = [highestDiscount];
    }

    setSelectedDiscounts(updatedSelectedDiscounts);
    const totalDiscount = calculateDiscountedPrice(updatedSelectedDiscounts);
    const finalPrice = 100000 - totalDiscount;
    setfinalDiscount(finalPrice);

    if (updatedSelectedDiscounts.length === 0) {
      setDiscountedPrice("");
      setfinalDiscount("100000");
    } else {
      setDiscountedPrice(totalDiscount.toLocaleString());
    }
  };

  const calculateDiscountedPrice = (selectedDiscounts) => {
    let discountedPrices = 100000;

    for (const discount of selectedDiscounts) {
      if (discount.type === "one-time") {
        if (discount.method === "percentage") {
          discountedPrices -= discountedPrices * (discount.value / 100);
        } else {
          discountedPrices -= discount.value;
        }
      } else if (discount.type === "monthly") {
        const monthlyPrice = 10000;
        const discountedMonthlyPrice =
          monthlyPrice - monthlyPrice * (discount.value / 100);

        if (discount.duration && discount.duration <= 3) {
          discountedPrices -= discountedMonthlyPrice * discount.duration;
        } else {
          discountedPrices -= discountedMonthlyPrice * 12;
        }
      }
    }

    return discountedPrices;
  };

  useEffect(() => {
    if (inputValue !== "") {
      let discountValue = inputValue;
      if (inputType === "percentage") {
        discountValue = (parseFloat(inputValue) / 100).toString();
      }

      if (selectedOption === "one-time") {
        const price = 100000;
        let newPrice;
        if (inputType === "percentage") {
          newPrice = price - price * parseFloat(discountValue);
        } else {
          newPrice = price - parseFloat(discountValue);
        }
        setDiscountedPrice(isNaN(newPrice) ? "" : newPrice.toLocaleString());
      } else if (selectedOption === "monthly" && duration !== "") {
        const monthlyPrice = 10000;
        let newPrice;
        if (inputType === "percentage") {
          newPrice = monthlyPrice - monthlyPrice * parseFloat(discountValue);
        } else {
          newPrice = monthlyPrice - parseFloat(discountValue);
        }

        if (duration <= 3) {
          const discountedMonthlyPrice = newPrice * duration;
          setDiscountedPrice(
            isNaN(discountedMonthlyPrice)
              ? ""
              : discountedMonthlyPrice.toLocaleString()
          );
        } else {
          const discountedYearlyPrice = newPrice * 12;
          setDiscountedPrice(
            isNaN(discountedYearlyPrice)
              ? ""
              : discountedYearlyPrice.toLocaleString()
          );
        }
      }
    } else {
      setDiscountedPrice("");
    }
  }, [inputValue, inputType, selectedOption, duration]);

  const handleDeleteConfirmationOpen = (discount) => {
    setDeleteDiscount(discount);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteDiscount = () => {
    if (deleteDiscount) {
      const updatedDiscounts = discounts.filter(
        (discount) => discount.name !== deleteDiscount.name
      );
      setDiscounts(updatedDiscounts);
    }
    setDeleteConfirmationOpen(false);
  };
  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };
  return (
    <div className="homeContainer">
      <Button variant="contained" size="medium" className="btn_menu">
        Previous
      </Button>
      <div className="home_wrapper">
        <div className="component first-component">
          <div className="header">Discounts</div>
          <div className="btn_container">
            <Button
              variant="outlined"
              className="addDiscountButton"
              onClick={handleClickOpen}
            >
              Add manual discount
            </Button>
          </div>
          <div className="discounts-container">
            {discounts.map((discount) => (
              <div
                className={`discount-item ${
                  selectedDiscounts.some(
                    (selectedDiscount) =>
                      selectedDiscount.name === discount.name
                  )
                    ? "selected"
                    : ""
                }`}
                key={discount.name}
              >
                <div className="discount-name">{discount.name}</div>
                <BiSolidPencil
                  className="icon_control"
                  onClick={() => handleClickOpen(discount)}
                />
                <MdDelete
                  className="icon_control delete"
                  onClick={() => handleDeleteConfirmationOpen(discount)}
                />

                <div className="discount-details">{discount.details}</div>
                <div className="discount-switch">
                  <InputSwitch
                    type="checkbox"
                    checked={selectedDiscounts.some(
                      (selectedDiscount) =>
                        selectedDiscount.name === discount.name
                    )}
                    onChange={() =>
                      handleDiscountSelect({
                        ...discount,
                        selected: !selectedDiscounts.some(
                          (selectedDiscount) =>
                            selectedDiscount.name === discount.name
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="btn_container_Pos">
            <div className="btn_prev">
              <Button variant="outlined" className="addDiscountButton">
                Previous
              </Button>
            </div>

            <Button variant="contained" size="medium" className="btn_next">
              Next
            </Button>
          </div>
          <div className="discount_opt">Klantgegevens</div>
          <div className="discount_opt">Productgegevens</div>
          <div className="discount_opt">Checkout</div>
        </div>
        <div className="component second-component">
          <Cart
            selectedDiscounts={selectedDiscounts}
            finalDiscount={finalDiscount}
            discountedPrice={discountedPrice}
          />
        </div>
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DiscountPopup
          description={description}
          handleDurationChange={handleDurationChange}
          editMode={editMode}
          discountedPrice={discountedPrice}
          selectedOption={selectedOption}
          duration={duration}
          handleDropdownChange={handleDropdownChange}
          inputType={inputType}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          selectedDiscountForEdit={selectedDiscountForEdit}
          generatePriceOption={generatePriceOption}
          handleDiscountNameChange={handleDiscountNameChange}
          discountName={discountName}
        />

        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            className="addDiscountButton"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAgree}
            variant="contained"
            size="medium"
            className="btn_next"
          >
            {editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
        <DeletePopup
          deleteDiscount={deleteDiscount}
          handleDeleteDiscount={handleDeleteDiscount}
        />
        <DialogActions>
          <Button
            onClick={handleDeleteDiscount}
            variant="contained"
            size="large"
            className="btn_delete"
          >
            Delete discount
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HomePage;
